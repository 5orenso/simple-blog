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
    filename: '',
    article_path: article_path,
    domain: config.blog.domain,
    protocol: config.blog.protocol,
    max_articles_in_artlist : 500
});

when(article.catlist())
    .then(article.artlist)
    .then(article.sitemap)
    .done();
