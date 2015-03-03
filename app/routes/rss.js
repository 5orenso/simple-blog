/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express       = require('express'),
    morgan        = require('morgan'),
    when          = require('when'),
    _             = require('underscore'),
    swig          = require('swig'),
    fs            = require('fs'),
    path          = require('path'),
    commander     = require('commander'),
    app_path      = __dirname + '/../../',
    template_path = path.normalize(app_path + 'template/current/'),
    photo_path    = path.normalize(app_path + 'content/images/'),
    logger        = require(app_path + 'lib/logger')(),
    article_util  = require(app_path + 'lib/article-util')(),
    local_util    = require(app_path + 'lib/local-util')();

swig.setFilter('markdown', article_util.replaceMarked);
swig.setFilter('formatted', article_util.formatDate);
swig.setFilter('rssdate', article_util.rssDate);


//var stats, activeConn, timer, timer_v2, config;
var config;
var rss_router = express.Router();
rss_router.set_config = function (conf, opt) {
    rss_router.config = conf;
    rss_router.opt = opt;
    if (opt) {
        if (opt.hasOwnProperty('workerId')) {
            logger.set('workerId', opt.workerId);
        }
        if (opt.hasOwnProperty('photo_path')) {
            photo_path = path.normalize(opt.photo_path);
        }
    }
    if (conf) {
        if (_.isObject(conf)) {
            if (_.isObject(conf.log)) {
                logger.set('log', conf.log);
            }
        }
    }
};

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(app_path + '/logs/rss-access.log', {flags: 'a'});

// Setup the logger
rss_router.use(morgan('combined', {stream: accessLogStream}));

// Main route for blog articles.
rss_router.use('/*', local_util.set_no_cache_headers);
rss_router.get('/*', function(req, res) {
    var lu    = require(app_path + 'lib/local-util')({config: rss_router.config});
    // Resolve filename
    var request_url = article_util.getUrlFromRequest(req);

    // Load content based on filename
    var article_path = article_util.getArticlePathRelative(request_url);

    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
        // if (timer) { stopwatch.end(); }
    });

    res.setHeader('Content-type', 'text/xml');


    // Check for cached file
    // If not cached compile file and store it.
    // TODO: How do we bypass the cache?
    var file = article_util.getArticleFilename(request_url);
    var template = template_path + (file === 'index' ? 'rss.xml' : 'rss.xml');
    var tpl = swig.compileFile(template);

    var article = require(app_path + 'lib/article')({
        logger: logger,
        request_url: request_url,
        photo_path: photo_path,
        config: rss_router.config
    });

    var category = require(app_path + 'lib/category')({
        logger: logger,
        config: rss_router.config
    });

    lu.timers_reset();
    lu.timer('routes/rss->request');
    lu.timer('routes/rss->load_category_and_article_lists');
    when.all([category.list('/'), article.list(article_path)])
        .then(function (content_lists) {
            lu.timer('routes/rss->load_category_and_article_lists');
            lu.timer('routes/rss->load_article');
            return article.load({
                catlist: content_lists[0],
                artlist: content_lists[1]
            });
        })
        .then(function (article) {
            lu.timer('routes/rss->load_article');
            res.send(tpl({blog: rss_router.config.blog, article: article}));
        })
        .catch(function (opt) {
            lu.timer('routes/rss->load_article');
            lu.send_udp({timers: lu.timers_get()});
            res.status(404).send(tpl({blog: rss_router.config.blog, error: opt.error, article: opt.article}));
        })
        .done(function () {
            lu.timer('routes/rss->request');
            lu.send_udp({timers: lu.timers_get()});
        });

});
module.exports = rss_router;
