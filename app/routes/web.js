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
const path = require('path');
const Logger = require('../../lib/logger');
const ArticleUtil = require('../../lib/article-util');
const LocalUtil = require('../../lib/local-util');
const util = require('../../lib/utilities');

const logger = new Logger();
const articleUtil = new ArticleUtil();
const localUtil = new LocalUtil();

const appPath = `${__dirname}/../../`;
const keybase = 'keybase.txt';
let sitemap = 'sitemap.xml';

const webRouter = express.Router();
webRouter.setConfig = function doSetConfig(conf, opt) {
    webRouter.config = conf;
    webRouter.opt = opt;
    if (conf) {
        if (_.isObject(conf)) {
            if (_.isObject(conf.log)) {
                logger.set('log', conf.log);
            }
            sitemap = `sitemap-${conf.blog.domain}.xml`;
        }
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
webRouter.use(require('../../lib/jwt'));

webRouter.use('/v2/', localUtil.setNoCacheHeaders);
webRouter.use('/v2/', require('./v2/'));

webRouter.use('/api/', localUtil.setNoCacheHeaders);
webRouter.use('/api/', require('./api/'));

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
    res.sendFile(keybase, { root: path.normalize(req.config.adapter.markdown.contentPath) });
});
webRouter.use('/photos/', localUtil.setCacheHeaders);
webRouter.use('/service-worker.js', express.static(`${appPath}preact/simple-blog-cms/build/service-worker.js`));
webRouter.use('/precache-manifest.c5e755b638ae680a0791c706e7469891.js',
    express.static(`${appPath}preact/simple-blog-cms/build/precache-manifest.c5e755b638ae680a0791c706e7469891.js`));

webRouter.use('/preact/simple-blog-cms/', express.static(`${appPath}preact/simple-blog-cms/build/`));

webRouter.post('/push-register', require('./post-push-register.js'));
webRouter.post('/push-error', require('./post-push-error.js'));
webRouter.get('/push-send', require('./get-push-send.js'));

webRouter.get('/photos/*', (req, res) => {
    // Resolve filename
    let requestUrl = articleUtil.getUrlFromRequest(req);
    requestUrl = requestUrl.replace(/\/photos\//, '');
    res.sendFile(requestUrl, { root: path.normalize(req.config.adapter.markdown.photoPath) });
});

webRouter.get('/send-magic-link', require('./send-magic-link.js'));
webRouter.get('/verify-magic-link', require('./verify-magic-link.js'));

webRouter.get('/ajax/savefile', util.restrict, require('./post-savefile.js'));
webRouter.post('/ajax/savefile', util.restrict, require('./post-savefile.js'));

webRouter.get('/ajax/fileupload', util.restrict, require('./post-fileupload.js'));
webRouter.post('/ajax/fileupload', util.restrict, require('./post-fileupload.js'));

webRouter.get('/admin', util.restrict, require('./get-admin.js'));

// Main route for blog articles.
webRouter.use('/*', localUtil.setNoCacheHeaders);
webRouter.get('/*', require('./get-default.js'));

module.exports = webRouter;
