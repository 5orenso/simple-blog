/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express    = require('express'),
    bodyParser = require('body-parser'),
    _          = require('underscore'),
    appPath   = __dirname + '/../../',
    logger     = require(appPath + 'lib/logger')(),
    localUtil = require(appPath + 'lib/local-util')();

var apiRouter = express.Router();
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
//var accessLogStream = fs.createWriteStream(appPath + '/logs/api-access.log', {flags: 'a'});
// setup the logger
//apiRouter.use(morgan('combined', {stream: accessLogStream}));
apiRouter.use('/*', localUtil.setCacheHeaders);
// parse application/json
apiRouter.use(bodyParser.json());

apiRouter.use(function(req, res, next) {
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
apiRouter.get('/', function(req, res) {
    var lu    = require(appPath + 'lib/local-util')({config: apiRouter.config});

    lu.timersReset();
    lu.timer('routes/api->request');
    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
        lu.timer('routes/api->request');
        lu.sendUdp({ timers: lu.timersGet() });
    });
    res.json({ message: 'hooray! welcome to our api!' });
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
apiRouter.post('/report', function(req, res) {
    var lu    = require(appPath + 'lib/local-util')({config: apiRouter.config});

    lu.timersReset();
    lu.timer('routes/api->request');
    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
        lu.timer('routes/api->request');
        lu.sendUdp({ timers: lu.timersGet() });
    });

    // Write shit to file.
    var milliseconds = (new Date()).getTime();
    var fs = require('fs');
    fs.writeFile('/tmp/javascript-module-performance-' + milliseconds, JSON.stringify(req.body), function(err) {
        if (err) {
            res.json({ message: 'Something went wrong: ' + err, status: 500 });
        } else {
            res.json({ message: 'Thanks for your report.', status: 200 });
        }
    });

});

module.exports = apiRouter;
