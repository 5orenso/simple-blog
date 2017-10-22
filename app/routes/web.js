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
const Logger = require('../../lib/logger');
const Category = require('../../lib/category');
const Article = require('../../lib/article');
const ArticleUtil = require('../../lib/article-util');
const LocalUtil = require('../../lib/local-util');

const logger = new Logger();
const articleUtil = new ArticleUtil();
const localUtil = new LocalUtil();

const appPath = `${__dirname}/../../`;
const templatePath = path.normalize(`${appPath}template/current/`);
let photoPath = path.normalize(`${appPath}content/images/`);
const keybase = 'keybase.txt';
let sitemap = 'sitemap.xml';
let category;
let article;

swig.setFilter('markdown', articleUtil.replaceMarked);
swig.setFilter('formatted', articleUtil.formatDate);
swig.setFilter('substring', articleUtil.substring);
swig.setFilter('cleanHtml', articleUtil.cleanHtml);
swig.setFilter('fixFilename', articleUtil.fixFilename);

const webRouter = express.Router();
webRouter.setConfig = function doSetConfig(conf, opt) {
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
            sitemap = `sitemap-${conf.blog.domain}.xml`;
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

function setConfig(req, res, next) {
    req.config = webRouter.config;
    next();
}

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(`${appPath}/logs/web-access.log`, { flags: 'a' });

// Setup the logger
webRouter.use(morgan('combined', { stream: accessLogStream }));

// Set config
webRouter.use(setConfig);
// webRouter.use(require('../../lib/jwt').authenticated);
webRouter.use(require('../../lib/jwt'));

// Setup static routes
webRouter.use('/global/', localUtil.setCacheHeaders);
webRouter.use('/global/', express.static(`${appPath}template/global/`));

webRouter.use('/template/', localUtil.setCacheHeaders);
webRouter.use('/template/', express.static(`${appPath}template/`));
webRouter.use('/js/', localUtil.setCacheHeaders);
webRouter.use('/js/', express.static(`${appPath}template/current/js/`));
webRouter.use('/images/', localUtil.setCacheHeaders);
webRouter.use('/images/', express.static(`${appPath}template/current/images/`));
webRouter.use('/css/', localUtil.setCacheHeaders);
webRouter.use('/css/', express.static(`${appPath}template/current/css/`));
webRouter.use('/fonts/', localUtil.setCacheHeaders);
webRouter.use('/fonts/', express.static(`${appPath}template/current/fonts/`));
webRouter.use('/favicon.ico/', localUtil.setCacheHeaders);
webRouter.use('/favicon.ico', express.static(`${appPath}template/current/favicon.ico`));
webRouter.use('/robots.txt/', localUtil.setCacheHeaders);
webRouter.use('/robots.txt', express.static(`${appPath}template/robots.txt`));
webRouter.use('/sitemap.xml/', localUtil.setCacheHeaders);
webRouter.get('/sitemap.xml', (req, res) => {
    res.sendFile(sitemap, { root: path.normalize(`${appPath}./template`) });
});
webRouter.use('/keybase.txt/', localUtil.setCacheHeaders);
webRouter.get('/keybase.txt', (req, res) => {
    res.sendFile(keybase, { root: path.normalize(webRouter.config.adapter.markdown.contentPath) });
});
webRouter.use('/photos/', localUtil.setCacheHeaders);
webRouter.get('/photos/*', (req, res) => {
    // Resolve filename
    let requestUrl = articleUtil.getUrlFromRequest(req);
    requestUrl = requestUrl.replace(/\/photos\//, '');
    res.sendFile(requestUrl, { root: path.normalize(webRouter.config.adapter.markdown.photoPath) });
});

webRouter.get('/send-magic-link', require('./send-magic-link.js'));
webRouter.get('/verify-magic-link', require('./verify-magic-link.js'));

// webRouter.post('/ajax/fileupload', webUtil.restrict, require('./post-fileupload.js'));
webRouter.get('/ajax/fileupload', require('./post-fileupload.js'));
webRouter.post('/ajax/fileupload', require('./post-fileupload.js'));

// Main route for blog articles.
webRouter.use('/*', localUtil.setNoCacheHeaders);
webRouter.get('/*', (req, res) => {
    // Resolve filename
    let requestUrl = articleUtil.getUrlFromRequest(req);
    const inputQuery = req.query;

    // Check for redirect
    let isRedirect = false;
    if (_.isObject(webRouter.config.blog) && _.isArray(webRouter.config.blog.rewrites)) {
        for (let i = 0, l = webRouter.config.blog.rewrites.length; i < l; i += 1) {
            if (webRouter.config.blog.rewrites[i]) {
                const rewrite = webRouter.config.blog.rewrites[i];
                if (requestUrl.match(rewrite.url)) {
                    // console.log('Rewriting...', rewrite);
                    let target = rewrite.target;
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
        const articleAllPath = articleUtil.getArticlePathRelative('/');
        const articlePath = articleUtil.getArticlePathRelative(requestUrl);

        if (typeof req.session === 'object' && req.session.iat) {
            const now = parseInt((new Date()).getTime() / 1000, 10);
            req.session.age = now - req.session.iat;
        }
        // Check for cached file
        // If not cached compile file and store it.
        // TODO: How do we bypass the cache?
        const file = articleUtil.getArticleFilename(requestUrl);
        let template = templatePath + (file === 'index' ? 'index.html' : 'blog.html');

        if (_.isObject(webRouter.config.template)) {
            template = appPath + (file === 'index' ? webRouter.config.template.index : webRouter.config.template.blog);
        }
        // var template = 'blog.html';
        const tpl = swig.compileFile(template);

        when.all([category.list('/'), article.list(articlePath), article.list(articleAllPath)])
            .then(contentLists => article.load({
                requestUrl,
                catlist: contentLists[0],
                artlist: contentLists[1],
                artlistall: contentLists[2],
            }))
            .then(($resultArticle) => {
                const resultArticle = $resultArticle;
                for (let i = 0, l = resultArticle.artlist.length; i < l; i += 1) {
                    const art = resultArticle.artlist[i];
                    if (resultArticle.file === art.file) {
                        art.next = resultArticle.artlist[i - 1];
                        art.previous = resultArticle.artlist[i + 1];
                    }
                }
                resultArticle.artlistTotal = resultArticle.artlist.length;
                res.send(tpl({
                    file: {
                        name: file,
                        path: articlePath,
                    },
                    blog: webRouter.config.blog,
                    article: resultArticle,
                    query: inputQuery,
                    session: req.session,
                }));
            })
            .catch((opt) => {
                res.status(404).send(tpl({
                    blog: webRouter.config.blog,
                    error: opt.error,
                    article: opt.article,
                    query: inputQuery,
                }));
            });
    }
});
module.exports = webRouter;
