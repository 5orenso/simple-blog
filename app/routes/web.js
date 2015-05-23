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

//var stats, activeConn, timer, timer_v2, config;
var config;
var web_router = express.Router();
web_router.set_config = function (conf, opt) {
    web_router.config = conf;
    web_router.opt = opt;
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
var accessLogStream = fs.createWriteStream(app_path + '/logs/web-access.log', {flags: 'a'});

// Setup the logger
web_router.use(morgan('combined', {stream: accessLogStream}));

// Setup static routes
web_router.use('/js/', local_util.set_cache_headers);
web_router.use('/js/', express.static(app_path + 'template/current/js/'));
web_router.use('/images/', local_util.set_cache_headers);
web_router.use('/images/', express.static(app_path + 'template/current/images/'));
web_router.use('/css/', local_util.set_cache_headers);
web_router.use('/css/', express.static(app_path + 'template/current/css/'));
web_router.use('/fonts/', local_util.set_cache_headers);
web_router.use('/fonts/', express.static(app_path + 'template/current/fonts/'));
web_router.use('/photos/', local_util.set_cache_headers);
web_router.use('/photos/', express.static(app_path + 'content/images/'));
web_router.use('/favicon.ico/', local_util.set_cache_headers);
web_router.use('/favicon.ico', express.static(app_path + 'template/current/favicon.ico'));
web_router.use('/robots.txt/', local_util.set_cache_headers);
web_router.use('/robots.txt', express.static(app_path + 'template/robots.txt'));
web_router.use('/keybase.txt/', local_util.set_cache_headers);
web_router.use('/keybase.txt', express.static(app_path + 'template/keybase.txt'));
web_router.use('/sitemap.xml/', local_util.set_cache_headers);
web_router.use('/sitemap.xml', express.static(app_path + 'template/sitemap.xml'));

// Main route for blog articles.
web_router.use('/*', local_util.set_no_cache_headers);
web_router.get('/*', function(req, res) {
    var lu    = require(app_path + 'lib/local-util')({config: web_router.config});
    // Resolve filename
    var request_url = article_util.getUrlFromRequest(req);

    // Check for redirect
    var is_redirect = false;
    if (_.isObject(web_router.config.blog) && _.isArray(web_router.config.blog.rewrites)) {
        for (var i in web_router.config.blog.rewrites) {
            if (web_router.config.blog.rewrites[i]) {
                var rewrite = web_router.config.blog.rewrites[i];
                if (request_url.match(rewrite.url)) {
                    //console.log('Rewriting...', rewrite);
                    var target = rewrite.target;
                    if (rewrite.use_url && rewrite.regex) {
                        request_url = request_url.replace(rewrite.regex, rewrite.regex_result);
                        target += request_url;
                    }
                    res.redirect(rewrite.code, target);
                    is_redirect = true;
                }
            }
        }
    }

    if (!is_redirect) {
        // Load content based on filename
        var article_path = article_util.getArticlePathRelative(request_url);

        // Stop timer when response is transferred and finish.
        res.on('finish', function () {
            // if (timer) { stopwatch.end(); }
        });

        // Check for cached file
        // If not cached compile file and store it.
        // TODO: How do we bypass the cache?
        var file = article_util.getArticleFilename(request_url);
        var template = template_path + (file === 'index' ? 'index.html' : 'blog.html');

        if (_.isObject(web_router.config.template)) {
            template = app_path + (file === 'index' ? web_router.config.template.index : web_router.config.template.blog);
        }
        //var template = 'blog.html';
        var tpl = swig.compileFile(template);

        var article = require(app_path + 'lib/article')({
            logger: logger,
            request_url: request_url,
            photo_path: photo_path,
            config: web_router.config
        });

        var category = require(app_path + 'lib/category')({
            logger: logger,
            config: web_router.config
        });

        lu.timers_reset();
        lu.timer('routes/web->request');
        lu.timer('routes/web->load_category_and_article_lists');
        when.all([category.list('/'), article.list(article_path)])
            .then(function (content_lists) {
                lu.timer('routes/web->load_category_and_article_lists');
                lu.timer('routes/web->load_article');
                return article.load({
                    catlist: content_lists[0],
                    artlist: content_lists[1]
                });
            })
            .then(function (article) {
                lu.timer('routes/web->load_article');
                res.send(tpl({blog: web_router.config.blog, article: article}));
            })
            .catch(function (opt) {
                lu.timer('routes/web->load_article');
                lu.send_udp({timers: lu.timers_get()});
                res.status(404).send(tpl({blog: web_router.config.blog, error: opt.error, article: opt.article}));
            })
            .done(function () {
                lu.timer('routes/web->request');
                lu.send_udp({timers: lu.timers_get()});
            });
    }
});
module.exports = web_router;
