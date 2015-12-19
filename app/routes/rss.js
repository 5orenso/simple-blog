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
    appPath       = __dirname + '/../../',
    templatePath  = path.normalize(appPath + 'template/current/'),
    photoPath     = path.normalize(appPath + 'content/images/'),
    logger        = require(appPath + 'lib/logger')(),
    Category      = require(appPath + 'lib/category'),
    Article       = require(appPath + 'lib/article'),
    ArticleUtil   = require(appPath + 'lib/article-util'),
    articleUtil   = new ArticleUtil(),
    LocalUtil     = require(appPath + 'lib/local-util'),
    localUtil     = new LocalUtil(),
    Metrics       = require(appPath + 'lib/metrics'),
    metrics       = new Metrics({
        useDataDog: true
    });

swig.setFilter('markdown', articleUtil.replaceMarked);
swig.setFilter('formatted', articleUtil.formatDate);
swig.setFilter('rssdate', articleUtil.rssDate);

//var stats, activeConn, timer, timer_v2, config;
var rssRouter = express.Router();
rssRouter.setConfig = function (conf, opt) {
    rssRouter.config = conf;
    rssRouter.opt = opt;
    if (opt) {
        if (opt.hasOwnProperty('workerId')) {
            logger.set('workerId', opt.workerId);
        }
        if (opt.hasOwnProperty('photoPath')) {
            photoPath = path.normalize(opt.photoPath);
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
var accessLogStream = fs.createWriteStream(appPath + '/logs/rss-access.log', {flags: 'a'});

// Setup the logger
rssRouter.use(morgan('combined', {stream: accessLogStream}));

// Main route for blog articles.
rssRouter.use('/*', localUtil.setNoCacheHeaders);
rssRouter.get('/*', function(req, res) {
    // Resolve filename
    var requestUrl = articleUtil.getUrlFromRequest(req);

    // Load content based on filename
    var articlePath = articleUtil.getArticlePathRelative(requestUrl);

    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
        // if (timer) { stopwatch.end(); }
    });
    res.setHeader('Content-type', 'text/xml');

    // Check for cached file
    // If not cached compile file and store it.
    // TODO: How do we bypass the cache?
    var file = articleUtil.getArticleFilename(requestUrl);
    var template = templatePath + (file === 'index' ? 'rss.xml' : 'rss.xml');
    var tpl = swig.compileFile(template);

    var article = new Article({
        logger: logger,
        requestUrl: requestUrl,
        photoPath: photoPath,
        config: rssRouter.config
    });

    var category = new Category({
        logger: logger,
        config: rssRouter.config
    });

    when.all([category.list('/'), article.list(articlePath)])
        .then(function (contentLists) {
            return article.load({
                catlist: contentLists[0],
                artlist: contentLists[1]
            });
        })
        .then(function (article) {
            res.send(tpl({blog: rssRouter.config.blog, article: article}));
        })
        .catch(function (opt) {
            res.status(404).send(tpl({blog: rssRouter.config.blog, error: opt.error, article: opt.article}));
        })
        .done(function () {
            metrics.increment('simpleblog.rss.' + articlePath);
        });

});
module.exports = rssRouter;
