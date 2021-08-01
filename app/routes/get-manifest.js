/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const _ = require('underscore');
const path = require('path');
const swig = require('../../lib/swig');
const Category = require('../../lib/category');
const Article = require('../../lib/article');
const ArticleUtil = require('../../lib/article-util');
const webUtil = require('../../lib/web-util');
const Logger = require('../../lib/logger');

const articleUtil = new ArticleUtil();
const logger = new Logger();

const appPath = `${__dirname}/../../`;
const templatePath = path.normalize(`${appPath}template/current/`);
const photoPath = path.normalize(`${appPath}content/images/`);

module.exports = (req, res) => {
    const { blog } = req.config;
    res.send({
        gcm_sender_id: '398878199812',
        name: blog.title,
        short_name: blog.title,
        description: blog.description,
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#fff',
        theme_color: '#808080',
        icons: [
            {
                src: `/assets/${blog.imagePath}/android-icon-36x36.png`,
                sizes: '36x36',
                type: 'image/png',
            },
            {
                src: `/assets/${blog.imagePath}/android-icon-192x192.png`,
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable',
            },
            {
                src: `/assets/${blog.imagePath}/android-icon-512x512.png`,
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    });
};
