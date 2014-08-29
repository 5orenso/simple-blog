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
    app_path   = __dirname + '/../',
    logger     = require(app_path + 'lib/logger')();

var app        = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());

// set our port
var port = 8080;

// Include route handlers
var api_router = require('./routes/api');
var web_router = require('./routes/web');

// middleware to use for all requests

// more routes for our API will happen here

// Register routes -------------------------------
app.use('/api', api_router);
app.use('/static', express.static(__dirname + '/public'));
app.use('/', web_router);

// Start the server -------------------------------
app.listen(port);
logger.log('Magic happens on port ' + port);

