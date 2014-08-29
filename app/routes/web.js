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
    swig       = require('swig'),
    fs         = require('fs'),
    marked     = require('marked'),
    renderer   = new marked.Renderer(),

    path       = require('path'),
    app_path   = __dirname + '/../../',
    template_path = app_path + 'template/current/',
    logger     = require(app_path + 'lib/logger')();

var web_router = express.Router();

web_router.use(function(req, res, next) {
    // do logging
    logger.log(
        req.method,
        req.url,
        req.get('Content-type'),
        req.get('User-agent')
    );
    next(); // make sure we go to the next routes and don't stop here
});

web_router.use('/js/', express.static(app_path + 'template/current/js/'));
web_router.use('/images/', express.static(app_path + 'template/current/images/'));
web_router.use('/css/', express.static(app_path + 'template/current/css/'));
web_router.use('/fonts/', express.static(app_path + 'template/current/fonts/'));
web_router.use('/photos/', express.static(app_path + 'content/images/'));

web_router.get('/favicon.ico', function (req, res) {
    res.send('hola');
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
web_router.get('/*', function(req, res) {
    // Resolve filename
    var article_filename = req.url.replace(/\//, '');
    article_filename = article_filename.replace(/\.html/, '');

    // Check for cached file
    // If not cached compile file and store it.
    var tpl = swig.compileFile(template_path + 'blog.html');

    // Load content based on filename
    var markdown_filename = app_path + 'content/articles/' + article_filename + '.md';

    // Load from function
    var article = require(app_path + 'lib/article')({
        logger: logger
    });
    when(article.article(markdown_filename))
        .done(function (article) {
            res.send(tpl({ article: article }))
        });

});
module.exports = web_router;
