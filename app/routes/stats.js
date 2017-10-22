/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const express = require('express');
const _ = require('underscore');
const Logger = require('../../lib/logger');

const logger = new Logger();

let stats;
let activeConn;
let timerWeb;
let timerApi;
let timerImage;
let timer;
let gauge;

const statsRouter = express.Router();
statsRouter.setConfig = function doSetConfig(conf, opt) {
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
statsRouter.get('/', (req, res) => {
    // Start metrics
    let stopwatch;
    if (timerApi) { stopwatch = timerApi.start(); }
    if (activeConn) { activeConn.inc(); }
    if (stats) {
        stats.meter('requestsPerSecond').mark();
        stats.meter('/api/v1/stats').mark();
    }
    // Stop timer when response is transferred and finish.
    res.on('finish', () => {
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
            timer,
            gauge: gauge.toJSON(),
        }, null, 4));
    } catch (err) {
        // TODO: This is never happening..? Or am I missing something?
        res.status(404).send(`Page not found: ${err}`);
    }
});
module.exports = statsRouter;
