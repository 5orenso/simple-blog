/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const express = require('express');
const morgan = require('morgan');
const _ = require('underscore');
const fs = require('fs');
const swig = require('swig');
const path = require('path');

const appPath = `${__dirname}/../../`;
const templatePath = path.normalize(`${appPath}template/current/`);

const Category = require('../../lib/category');
const ArticleUtil = require('../../lib/article-util');
const CategoryUtil = require('../../lib/category-util');
const Logger = require('../../lib/logger');
const LocalUtil = require('../../lib/local-util');
const Search = require('../../lib/search');

const articleUtil = new ArticleUtil();
const categoryUtil = new CategoryUtil();
const logger = new Logger();
const localUtil = new LocalUtil();

let category;
let search;

const searchRouter = express.Router();
searchRouter.setConfig = function doSetConfig(conf, opt) {
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
        category = new Category({
            logger,
            config: conf,
        });

        search = new Search({
            logger,
            config: conf,
        });
    }
};
// middleware to use for all requests
const accessLogStream = fs.createWriteStream(`${appPath}/logs/search-access.log`, { flags: 'a' });

// setup the logger
searchRouter.use(morgan('combined', { stream: accessLogStream }));

searchRouter.use('/*', localUtil.setCacheHeaders);

// test route to make sure everything is working (accessed at GET http://localhost:8080/search)
searchRouter.get('/*', (req, res) => {
    const lu = new LocalUtil({ config: searchRouter.config });
    const requestUrl = articleUtil.getUrlFromRequest(req);
    // console.log('search for:', (_.isEmpty(req.query.q) ? requestUrl : req.query.q));
    // Check for cached file
    // If not cached compile file and store it.
    // TODO: How do we bypass the cache?
    const file = articleUtil.getArticleFilename(requestUrl);
    let template = templatePath + (file === 'index' ? 'index.html' : 'blog.html');

    if (_.isObject(searchRouter.config.template)) {
        template = appPath + (file === 'index'
            ? searchRouter.config.template.index : searchRouter.config.template.blog);
    }
    // var template = 'blog.html';
    const tpl = swig.compileFile(template);

    const searchFor = lu.safeString(_.isEmpty(req.query.q) ? requestUrl : req.query.q);
    const query = searchFor;
    const filter = {};
    const inputQuery = req.query;

    Promise.all([
        search.query(query, filter),
        category.list('/'),
    ])
        .then(results => results)
        .then((results) => {
            const catlist = results[1];
            let article = {};
            if (_.isArray(results) && _.isArray(results[0].hits) && _.isObject(results[0].hits[0])) {
                if (_.isObject(results[0].hits[0])) {
                    article = results[0].hits[0];
                }
                article.catlist = catlist;
                article.artlist = [];
                for (let i = 0, l = results[0].hits.length; i < l; i += 1) {
                    if (results[0].hits[i]) {
                        const art = results[0].hits[i];
                        article.artlist.push(art);
                    }
                }
                categoryUtil.formatCatlist(article, catlist);
                articleUtil.formatArtlist(article, article.artlist, true);
                articleUtil.formatArticleSections(article);
                articleUtil.replaceTagsWithContent(article);
            } else {
                article.title = `"${lu.safeString(searchFor)}" not found`;
            }
            res.send(tpl({
                blog: searchRouter.config.blog,
                article,
                query: inputQuery,
                searchMeta: results[0].meta,
            }));
        })
        .catch((opt) => {
            const error = 'Error in search...';
            res.status(404).send(tpl({
                blog: searchRouter.config.blog,
                error,
                article: opt.article,
                query: inputQuery,
            }));
        });
});

module.exports = searchRouter;
