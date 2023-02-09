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

webRouter.get('/themusher/:raceId', require('./themusher/get-race'));
webRouter.get('/manifest.json', require('./get-manifest'));

// Setup static routes
webRouter.use('/global/', localUtil.setCacheHeaders);
webRouter.use('/global/', express.static(`${appPath}template/global/`));
webRouter.use('/assets/', express.static(`${appPath}template/global/assets/`));

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
webRouter.use('/preact/simple-blog-cms/', express.static(`${appPath}preact/simple-blog-cms/build/`));

webRouter.use('/preact/simple-blog-helloworld/', express.static(`${appPath}preact/simple-blog-helloworld/bundle/`));
webRouter.use('/preact/simple-blog-clock/', express.static(`${appPath}preact/simple-blog-clock/bundle/`));
webRouter.use('/preact/simple-blog-booking/', express.static(`${appPath}preact/simple-blog-booking/bundle/`));
webRouter.use('/preact/simple-blog-form/', express.static(`${appPath}preact/simple-blog-form/bundle/`));
webRouter.use('/preact/simple-blog-sheet/', express.static(`${appPath}preact/simple-blog-sheet/bundle/`));
webRouter.use('/preact/simple-blog-poll/', express.static(`${appPath}preact/simple-blog-poll/bundle/`));
webRouter.use('/preact/simple-blog-gallery/', express.static(`${appPath}preact/simple-blog-gallery/bundle/`));
webRouter.use('/preact/simple-blog-weather/', express.static(`${appPath}preact/simple-blog-weather/bundle/`));
webRouter.use('/preact/simple-blog-rating/', express.static(`${appPath}preact/simple-blog-rating/bundle/`));
webRouter.use('/preact/simple-blog-cookies/', express.static(`${appPath}preact/simple-blog-cookies/bundle/`));
webRouter.use('/preact/simple-blog-racetracker/', express.static(`${appPath}preact/simple-blog-racetracker/bundle/`));
webRouter.use('/preact/simple-blog-related/', express.static(`${appPath}preact/simple-blog-related/bundle/`));
webRouter.use('/preact/simple-blog-loginlink/', express.static(`${appPath}preact/simple-blog-loginlink/bundle/`));
webRouter.use('/preact/simple-blog-livecenter/', express.static(`${appPath}preact/simple-blog-livecenter/bundle/`));
webRouter.use('/preact/simple-blog-livecenter2/', express.static(`${appPath}preact/simple-blog-livecenter2/bundle/`));

webRouter.use('/preact/simple-blog-map/', express.static(`${appPath}preact/simple-blog-map/bundle/`));
webRouter.use('/assets/', express.static(`${appPath}preact/simple-blog-map/bundle/assets/`));

webRouter.post('/push-register', require('./post-push-register'));
webRouter.post('/push-error', require('./post-push-error'));
webRouter.get('/push-send', require('./get-push-send'));

webRouter.get('/photos/*', (req, res) => {
    // Resolve filename
    let requestUrl = articleUtil.getUrlFromRequest(req);
    requestUrl = requestUrl.replace(/\/photos\//, '');
    res.sendFile(requestUrl, { root: path.normalize(req.config.adapter.markdown.photoPath) });
});

// webRouter.get('/send-magic-link', require('./send-magic-link'));
webRouter.get('/verify-magic-link', require('./verify-magic-link'));

webRouter.get('/ajax/savefile', util.restrict, require('./post-savefile'));
webRouter.post('/ajax/savefile', util.restrict, require('./post-savefile'));

webRouter.get('/ajax/fileupload', util.restrict, require('./post-fileupload'));
webRouter.post('/ajax/fileupload', util.restrict, require('./post-fileupload'));

webRouter.get('/admin', util.restrict, require('./get-admin'));

webRouter.get('/iotdevice/version/:chipId', require('./iotdevice/get-version'));
webRouter.get('/iotdevice/firmware/:chipId', require('./iotdevice/get-firmware'));


// Main route for blog articles.
webRouter.use('/*', localUtil.setNoCacheHeaders);
webRouter.get('/*', require('./get-default'));

module.exports = webRouter;
