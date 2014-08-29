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

var api_router = express.Router();

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
    res.json({ message: 'hooray! welcome to our api!' });
});

module.exports = api_router;
