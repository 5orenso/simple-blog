/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express       = require('express'),
    when          = require('when'),
    _             = require('underscore'),
    app_path      = __dirname + '/../../',
    logger        = require(app_path + 'lib/logger')();

var stats, activeConn, timer_web, timer_api, timer_image, gauge, config;
var stats_router = express.Router();
stats_router.set_config = function (conf, opt) {
    stats_router.config = conf;
    stats_router.opt = opt;
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
        if (opt.hasOwnProperty('timer_web')) {
            timer_web = opt.timer_web;
        }
        if (opt.hasOwnProperty('timer_api')) {
            timer_api = opt.timer_api;
        }
        if (opt.hasOwnProperty('timer_image')) {
            timer_image = opt.timer_image;
        }
        if (opt.hasOwnProperty('gauge')) {
            gauge = opt.gauge;
        }
    }
};

stats_router.use(express.query()); // Parse query_string.

// Main route for html files.
stats_router.get('/', function(req, res) {
    // Start metrics
    var stopwatch;
    if (timer_api) { stopwatch = timer_api.start();}
    if (activeConn) { activeConn.inc(); }
    if (stats) {
        stats.meter('requestsPerSecond').mark();
        stats.meter('/api/v1/stats').mark();
    }
    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
        if (activeConn) { activeConn.dec(); }
        if (timer_api) { stopwatch.end(); }
    });
    // End metrics

    try {
        res.header('Content-Type', 'text/plain');
        res.end(JSON.stringify({
            stats: stats.toJSON(),
            activeConn: activeConn.toJSON(),
            timer_web: timer_web.toJSON(),
            timer_api: timer_api.toJSON(),
            timer_image: timer_image.toJSON(),
            gauge: gauge.toJSON()
        }, null, 4));

    } catch (err) {
        res.status(404).send('Page not found: ' + err);

    }
});
module.exports = stats_router;
