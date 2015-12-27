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
    Logger        = require(appPath + 'lib/logger'),
    logger        = new Logger(),
    Category      = require(appPath + 'lib/category'),
    category,
    Article       = require(appPath + 'lib/article'),
    article,
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
        article = new Article({
            logger: logger,
            photoPath: photoPath,
            config: conf
        });

        category = new Category({
            logger: logger,
            config: conf
        });
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

    when.all([category.list('/'), article.list(articlePath)])
        .then(function (contentLists) {
            return article.load({
                requestUrl: requestUrl,
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
