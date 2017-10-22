/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const express = require('express');
const morgan = require('morgan');
const when = require('when');
const _ = require('underscore');
const swig = require('swig');
const fs = require('fs');
const path = require('path');

const appPath = `${__dirname}/../../`;
const templatePath = path.normalize(`${appPath}template/current/`);
let photoPath = path.normalize(`${appPath}content/images/`);

const Logger = require('../../lib/logger');
const Category = require('../../lib/category');
const Article = require('../../lib/article');
const ArticleUtil = require('../../lib/article-util');
const LocalUtil = require('../../lib/local-util');

const logger = new Logger();
const articleUtil = new ArticleUtil();
const localUtil = new LocalUtil();

let category;
let article;

swig.setFilter('markdown', articleUtil.replaceMarked);
swig.setFilter('formatted', articleUtil.formatDate);
swig.setFilter('rssdate', articleUtil.rssDate);

// var stats, activeConn, timer, timer_v2, config;
const rssRouter = express.Router();
rssRouter.setConfig = function doSetConfig(conf, opt) {
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
            logger,
            photoPath,
            config: conf,
        });

        category = new Category({
            logger,
            config: conf,
        });
    }
};

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(`${appPath}/logs/rss-access.log`, { flags: 'a' });

// Setup the logger
rssRouter.use(morgan('combined', { stream: accessLogStream }));

// Main route for blog articles.
rssRouter.use('/*', localUtil.setNoCacheHeaders);
rssRouter.get('/*', (req, res) => {
    // Resolve filename
    const requestUrl = articleUtil.getUrlFromRequest(req);

    // Load content based on filename
    const articlePath = articleUtil.getArticlePathRelative(requestUrl);

    // Stop timer when response is transferred and finish.
    res.on('finish', () => {
        // if (timer) { stopwatch.end(); }
    });
    res.setHeader('Content-type', 'text/xml');

    // Check for cached file
    // If not cached compile file and store it.
    // TODO: How do we bypass the cache?
    const file = articleUtil.getArticleFilename(requestUrl);
    const template = templatePath + (file === 'index' ? 'rss.xml' : 'rss.xml');
    const tpl = swig.compileFile(template);

    when.all([category.list('/'), article.list(articlePath)])
        .then(contentLists => article.load({
            requestUrl,
            catlist: contentLists[0],
            artlist: contentLists[1],
        }))
        .then((resultArticle) => {
            res.send(tpl({
                blog: rssRouter.config.blog,
                article: resultArticle,
            }));
        })
        .catch((opt) => {
            res.status(404).send(tpl({
                blog: rssRouter.config.blog,
                error: opt.error,
                article: opt.article,
            }));
        });
});
module.exports = rssRouter;
