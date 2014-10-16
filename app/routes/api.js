/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express    = require('express'),
    when       = require('when'),
    _          = require('underscore'),

    path       = require('path'),
    app_path   = __dirname + '/../../',
    logger     = require(app_path + 'lib/logger')();

var stats, activeConn, timer, config;
var api_router = express.Router();
api_router.set_config = function (conf, opt) {
    api_router.config = conf;
    api_router.opt = opt;
    if (opt) {
        if (opt.hasOwnProperty('workerId')) {
            logger.set('workerId', opt.workerId);
        }
        if (opt.hasOwnProperty('stats')) {
            stats = opt.stats;
        }
        if (opt.hasOwnProperty('activeConn')) {
            activeConn = opt.activeConn;
        }
        if (opt.hasOwnProperty('timer')) {
            timer = opt.timer;
        }
    }
};
// middleware to use for all requests
api_router.use(function(req, res, next) {
    // do logging
    logger.log(
        req.method,
            '/api' + req.url,
        req.get('Content-type'),
        req.get('User-agent')
    );
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
api_router.get('/', function(req, res) {
    var request_pathname = req._parsedUrl.pathname;

    // Start metrics
    var stopwatch;
    if (timer) { stopwatch = timer.start();}
    if (activeConn) { activeConn.inc(); }
    if (stats) {
        stats.meter('requestsPerSecond').mark();
        stats.meter('/api' + request_pathname).mark();
    }
    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
        if (activeConn) { activeConn.dec(); }
        if (timer) { stopwatch.end(); }
    });
    // End metrics

    res.json({ message: 'hooray! welcome to our api!' });
});

module.exports = api_router;
