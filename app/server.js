/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const _ = require('underscore');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const sessions = require('client-sessions');
const commander = require('commander');
const fileUpload = require('express-fileupload');
const Logger = require('../lib/logger');
const LocalUtil = require('../lib/local-util');

const logger = new Logger({
    workerId: 1, // cluster.worker.id
});
const localUtil = new LocalUtil();
const cookieMaxAgeSession = (30 * 86400 * 1000);

const app = express();

commander
    .option('-c, --config <file>', 'configuration file path', './config/config.js')
    .parse(process.argv);

// eslint-disable-next-line
const config = require(commander.config);
if (config) {
    if (_.isObject(config) && _.isObject(config.log)) {
        logger.set('log', config.log);
    }
}

app.use(bodyParser.json());
app.use(compression({
    threshold: 512,
}));

app.use(sessions({
    cookieName: 'session', // cookie name dictates the key name added to the request object
    secret: 'mAke noDE.js gREat again!', // should be a large unguessable string
    duration: cookieMaxAgeSession, // how long the session will stay valid in ms
    cookie: {
        path: '/', // cookie will only be sent to requests under '/api'
        maxAge: cookieMaxAgeSession, // duration of the cookie in milliseconds, defaults to duration above
        ephemeral: false, // when true, cookie expires when the browser closes
        httpOnly: true, // when true, cookie is not accessible from javascript
        secure: false, // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle
        // SSL not in your node process
    },
}));

app.use(fileUpload());

// Include route handlers ------------------------
const rssRouter = require('./routes/rss');

rssRouter.setConfig(config, {
    workerId: 1, // cluster.worker.id,
});
const apiRouter = require('./routes/api');

apiRouter.setConfig(config, {
    workerId: 1, // cluster.worker.id,
});
const webRouter = require('./routes/web');

webRouter.setConfig(config, {
    workerId: 1, // cluster.worker.id,
});
const imageRouter = require('./routes/image');

imageRouter.setConfig(config, {
    workerId: 1, // cluster.worker.id,
    photoPath: config.adapter.markdown.photoPath,
    photoCachePath: config.adapter.markdown.photoCachePath,
});
const searchRouter = require('./routes/search');

searchRouter.setConfig(config, {
    workerId: 1, // cluster.worker.id,
});

// Register routes -------------------------------
app.use('/api', apiRouter);
app.use('/rss', rssRouter);
app.use('/static', localUtil.setCacheHeaders);
app.use('/static', express.static(config.blog.staticFilesPath));
app.use('/.well-known/', express.static(config.blog.textFilesPath));
app.use('/pho/', imageRouter);
app.use('/search/', searchRouter);

app.use('/', webRouter);

// Start the server ------------------------------
const server = app.listen(config.app.port, () => {
    const host = server.address().address;
    const port = server.address().port;
    logger.log('info', `Something happens at http://${host}:${port}/`);
    // heapdump / inspecting for memory leaks.
    // console.log('$ kill -USR2 ' + process.pid + ' && curl http://localhost:8080/tech/_test_col && ' +
    //    'curl http://localhost:8080/gc && curl http://localhost:8080/gc');
});
