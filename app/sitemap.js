/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var when      = require('when'),
    commander = require('commander'),
    appPath   = __dirname + '/../',
    Logger    = require(appPath + 'lib/logger'),
    logger    = new Logger({}),
    LocalUtil = require(appPath + 'lib/local-util');

commander
    .option('-c, --config <file>', 'configuration file path', './config/config.js')
    .parse(process.argv);
var config = require(commander.config);

var articlePath = '/'; //articleUtil.getArticlePathRelative('');

// Load from function
var Article = require(appPath + 'lib/article');
var article = new Article({
    logger: logger,
    //filename: '',
    //articlePath: articlePath,
    domain: config.blog.domain,
    protocol: config.blog.protocol,
    maxArticlesInArtlist: 5000,
    config: config
});

var Category = require(appPath + 'lib/category');
var category = new Category({
    logger: logger,
    config: config
});

var Search = require(appPath + 'lib/search');
var search = new Search({
    logger: logger,
    config: config
});

var lu    = new LocalUtil({config: config});
lu.timersReset();
lu.timer('routes/sitemap->request');

when.all([category.list('/'), article.list(articlePath)])
    .then(function (contentLists) {
        lu.timer('routes/sitemap->load_category_and_article_lists');
        when.all([
            article.sitemap(contentLists[0], contentLists[1]),
            search.indexArtlist(contentLists[1], true)
        ])
            .then(function (results) {
                return results;
            });
    })
    .catch(function () {
        lu.timer('routes/sitemap->request');
        lu.timer('routes/sitemap->load_category_and_article_lists');
        lu.sendUdp({timers: lu.timersGet()});
        //res.status(404).send(tpl({blog: webRouter.config.blog, error: opt.error, article: opt.article}));
    })
    .done(function () {
        console.log('done...');
        lu.timer('routes/sitemap->elasticsearch');
        lu.timer('routes/sitemap->request');
        lu.sendUdp({timers: lu.timersGet()});
        setTimeout(function () {
            process.exit(1);
        }, 5000);

    });
