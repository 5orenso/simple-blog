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
//    marked     = require('marked'),
//    renderer   = new marked.Renderer(),

    path          = require('path'),
    app_path      = __dirname + '/../../',
    template_path = path.normalize(app_path + 'template/current/'),
    content_path  = path.normalize(app_path + 'content/articles/'),
    logger        = require(app_path + 'lib/logger')();

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


function getArticlePathRelative (complete_filename) {
    console.log(complete_filename);
    var re = new RegExp(content_path);
    var relative_path = complete_filename.replace(re, '');
    // Remove filename
    relative_path = relative_path.replace(/(\/*[^\/]+$)/, '');
    console.log(relative_path);
    return relative_path ? '/' + relative_path : '';
}
function getUrlFromRequest (req) {
    var article_filename = req.url.replace(/\//, '');
    article_filename = decodeURIComponent(article_filename);
    article_filename = article_filename.replace(/\.html/, '');
    return article_filename;
}
function getMarkdownFilename (article_filename) {
    var markdown_filename = path.normalize(content_path + article_filename + '.md');
//    markdown_filename = markdown_filename.replace(/\/.md$/, '/index.md');
    return markdown_filename;
}

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
web_router.get('/*', function(req, res) {
    // Resolve filename
//    console.log(req.url);
    var article_filename = getUrlFromRequest(req);

    // Check for cached file
    // If not cached compile file and store it.
    var tpl = swig.compileFile(template_path + 'blog.html');

    // Load content based on filename
    var markdown_filename = getMarkdownFilename(article_filename);
    var article_path = getArticlePathRelative(markdown_filename);

    // Load from function
    var article = require(app_path + 'lib/article')({
        logger: logger,
        filename: markdown_filename,
        article_path: article_path,
        content_path: content_path
    });

    when(article.catlist())
        .then(article.artlist)
        .then(article.article)
        .then(function (article) {
            res.send(tpl({ article: article }));
        })
        .catch(function (opt) {
//            console.log(opt);
            res.status(404).send(tpl({ error: opt.error, article: opt.article }));
        })
        .done();


});
module.exports = web_router;
