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
    appPath       = __dirname + '/../../',
    templatePath  = path.normalize(appPath + 'template/current/'),
    Category      = require(appPath + 'lib/category'),
    ArticleUtil   = require(appPath + 'lib/article-util'),
    articleUtil   = new ArticleUtil(),
    CategoryUtil  = require(appPath + 'lib/category-util'),
    categoryUtil  = new CategoryUtil(),
    Logger        = require(appPath + 'lib/logger'),
    logger        = new Logger(),
    LocalUtil     = require(appPath + 'lib/local-util'),
    localUtil     = new LocalUtil(),
    Metrics       = require(appPath + 'lib/metrics'),
    metrics       = new Metrics({
        useDataDog: true
    }),
    Search        = require(appPath + 'lib/search');

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
    var lu    = new LocalUtil({config: searchRouter.config});
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

    var category = new Category({
        logger: logger,
        config: searchRouter.config
    });

    var search = new Search({
        logger: logger,
        config: searchRouter.config
    });

    // Add timer hooks to the functions you want to measure.
    var funcName;
    var searchFunctionsToTime = ['query', 'index', 'indexArtlist'];
    for (var k = 0; k <  searchFunctionsToTime.length; k++) {
        funcName = searchFunctionsToTime[k];
        search[funcName] = metrics.hook(search[funcName],
            'simpleblog.lib.search.' + funcName);
    }

    var searchFor = lu.safeString(_.isEmpty(req.query.q) ? requestUrl : req.query.q);
    var query = searchFor;
    var filter = {};
    var inputQuery = req.query;

    when.all([search.query(query, filter), category.list('/')])
        .then(function (results) {
            return results;
        })
        .then(function (results) {
            var catlist = results[1];
            var article = {};
            if (_.isArray(results) && _.isArray(results[0].hits) && _.isObject(results[0].hits[0])) {
                if (_.isObject(results[0].hits[0])) {
                    article = results[0].hits[0];
                }
                article.catlist = catlist;
                article.artlist = [];
                for (var i in results[0].hits) {
                    if (results[0].hits[i]) {
                        var art = results[0].hits[i];
                        article.artlist.push(art);
                    }
                }
                categoryUtil.formatCatlist(article, catlist);
                articleUtil.formatArtlist(article, article.artlist);
                articleUtil.formatArticleSections(article);
                articleUtil.replaceTagsWithContent(article);
            } else {
                article.title = '"' + lu.safeString(searchFor) + '" not found';
            }
            res.send(tpl({
                blog: searchRouter.config.blog,
                article: article,
                query: inputQuery,
                searchMeta: results[0].meta
            }));
        })
        .catch(function (opt) {
            opt.error = 'Error in search...';
            res.status(404).send(tpl({
                blog: searchRouter.config.blog,
                error: opt.error,
                article: opt.article,
                query: inputQuery
            }));
        })
        .done(function () {
            metrics.increment('simpleblog.search.' + searchFor);
        });

});

module.exports = searchRouter;
