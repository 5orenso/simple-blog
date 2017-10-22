/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');
const Logger = require('../../lib/logger');
const LocalUtil = require('../../lib/local-util');

const logger = new Logger();
const localUtil = new LocalUtil();

const apiRouter = express.Router();
apiRouter.setConfig = function (conf, opt) {
    apiRouter.config = conf;
    apiRouter.opt = opt;
    if (opt) {
        if (opt.hasOwnProperty('workerId')) {
            logger.set('workerId', opt.workerId);
        }
    }
    if (conf) {
        if (_.isObject(conf) && _.isObject(conf.log)) {
            logger.set('log', conf.log);
        }
    }
};
// middleware to use for all requests
// var accessLogStream = fs.createWriteStream(appPath + '/logs/api-access.log', {flags: 'a'});
// setup the logger
// apiRouter.use(morgan('combined', {stream: accessLogStream}));
apiRouter.use('/*', localUtil.setCacheHeaders);
// parse application/json
apiRouter.use(bodyParser.json());

apiRouter.use((req, res, next) => {
    // do logging
//    logger.log(
//        req.method,
//            '/api' + req.url,
//        req.get('Content-type'),
//        req.get('User-agent')
//    );
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
apiRouter.get('/', (req, res) => {
    // Stop timer when response is transferred and finish.
    res.on('finish', () => {
        // metrics.increment('simpleblog.api.get');
    });
    res.json({ message: 'hooray! welcome to our api!' });
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
apiRouter.post('/report', (req, res) => {
    // Stop timer when response is transferred and finish.
    res.on('finish', () => {
        // metrics.increment('simpleblog.api.post');
    });

    // Write shit to file.
    const milliseconds = (new Date()).getTime();
    const fs = require('fs');
    fs.writeFile(`/tmp/javascript-module-performance-${milliseconds}`, JSON.stringify(req.body), (err) => {
        if (err) {
            res.json({ message: `Something went wrong: ${err}`, status: 500 });
        } else {
            res.json({ message: 'Thanks for your report.', status: 200 });
        }
    });
});

module.exports = apiRouter;
