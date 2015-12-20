/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express       = require('express'),
    bodyParser    = require('body-parser'),
    _             = require('underscore'),
    appPath       = __dirname + '/../../',
    Logger        = require(appPath + 'lib/logger'),
    logger        = new Logger(),
    LocalUtil     = require(appPath + 'lib/local-util'),
    localUtil     = new LocalUtil(),
    Metrics       = require(appPath + 'lib/metrics'),
    metrics       = new Metrics({
        useDataDog: true
    });

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
    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
        metrics.increment('simpleblog.api.get');
    });
    res.json({ message: 'hooray! welcome to our api!' });
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
apiRouter.post('/report', function(req, res) {
    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
        metrics.increment('simpleblog.api.post');
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
