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
    fs            = require('fs'),
    swig          = require('swig'),
    path          = require('path'),
    appPath      = __dirname + '/../../',
    templatePath = path.normalize(appPath + 'template/current/'),
    articleUtil  = require(appPath + 'lib/article-util')(),
    categoryUtil = require(appPath + 'lib/category-util')(),
    logger        = require(appPath + 'lib/logger')(),
    localUtil    = require(appPath + 'lib/local-util')();

var searchRouter = express.Router();
searchRouter.setConfig = function (conf, opt) {
    searchRouter.config = conf;
    searchRouter.opt = opt;
    if (opt) {
        if (opt.hasOwnProperty('workerId')) {
            logger.set('workerId', opt.workerId);
        }
    }
    if (conf) {
        if (_.isObject(conf) && _.isObject(conf.log)) {
            logger.set('log', conf.log);
        }
    }
};
// middleware to use for all requests
var accessLogStream = fs.createWriteStream(appPath + '/logs/search-access.log', {flags: 'a'});

// setup the logger
searchRouter.use(morgan('combined', {stream: accessLogStream}));

searchRouter.use('/*', localUtil.setCacheHeaders);

// test route to make sure everything is working (accessed at GET http://localhost:8080/search)
searchRouter.get('/*', function(req, res) {
    var lu    = require(appPath + 'lib/local-util')({config: searchRouter.config});
    var requestUrl = articleUtil.getUrlFromRequest(req);
    //console.log('search for:', (_.isEmpty(req.query.q) ? requestUrl : req.query.q));
    // Check for cached file
    // If not cached compile file and store it.
    // TODO: How do we bypass the cache?
    var file = articleUtil.getArticleFilename(requestUrl);
    var template = templatePath + (file === 'index' ? 'index.html' : 'blog.html');

    if (_.isObject(searchRouter.config.template)) {
        template = appPath + (file === 'index' ?
            searchRouter.config.template.index : searchRouter.config.template.blog);
    }
    //var template = 'blog.html';
    var tpl = swig.compileFile(template);

    var category = require(appPath + 'lib/category')({
        logger: logger,
        config: searchRouter.config
    });

    var search = require(appPath + 'lib/search')({
        logger: logger,
        config: searchRouter.config
    }, searchRouter.config.adapter.mockServices);

    lu.timersReset();
    lu.timer('routes/search->request');

    var searchFor = lu.safeString(_.isEmpty(req.query.q) ? requestUrl : req.query.q);
    var query = searchFor;
    var filter = {};

    when.all([search.query(query, filter), category.list('/')])
        .then(function (results) {
            lu.timer('routes/search->search_articles');
            return results;
        })
        .then(function (results) {
            lu.timer('routes/search->search_articles');
            var catlist = results[1];
            var article = {};
            if (_.isArray(results) && _.isArray(results[0]) && _.isObject(results[0][0])) {
                if (_.isObject(results[0][0])) {
                    article = results[0][0];
                }
                article.catlist = catlist;
                article.artlist = [];
                for (var i in results[0]) {
                    if (results[0][i]) {
                        var art = results[0][i];
                        article.artlist.push(art);
                    }
                }
                lu.timer('categoryUtil.formatCatlist');
                categoryUtil.formatCatlist(article, catlist);
                lu.timer('categoryUtil.formatCatlist');
                lu.timer('articleUtil.formatArtlist');
                articleUtil.formatArtlist(article, article.artlist);
                lu.timer('articleUtil.formatArtlist');
                lu.timer('articleUtil.formatArticleSections');
                articleUtil.formatArticleSections(article);
                lu.timer('articleUtil.formatArticleSections');
                lu.timer('articleUtil.replaceTagsWithContent');
                articleUtil.replaceTagsWithContent(article);
                lu.timer('articleUtil.replaceTagsWithContent');
            } else {
                article.title = '"' + lu.safeString(searchFor) + '" not found';
            }
            res.send(tpl({blog: searchRouter.config.blog, article: article}));
        })
        .catch(function (opt) {
            lu.timer('routes/search->search_articles');
            lu.sendUdp({timers: lu.timersGet()});
            opt.error = 'Error in search...';
            res.status(404).send(tpl({blog: searchRouter.config.blog, error: opt.error, article: opt.article}));
        })
        .done(function () {
            lu.timer('routes/search->request');
            lu.sendUdp({timers: lu.timersGet()});
        });

});

module.exports = searchRouter;
