/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const MongooseHelper = require('../lib/class/mongoose');
const _ = require('underscore');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const sessions = require('client-sessions');
const commander = require('commander');
const fileUpload = require('express-fileupload');
const Logger = require('../lib/logger');
const LocalUtil = require('../lib/local-util');

const logger = new Logger();
const localUtil = new LocalUtil();
const cookieMaxAgeSession = (30 * 86400 * 1000);

const app = express();

commander
    .option('-c, --config <file>', 'configuration file path', './config/config.js')
    .parse(process.argv);

// eslint-disable-next-line
const config = require(commander.config);
if (config) {
    MongooseHelper.connectGlobal(config);
    if (_.isObject(config) && _.isObject(config.log)) {
        logger.set('log', config.log);
    }
}

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }))

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

rssRouter.setConfig(config);
const apiRouter = require('./routes/api');

apiRouter.setConfig(config);
const webRouter = require('./routes/web');

webRouter.setConfig(config);
const imageRouter = require('./routes/image');

imageRouter.setConfig(config, {
    photoPath: config.adapter.markdown.photoPath,
    photoCachePath: config.adapter.markdown.photoCachePath,
});
const searchRouter = require('./routes/search');

searchRouter.setConfig(config);

// /pho/team-raske-poter/i-dag-mistet-jeg-spannet/simpleBlog-07ca5a2f-206c-417c-b0a7-3a557552a640.jpg?w=800
// /220x/litt.no/aeropress/2012-05-25 11.26.27.jpg

// Rewrite the URL before it gets to Express' static middleware.
app.use('/pho/', (req, res, next) => {
    // req.url = req.url.replace(/\/([^\/]+)\.[0-9a-f]+\.(css|js|jpg|png|gif|svg)$/, "/$1.$2");
    const regexp = new RegExp(/^\/(.+?)\?w=([0-9]+)/);
    const found = req.url.match(regexp);
    if (!Array.isArray(found)) {
        next();
    }
    const path = found[1];
    const size = found[2];
    const allowedSizes = [150, 220, 400, 800, 1024, 1280, 1600, 1920];
    const closest = allowedSizes.sort((a, b) => Math.abs(size - a) - Math.abs(size - b))[0];
    const target = `https://${config.blog.imageServer}/${closest}x/${config.blog.imagePath}/${path}`;
    res.redirect(301, target);
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

app.use((error, req, res, next) => {
    const message = {};
    if (process.env.nodeEnv === 'development') {
        message.name = error.name;
        message.message = error.message;
        message.stack = error.stack;
    } else {
        message.name = error.name;
        message.message = error.message;
    }

    res.json({ message });
});

// Start the server ------------------------------
const server = app.listen(config.app.port, () => {
    const host = server.address().address;
    const port = server.address().port;
    logger.log('info', `Something happens at http://${host}:${port}/`);
    // heapdump / inspecting for memory leaks.
    // console.log('$ kill -USR2 ' + process.pid + ' && curl http://localhost:8080/tech/_test_col && ' +
    //    'curl http://localhost:8080/gc && curl http://localhost:8080/gc');
});
