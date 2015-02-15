/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';


var when = require('when'),
    _ = require('underscore'),
//    bodyParser = require('body-parser'),
    path = require('path'),
    commander = require('commander'),
    app_path = __dirname + '/../',
    logger = require(app_path + 'lib/logger')({});

commander
    .option('-c, --config <file>', 'configuration file path', './config/config.js')
    .parse(process.argv);
var config = require(commander.config);


var article_path = '/'; //article_util.getArticlePathRelative('');

// Load from function
var article = require(app_path + 'lib/article')({
    logger: logger,
    //filename: '',
    //article_path: article_path,
    domain: config.blog.domain,
    protocol: config.blog.protocol,
    max_articles_in_artlist : 5000,
    config: config
});

var category = require(app_path + 'lib/category')({
    logger: logger,
    config: config
});

var search = require(app_path + 'lib/search')({
    logger: logger,
    config: config
});

var lu    = require(app_path + 'lib/local-util')({config: config});
lu.timers_reset();
lu.timer('routes/sitemap->request');

when.all([category.list('/'), article.list(article_path)])
    .then(function (content_lists) {
        lu.timer('routes/sitemap->load_category_and_article_lists');
        when.all([
            article.sitemap(content_lists[0], content_lists[1]),
            search.index_artlist(content_lists[1], true)
        ])
            .then(function (results) {
                return results;
            });
    })
    .catch(function (opt) {
        lu.timer('routes/sitemap->request');
        lu.timer('routes/sitemap->load_category_and_article_lists');
        lu.send_udp({timers: lu.timers_get()});
        //res.status(404).send(tpl({blog: web_router.config.blog, error: opt.error, article: opt.article}));
    })
    .done(function () {
        console.log('done...');
        lu.timer('routes/sitemap->elasticsearch');
        lu.timer('routes/sitemap->request');
        lu.send_udp({timers: lu.timers_get()});
    });
