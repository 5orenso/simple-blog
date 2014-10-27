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
    photo_path    = path.normalize(app_path + 'content/images/'),
    logger        = require(app_path + 'lib/logger')(),
    article_util  = require(app_path + 'lib/article-util')();

swig.setFilter('markdown', article_util.replaceMarked);

var stats, activeConn, timer, config;
var web_router = express.Router();
web_router.set_config = function (conf, opt) {
    web_router.config = conf;
    web_router.opt = opt;
//    image_router.set_config(web_router.config, web_router.opt);
    if (opt) {
        if (opt.hasOwnProperty('workerId')) {
            logger.set('workerId', opt.workerId);
        }
        if (opt.hasOwnProperty('content_path')) {
            content_path = path.normalize(opt.content_path);
        }
        if (opt.hasOwnProperty('photo_path')) {
            photo_path = path.normalize(opt.photo_path);
        }
        if (opt.hasOwnProperty('stats')) {
            stats = opt.stats;
        }
        if (opt.hasOwnProperty('activeConn')) {
            activeConn = opt.activeConn;
        }
        if (opt.hasOwnProperty('timer')) {
            timer = opt.timer;
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


//web_router.use('/pho/', image_router);
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
    var request_url = article_util.getUrlFromRequest(req);
    // Load content based on filename
    var article_path = article_util.getArticlePathRelative(request_url);

    // Start metrics
    var stopwatch;
    if (timer) { stopwatch = timer.start();}
    if (activeConn) { activeConn.inc(); }
    if (stats) {
        stats.meter('requestsPerSecond').mark();
//        stats.meter(request_url || '/').mark();
    }
    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
        if (activeConn) { activeConn.dec(); }
        if (timer) { stopwatch.end(); }
    });
    // End metrics

    // Check for cached file
    // If not cached compile file and store it.
    // TODO: How do we bypass the cache?
    var tpl = swig.compileFile(template_path + 'blog.html');

    var article = require(app_path + 'lib/article')({
        logger: logger,
        request_url: request_url,
        article_path: article_path,
        photo_path: photo_path,
        config: web_router.config
    });

    var category = require(app_path + 'lib/category')({
        logger: logger,
        config: web_router.config
    });

    when.all([category.list(content_path), article.list(article_path)])
        .then(function (content_lists) {
            return article.load({
                catlist: content_lists[0],
                artlist: content_lists[1]
            });
        })
        .then(function (article) {
            if (stats) {
                stats.meter(request_url || '/').mark();
            }
            res.send(tpl({ blog: web_router.config.blog, article: article }));
        })
        .catch(function (opt) {
            res.status(404).send(tpl({ blog: web_router.config.blog, error: opt.error, article: opt.article }));
        })
        .done();
});
module.exports = web_router;
