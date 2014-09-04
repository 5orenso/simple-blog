/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when       = require('when'),
    _          = require('underscore'),
    express    = require('express'),
    bodyParser = require('body-parser'),
    path       = require('path'),
    commander  = require('commander'),
    app_path   = __dirname + '/../',
    logger     = require(app_path + 'lib/logger')();

var app        = express();

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
web_router.set_config(config);

// middleware to use for all requests

// more routes for our API will happen here

// Register routes -------------------------------
app.use('/api', api_router);
app.use('/static', express.static(__dirname + '/public'));
app.use('/', web_router);

// Start the server -------------------------------
app.listen(config.app.port);
logger.log('Something happens on port ' + config.app.port);

