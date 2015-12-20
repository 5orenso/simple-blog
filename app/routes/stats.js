/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express       = require('express'),
    _             = require('underscore'),
    appPath      = __dirname + '/../../',
    Logger        = require(appPath + 'lib/logger'),
    logger        = new Logger();

var stats, activeConn, timerWeb, timerApi, timerImage, timer, gauge;
var statsRouter = express.Router();
statsRouter.setConfig = function (conf, opt) {
    statsRouter.config = conf;
    statsRouter.opt = opt;
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
        if (opt.hasOwnProperty('timerWeb')) {
            timerWeb = opt.timerWeb;
        }
        if (opt.hasOwnProperty('timerApi')) {
            timerApi = opt.timerApi;
        }
        if (opt.hasOwnProperty('timerImage')) {
            timerImage = opt.timerImage;
        }
        if (opt.hasOwnProperty('timer')) {
            timer = opt.timer;
        }
        if (opt.hasOwnProperty('gauge')) {
            gauge = opt.gauge;
        }
    }
    if (conf) {
        if (_.isObject(conf) && _.isObject(conf.log)) {
            logger.set('log', conf.log);
        }
    }
};

statsRouter.use(express.query()); // Parse query_string.

// Main route for html files.
statsRouter.get('/', function(req, res) {
    // Start metrics
    var stopwatch;
    if (timerApi) { stopwatch = timerApi.start();}
    if (activeConn) { activeConn.inc(); }
    if (stats) {
        stats.meter('requestsPerSecond').mark();
        stats.meter('/api/v1/stats').mark();
    }
    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
        if (activeConn) { activeConn.dec(); }
        if (timerApi) { stopwatch.end(); }
    });
    // End metrics

    try {
        res.header('Content-Type', 'text/plain');
        res.end(JSON.stringify({
            stats: stats.toJSON(),
            activeConn: activeConn.toJSON(),
            timerWeb: timerWeb.toJSON(),
            timerApi: timerApi.toJSON(),
            timerImage: timerImage.toJSON(),
            timer: timer,
            gauge: gauge.toJSON()
        }, null, 4));

    } catch (err) {
        // TODO: This is never happening..? Or am I missing something?
        res.status(404).send('Page not found: ' + err);

    }
});
module.exports = statsRouter;
