/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express      = require('express'),
    morgan       = require('morgan'),
    when         = require('when'),
    _            = require('underscore'),
    fs           = require('fs'),
    swig          = require('swig'),
    path         = require('path'),
    app_path     = __dirname + '/../../',
    template_path = path.normalize(app_path + 'template/current/'),
    photo_path    = path.normalize(app_path + 'content/images/'),
    article_util = require(app_path + 'lib/article-util')(),
    logger       = require(app_path + 'lib/logger')(),
    local_util    = require(app_path + 'lib/local-util')();

var stats, activeConn, timer, config;
var search_router = express.Router();
search_router.set_config = function (conf, opt) {
    search_router.config = conf;
    search_router.opt = opt;
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
var accessLogStream = fs.createWriteStream(app_path + '/logs/search-access.log', {flags: 'a'});

// setup the logger
search_router.use(morgan('combined', {stream: accessLogStream}));

search_router.use('/*', local_util.set_cache_headers);

// test route to make sure everything is working (accessed at GET http://localhost:8080/search)
search_router.get('/*', function(req, res) {
    var lu    = require(app_path + 'lib/local-util')({config: search_router.config});
    var request_url = article_util.getUrlFromRequest(req);
    //console.log('search for:', (_.isEmpty(req.query.q) ? request_url : req.query.q));
    // Check for cached file
    // If not cached compile file and store it.
    // TODO: How do we bypass the cache?
    var file = article_util.getArticleFilename(request_url);
    var template = template_path + (file === 'index' ? 'index.html' : 'blog.html');

    if (_.isObject(search_router.config.template)) {
        template = app_path + (file === 'index' ? search_router.config.template.index : search_router.config.template.blog);
    }
    //var template = 'blog.html';
    var tpl = swig.compileFile(template);

    var category = require(app_path + 'lib/category')({
        logger: logger,
        config: search_router.config
    });

    var search = require(app_path + 'lib/search')({
        logger: logger,
        config: search_router.config
    }, search_router.config.adapter.mock_services);

    lu.timers_reset();
    lu.timer('routes/search->request');

    var search_for = lu.safe_string(_.isEmpty(req.query.q) ? request_url : req.query.q);
    var query = {
        //_all: lu.safe_string(req.query.q)
        _all: search_for
    };
    var filter = {};

    when.all([search.query(query, filter), category.list('/')])
        .then(function (results) {
            lu.timer('routes/search->search_articles');
            return results;
        })
        .then(function (results) {
            lu.timer('routes/search->search_articles');
            var article = {};
            if (_.isArray(results) && _.isArray(results[0]) && _.isObject(results[0][0])) {
                if (_.isObject(results[0][0])) {
                    article = results[0][0];
                }
                article.catlist = results[1];
                article.artlist = [];
                for (var i in results[0]) {
                    if (results[0][i]) {
                        var art = results[0][i];
                        article.artlist.push(art);
                    }
                }
                lu.timer('category_util.format_catlist');
                category_util.format_catlist(article, catlist);
                lu.timer('category_util.format_catlist');
                lu.timer('article_util.formatArtlist');
                article_util.formatArtlist(article, article.artlist);
                lu.timer('article_util.formatArtlist');
                lu.timer('article_util.formatArticleSections');
                article_util.formatArticleSections(article);
                lu.timer('article_util.formatArticleSections');
                lu.timer('article_util.replaceTagsWithContent');
                article_util.replaceTagsWithContent(article);
                lu.timer('article_util.replaceTagsWithContent');
            } else {
                article.title = '"' + lu.safe_string(search_for) + '" not found';
            }
            res.send(tpl({blog: search_router.config.blog, article: article}));
        })
        .catch(function (opt) {
            lu.timer('routes/search->search_articles');
            lu.send_udp({timers: lu.timers_get()});
            opt.error = 'Error in search...';
            res.status(404).send(tpl({blog: search_router.config.blog, error: opt.error, article: opt.article}));
        })
        .done(function () {
            lu.timer('routes/search->request');
            lu.send_udp({timers: lu.timers_get()});
        });


});

module.exports = search_router;
