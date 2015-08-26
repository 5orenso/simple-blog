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
    sitemap       = 'sitemap.xml',
    keybase       = 'keybase.txt',
    logger        = require(appPath + 'lib/logger')(),
    articleUtil  = require(appPath + 'lib/article-util')(),
    localUtil    = require(appPath + 'lib/local-util')();

swig.setFilter('markdown', articleUtil.replaceMarked);
swig.setFilter('formatted', articleUtil.formatDate);

var webRouter = express.Router();
webRouter.setConfig = function (conf, opt) {
    webRouter.config = conf;
    webRouter.opt = opt;
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
            sitemap = 'sitemap-' + conf.blog.domain + '.xml';
        }
    }
};

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(appPath + '/logs/web-access.log', {flags: 'a'});

// Setup the logger
webRouter.use(morgan('combined', {stream: accessLogStream}));

// Setup static routes
webRouter.use('/js/', localUtil.setCacheHeaders);
webRouter.use('/js/', express.static(appPath + 'template/current/js/'));
webRouter.use('/images/', localUtil.setCacheHeaders);
webRouter.use('/images/', express.static(appPath + 'template/current/images/'));
webRouter.use('/css/', localUtil.setCacheHeaders);
webRouter.use('/css/', express.static(appPath + 'template/current/css/'));
webRouter.use('/fonts/', localUtil.setCacheHeaders);
webRouter.use('/fonts/', express.static(appPath + 'template/current/fonts/'));
webRouter.use('/favicon.ico/', localUtil.setCacheHeaders);
webRouter.use('/favicon.ico', express.static(appPath + 'template/current/favicon.ico'));
webRouter.use('/robots.txt/', localUtil.setCacheHeaders);
webRouter.use('/robots.txt', express.static(appPath + 'template/robots.txt'));
webRouter.use('/sitemap.xml/', localUtil.setCacheHeaders);
webRouter.get('/sitemap.xml', function (req, res) {
    res.sendFile(sitemap, {root: path.normalize(appPath + './template')});
});
webRouter.use('/keybase.txt/', localUtil.setCacheHeaders);
webRouter.get('/keybase.txt', function (req, res) {
    res.sendFile(keybase, {root: path.normalize(webRouter.config.adapter.markdown.contentPath)});
});
webRouter.use('/photos/', localUtil.setCacheHeaders);
webRouter.get('/photos/*', function (req, res) {
    // Resolve filename
    var requestUrl = articleUtil.getUrlFromRequest(req);
    requestUrl = requestUrl.replace(/\/photos\//, '');
    res.sendFile(requestUrl, {root: path.normalize(webRouter.config.adapter.markdown.photoPath)});
});

// Main route for blog articles.
webRouter.use('/*', localUtil.setNoCacheHeaders);
webRouter.get('/*', function(req, res) {
    var lu    = require(appPath + 'lib/local-util')({config: webRouter.config});
    // Resolve filename
    var requestUrl = articleUtil.getUrlFromRequest(req);

    // Check for redirect
    var isRedirect = false;
    if (_.isObject(webRouter.config.blog) && _.isArray(webRouter.config.blog.rewrites)) {
        for (var i in webRouter.config.blog.rewrites) {
            if (webRouter.config.blog.rewrites[i]) {
                var rewrite = webRouter.config.blog.rewrites[i];
                if (requestUrl.match(rewrite.url)) {
                    //console.log('Rewriting...', rewrite);
                    var target = rewrite.target;
                    if (rewrite.useUrl && rewrite.regex) {
                        requestUrl = requestUrl.replace(rewrite.regex, rewrite.regexResult);
                        target += requestUrl;
                    }
                    res.redirect(rewrite.code, target);
                    isRedirect = true;
                }
            }
        }
    }

    if (!isRedirect) {
        // Load content based on filename
        var articlePath = articleUtil.getArticlePathRelative(requestUrl);

        // Stop timer when response is transferred and finish.
        res.on('finish', function () {
            // if (timer) { stopwatch.end(); }
        });

        // Check for cached file
        // If not cached compile file and store it.
        // TODO: How do we bypass the cache?
        var file = articleUtil.getArticleFilename(requestUrl);
        var template = templatePath + (file === 'index' ? 'index.html' : 'blog.html');

        if (_.isObject(webRouter.config.template)) {
            template = appPath + (file === 'index' ? webRouter.config.template.index : webRouter.config.template.blog);
        }
        //var template = 'blog.html';
        var tpl = swig.compileFile(template);

        var article = require(appPath + 'lib/article')({
            logger: logger,
            requestUrl: requestUrl,
            photoPath: photoPath,
            config: webRouter.config
        });

        var category = require(appPath + 'lib/category')({
            logger: logger,
            config: webRouter.config
        });

        lu.timersReset();
        lu.timer('routes/web->request');
        lu.timer('routes/web->load_category_and_article_lists');
        when.all([category.list('/'), article.list(articlePath)])
            .then(function (contentLists) {
                lu.timer('routes/web->load_category_and_article_lists');
                lu.timer('routes/web->load_article');
                return article.load({
                    catlist: contentLists[0],
                    artlist: contentLists[1]
                });
            })
            .then(function (article) {
                lu.timer('routes/web->load_article');
                res.send(tpl({blog: webRouter.config.blog, article: article}));
            })
            .catch(function (opt) {
                lu.timer('routes/web->load_article');
                lu.sendUdp({timers: lu.timersGet()});
                res.status(404).send(tpl({blog: webRouter.config.blog, error: opt.error, article: opt.article}));
            })
            .done(function () {
                lu.timer('routes/web->request');
                lu.sendUdp({timers: lu.timersGet()});
            });
    }
});
module.exports = webRouter;
