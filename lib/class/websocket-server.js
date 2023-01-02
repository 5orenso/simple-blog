'use strict';

const WebSocketServer = require('websocket').server;
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const { CollectionModel } = require('node-simple-collectionmodel');
const {
    util, tc,
} = require('node-simple-utilities');


// const eventSchema = require('./mongoose/eventSchema');
const Event = require('./event');

// CollectionModel.addSchemas({
//     event: eventSchema,
// });

const skipTypes = ['connectionStatus', 'inbox'];
const maxHistoryElements = 50;
const maxInitialHistoryElements = 2000; // We need to make sure we get all elements up to today.
const timeToWaitBeforeWebsocketIsStarted = 2000;
const milliSecondsBackInTime = 10000;
const initialEventLastPollTime = util.epoch() - (86400 * 1000 * 1);
const pollEventIntervalMs = 2000;


function noop() {}

function heartbeat() {
    if (util.isDevelopment()) {
        console.log('websocket-server: PONG');
    }
    this.isAlive = true;
}

class WebsocketServer extends CollectionModel {
    constructor(config) {
        super('websocketServer', config);
        this.fields = util.cleanObject({
            ip: 1,
        }, 1);
        this.webSocketsServerPort = config?.websocket?.port || 1337;
        this.pollEventIntervalMs = pollEventIntervalMs;
        this.milliSecondsBackInTime = milliSecondsBackInTime;
        this.eventLastPollTime = initialEventLastPollTime;
        this.history = {};
        this.clients = [];
        this.sentEvents = {};
        this.event = new Event();
    }

    async getHistory() {
        const events = await this.event.find({
            time: { $gte: this.eventLastPollTime },
            type: { $nin: skipTypes },
        }, null, { limit: maxInitialHistoryElements });

        this.eventLastPollTime = util.epoch() - this.milliSecondsBackInTime;
        if (Array.isArray(events)) {
            for (let i = 0, l = events.length; i < l; i += 1) {
                const event = events[i];
                this.addMessageToHistory(event);
            }
        }
        this.pollEvent();
    }

    run() {
        this.server = http.createServer(() => {
            // Not important for us. We're writing WebSocket server, not HTTP server
        });
        this.server.listen(this.webSocketsServerPort, () => {
            console.log(`${(new Date())} WebSocket server is listening on port ${this.webSocketsServerPort}`);
        });
        this.wsServer = new WebSocketServer({
            // WebSocket server is tied to a HTTP server. WebSocket request is just an enhanced HTTP request.
            // For more info: http://tools.ietf.org/html/rfc6455#page-6
            httpServer: this.server,
            keepalive: true,
            keepaliveInterval: 5000,
            dropConnectionOnKeepaliveTimeout: true,
            keepaliveGracePeriod: 5000,
        });
        this.wsServer.on('request', request => this.handleConnectRequest(request));
        setTimeout(() => this.getHistory(), timeToWaitBeforeWebsocketIsStarted);
        this.pingIntervalTimer = setInterval(() => this.pingClients(), 10000);
    }

    pingClients() {
        for (let i = 0, l = this.clients.length; i < l; i += 1) {
            const conn = this.clients[i];
            if (conn.isAlive === false) {
                return conn.close();
            }
            conn.isAlive = false;
            conn.ping(noop);
        }
        return true;
    }

    checkAllConnectionAndPurgeDead() {
        for (let i = 0; i < this.clients.length; i += 1) {
            const conn = this.clients[i];
            if (!conn.opt.userId || !conn.opt.userName) {
                conn.close();
                this.clients.splice(conn.opt.index, 1);
            }
        }
    }

    handleMessageEvent(object) {
        if (object.to) {
            const json = JSON.stringify({ type: object.type, data: object });
console.log('handleMessageEvent', { object, json });
            this.checkAllConnectionAndPurgeDead();
            const conn = this.clients.find(c => c.opt.userId === object.to);
            this.sendMessageToClient(conn, object, json);
        }
    }

    sendMessageToClient(connection, object, json) {
        const connId = connection.opt?.uuid;
console.log('sendMessageToClient', { connId, object, json });
        if (connId) {
            if (!tc.asNumber(this.sentEvents, connId, object.id)) {
                if (!tc.asString(this.sentEvents, connId)) {
                    this.sentEvents[connId] = {};
                }
                this.sentEvents[connId][object.id] = 1;
                connection.sendUTF(json);
            } else if (util.isDevelopment() && util.isDebug()) {
                console.log(`- - - - > ${util.isoDate()} MessageId: ${object.id} already sent to connId: ${connId}`);
            }
        }
    }

    addMessageToHistory(event) {
        if (skipTypes.indexOf(event.type) < 0) {
            if (!Array.isArray(this.history[event.type])) {
                this.history[event.type] = [];
            }
            this.history[event.type].push(event);
            this.history[event.type] = this.history[event.type].slice(-maxHistoryElements);
        }
    }

    pollEvent() {
        this.timerToken = setInterval(() => this.doPollEvent(), this.pollEventIntervalMs);
        // clearTimeout(this.timerToken);
    }

    async doPollEvent() {
        const events = await this.event.find({
            time: { $gte: this.eventLastPollTime },
        });
// console.log('events', events);

        this.eventLastPollTime = util.epoch() - this.milliSecondsBackInTime;
        if (Array.isArray(events)) {
            for (let i = 0, l = events.length; i < l; i += 1) {
                const event = events[i];
                this.addMessageToHistory(event);
                this.handleMessageEvent(event);
            }
        }
    }

    handleConnectRequest(request) {
        if (util.isDevelopment()) {
            console.log(`${(new Date())} Connection from origin ${request.origin}. ${JSON.stringify(request.url)}`);
        }
        // TODO: Write a valid check for request.origin.
        // accept connection - you should check 'request.origin' to
        // make sure that client is connecting from your website
        // (http://en.wikipedia.org/wiki/Same_origin_policy)
        const connection = request.accept(null, request.origin);
        const opt = {
            connection,
            index: this.clients.push(connection) - 1, // we need to know client index to remove them on 'close' event
            userName: false,
            userId: false,
            startTime: util.epoch(),
            uuid: uuidv4(),
        };
        connection.opt = opt;

        connection.isAlive = true;
        connection.on('pong', heartbeat);

        if (util.isDevelopment()) {
            console.log(`${(new Date())} Connection accepted. ${JSON.stringify(opt.uuid)}`);
        }
        // // send back the history as the first thing when someone connects:
        // const keys = Object.keys(this.history);
        // for (let i = 0, l = keys.length; i < l; i += 1) {
        //     const key = keys[i];
        //     const eventsHistoryType = this.history[key];
        //     if (eventsHistoryType.length > 0) {
        //         for (let j = 0, k = eventsHistoryType.length; j < k; j += 1) {
        //             const event = eventsHistoryType[j];
        //             const json = JSON.stringify({ type: event.type, data: event });
        //             this.sendMessageToClient(connection, event, json);
        //         }
        //     }
        // }
        // Add handlers to this connection:
        opt.connection.on('message', message => this.handleIncomingMessage(message, opt));
        opt.connection.on('close', conn => this.handleCloseConnection(conn, opt));
        opt.connection.on('error', conn => this.handleCloseConnection(conn, opt));
    }

    sendConnectionStatus() {
        this.checkAllConnectionAndPurgeDead();
        const obj = {
            group: 'admin',
            type: 'connectionStatus',
            time: util.epoch(),
            count: this.clients.length,
        };
        this.event.save(obj);
    }

    handleCloseConnection(conn, opt) {
        if (opt.userName !== false) {
            if (util.isDevelopment()) {
                console.log(`${(new Date())} Peer ${conn.remoteAddress} disconnected. User: ${opt.userName}`);
            }
            // remove user from the list of connected clients
            this.clients.splice(opt.index, 1);
            this.sendConnectionStatus();
            delete this.sentEvents[opt.uuid];
        }
    }

    handleIncomingMessage(message, $opt) {
        // console.log('message', message);
        // message { type: 'utf8', utf8Data: '{"userId":2,"type":"auth"}' }
        const opt = $opt;
        if (message.type === 'utf8') {
            let messageObj;
            let messageTxt;
            try {
                messageObj = JSON.parse(message.utf8Data);
            } catch (e) {
                messageTxt = message.utf8Data;
                console.log('Cannot parse message', messageTxt);
            }
            if (typeof messageObj === 'object') {
                switch (messageObj.type) {
                    case 'auth':
                        if (messageObj.userId) {
                            opt.userId = messageObj.userId;
                            opt.userName = messageObj.userName;
                            this.sendConnectionStatus();
                            if (util.isDevelopment()) {
                                console.log(`- - - - > ${util.isoDate()} User [${opt.userId}] is known as: ${opt.userName}.`);
                            }
                            this.handleMessageEvent({
                                to: opt.userId,
                                message: 'Welcome to the chat!',
                            });
                        }
                        break;
                    default:
                        if (util.isDevelopment()) {
                            console.log(`${(new Date())} Received Message from ${opt.userName}: ${JSON.stringify(message)}`);
                        }
                        const obj = {
                            to: messageObj.to,
                            type: 'message',
                            time: util.epoch(),
                            message: message,
                            fromName: opt.userName,
                            from: opt.userId,
                        };
                        this.event.save(obj);
                        break;
                }
            }
            // else if (typeof messageTxt === 'string') {
            //     if (util.isDevelopment()) {
            //         console.log(`${(new Date())} Received Message from ${opt.userName}: ${JSON.stringify(message)}`);
            //     }
            //     const obj = {
            //         type: 'message',
            //         time: util.epoch(),
            //         text: messageTxt,
            //         author: opt.userName,
            //         authorId: opt.userId,
            //     };
            //     this.event.save(obj);
            // }
        }
    }
}

module.exports = WebsocketServer;
