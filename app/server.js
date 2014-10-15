/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var cluster = require('cluster');

if (cluster.isMaster) {
    // Code to run if we're in the master process
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

} else {
    // Code to run if we're in a worker process
    var when = require('when'),
        _ = require('underscore'),
        express = require('express'),
        bodyParser = require('body-parser'),
        path = require('path'),
        commander = require('commander'),
        measured = require('measured'),
        stats = measured.createCollection(),
        activeConn = new measured.Counter(),
        timer_web = new measured.Timer(),
        timer_api = new measured.Timer(),
        timer_image = new measured.Timer(),
        gauge = new measured.Gauge(function() {
            return {
                processMemoryMB: process.memoryUsage().rss / 1024 / 1024
            };
        }),
        app_path = __dirname + '/../',
        logger = require(app_path + 'lib/logger')({
            workerId: cluster.worker.id
        });

    var app = express();

    commander
        .option('-c, --config <file>', 'configuration file path', './config/config.js')
        .parse(process.argv);
    var config = require(commander.config);

    app.use(bodyParser.json());

    // Include route handlers ------------------------
    var api_router = require('./routes/api');
    api_router.set_config(config, {
        workerId: cluster.worker.id,
        stats: stats,
        activeConn: activeConn,
        timer: timer_api,
    });
    var web_router = require('./routes/web');
    web_router.set_config(config, {
        workerId: cluster.worker.id,
        stats: stats,
        activeConn: activeConn,
        timer: timer_web
    });
    var stats_router = require('./routes/stats');
    stats_router.set_config(config, {
        stats: stats,
        activeConn: activeConn,
        timer_web: timer_web,
        timer_api: timer_api,
        timer_image: timer_image,
        gauge: gauge
    });

    var image_router  = require('./routes/image');
    image_router.set_config(config, {
        workerId: cluster.worker.id,
        stats: stats,
        activeConn: activeConn,
        timer: timer_image
    });


    // Register routes -------------------------------
    app.use('/api/v1/stats', stats_router);
    app.use('/api', api_router);
    app.use('/static', express.static(config.blog.static_files_path));
    app.use('/.well-known/', express.static(config.blog.text_files_path));
    app.use('/pho/', image_router);
    app.use('/', web_router);

    // Start the server ------------------------------
    var server = app.listen(config.app.port);
    logger.log('Something happens on port ' + config.app.port);

}

// Listen for dying workers
cluster.on('exit', function (worker) {
    // Replace the dead worker,
    // we're not sentimental
    console.log('Worker ' + worker.id + ' died :(');
    cluster.fork();

});