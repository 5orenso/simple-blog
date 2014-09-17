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
        app_path = __dirname + '/../',
        logger = require(app_path + 'lib/logger')({
            workerId: cluster.worker.id
        });

    var app = express();

    commander
        .option('-c, --config <file>', 'configuration file path', './config/config.js')
        .parse(process.argv);
    var config = require(commander.config);

    // configure app to use bodyParser()
    // this will let us get the data from a POST
    app.use(bodyParser.json());

    // Include route handlers
    var api_router = require('./routes/api');
    var web_router = require('./routes/web');
    web_router.set_config(config, {
        workerId: cluster.worker.id
    });

    // middleware to use for all requests

    // more routes for our API will happen here

    // Register routes -------------------------------
    app.use('/api', api_router);
    app.use('/static', express.static(__dirname + '/public'));
    app.use('/', web_router);

    // Start the server -------------------------------
    app.listen(config.app.port);
    logger.log('Something happens on port ' + config.app.port);

}

// Listen for dying workers
cluster.on('exit', function (worker) {
    // Replace the dead worker,
    // we're not sentimental
    console.log('Worker ' + worker.id + ' died :(');
    cluster.fork();

});