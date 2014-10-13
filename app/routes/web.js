/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express       = require('express'),
    when          = require('when'),
    _             = require('underscore'),
    swig          = require('swig'),
    fs            = require('fs'),
    path          = require('path'),
    commander     = require('commander'),
    app_path      = __dirname + '/../../',
    template_path = path.normalize(app_path + 'template/current/'),
    content_path  = path.normalize(app_path + 'content/articles/'),
    logger        = require(app_path + 'lib/logger')(),
    article_util  = require(app_path + 'lib/article-util')(),
    image_router  = require('./image');

swig.setFilter('markdown', article_util.replaceMarked);

var config;
var web_router = express.Router();
web_router.set_config = function (conf, opt) {
    web_router.config = conf;
    web_router.opt = opt;
    image_router.set_config(web_router.config, web_router.opt);
    if (opt) {
        if (opt.hasOwnProperty('workerId')) {
            logger.set('workerId', opt.workerId);
        }
        if (opt.hasOwnProperty('content_path')) {
            content_path = path.normalize(opt.content_path);
        }
    }
};

web_router.use(function(req, res, next) {
    logger.log(
        req.method,
        req.url,
        req.get('Content-type'),
        req.get('User-agent')
    );
    next(); // make sure we go to the next routes and don't stop here
});


web_router.use('/pho/', image_router);
web_router.use('/js/', express.static(app_path + 'template/current/js/'));
web_router.use('/images/', express.static(app_path + 'template/current/images/'));
web_router.use('/css/', express.static(app_path + 'template/current/css/'));
web_router.use('/fonts/', express.static(app_path + 'template/current/fonts/'));
web_router.use('/photos/', express.static(app_path + 'content/images/'));
web_router.use('/favicon.ico', express.static(app_path + 'template/current/favicon.ico'));
web_router.use('/robots.txt', express.static(app_path + 'template/robots.txt'));
web_router.use('/sitemap.xml', express.static(app_path + 'template/sitemap.xml'));

// Main route for blog articles.
web_router.get('/*', function(req, res) {
    // Resolve filename
    var article_filename = article_util.getUrlFromRequest(req);

    // Check for cached file
    // If not cached compile file and store it.
    // TODO: How do we bypass the cache?
    var tpl = swig.compileFile(template_path + 'blog.html');

    // Load content based on filename
    var markdown_filename = article_util.getMarkdownFilename(article_filename);
    var article_path = article_util.getArticlePathRelative(markdown_filename);

    var article = require(app_path + 'lib/article')({
        logger: logger,
        filename: markdown_filename,
        article_path: article_path,
        content_path: content_path
    });

    when.all([article.catlist(), article.artlist()])
        .then(function (content_lists) {
            return article.article({
                catlist: content_lists[0],
                artlist: content_lists[1]
            });
        })
        .then(function (article) {
            res.send(tpl({ blog: web_router.config.blog, article: article }));
        })
        .catch(function (opt) {
            res.status(404).send(tpl({ blog: web_router.config.blog, error: opt.error, article: opt.article }));
        })
        .done();
});
module.exports = web_router;
