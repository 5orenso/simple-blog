/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var cluster = require('cluster');
var worker;

if (cluster.isMaster) {
    // Code to run if we're in the master process
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        worker = cluster.fork();
    }

} else {
    // Code to run if we're in a worker process
    var when = require('when'),
        _ = require('underscore'),
        express = require('express'),
        bodyParser = require('body-parser'),
        path = require('path'),
        commander = require('commander'),
        app_path = __dirname + '/../',
        logger = require(app_path + 'lib/logger')({
            workerId: cluster.worker.id
        });

    var app = express();

    commander
        .option('-c, --config <file>', 'configuration file path', './config/config.js')
        .parse(process.argv);
    var config = require(commander.config);
    if (config) {
        if (_.isObject(config) && _.isObject(config.log)) {
            logger.set('log', config.log);
        }
    }

    app.use(bodyParser.json());

    // Include route handlers ------------------------
    var api_router = require('./routes/api');
    api_router.set_config(config, {
        workerId: cluster.worker.id,
    });
    var web_router = require('./routes/web');
    web_router.set_config(config, {
        workerId: cluster.worker.id,
    });
    var image_router  = require('./routes/image');
    image_router.set_config(config, {
        workerId: cluster.worker.id,
    });

    // Register routes -------------------------------
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