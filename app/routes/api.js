/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express    = require('express'),
    bodyParser = require('body-parser'),
    morgan     = require('morgan'),
    when       = require('when'),
    _          = require('underscore'),
    fs         = require('fs'),
    path       = require('path'),
    app_path   = __dirname + '/../../',
    logger     = require(app_path + 'lib/logger')(),
    local_util = require(app_path + 'lib/local-util')();

var stats, activeConn, timer, config;
var api_router = express.Router();
api_router.set_config = function (conf, opt) {
    api_router.config = conf;
    api_router.opt = opt;
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
//var accessLogStream = fs.createWriteStream(app_path + '/logs/api-access.log', {flags: 'a'});
// setup the logger
//api_router.use(morgan('combined', {stream: accessLogStream}));
api_router.use('/*', local_util.set_cache_headers);
// parse application/json
api_router.use(bodyParser.json());


api_router.use(function(req, res, next) {
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
api_router.get('/', function(req, res) {
    var lu    = require(app_path + 'lib/local-util')({config: api_router.config});
    var request_pathname = req._parsedUrl.pathname;


    lu.timers_reset();
    lu.timer('routes/api->request');
    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
        lu.timer('routes/api->request');
        lu.send_udp({ timers: lu.timers_get() });
    });
    res.json({ message: 'hooray! welcome to our api!' });
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
api_router.post('/report', function(req, res) {
    var lu    = require(app_path + 'lib/local-util')({config: api_router.config});
    var request_pathname = req._parsedUrl.pathname;

    lu.timers_reset();
    lu.timer('routes/api->request');
    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
        lu.timer('routes/api->request');
        lu.send_udp({ timers: lu.timers_get() });
    });

    // Write shit to file.
    var milliseconds = (new Date()).getTime();
    var fs = require('fs');
    fs.writeFile("/tmp/javascript-module-performance-" + milliseconds, JSON.stringify(req.body), function(err) {
        if(err) {
            res.json({ message: 'Something went wrong: ' + err, status: 500 });
        } else {
            res.json({ message: 'Thanks for your report.', status: 200 });
        }
    });


});


module.exports = api_router;
