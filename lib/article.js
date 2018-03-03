/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const appPath = `${__dirname}/../`;
const _ = require('underscore');
const fs = require('fs');
const ArticleUtil = require('./article-util');
const CategoryUtil = require('./category-util');
const LocalUtil = require('./local-util');

const articleUtil = new ArticleUtil();
const categoryUtil = new CategoryUtil();
let lu;

const STATUS_CODE = {
    200: 'OK',
    404: 'Not Found',
    500: 'Internal Server Error',
};

function Article(options) {
    this.opts = options || {};
    const logger = this.opts.logger;
    lu = new LocalUtil(this.opts);

    let currentAdapter = 'markdown';
    if (_.isObject(this.opts.config.adapter) && _.isString(this.opts.config.adapter.current)) {
        currentAdapter = this.opts.config.adapter.current;
    }

    // eslint-disable-next-line
    this.adapter = require(`${appPath}lib/adapter/${currentAdapter}`)({
        config: this.opts.config,
        logger,
    });
}

Article.prototype.load = function load(opt) {
    const adapter = this.adapter;
    return new Promise((resolve, reject) => {
        let catlist;
        let artlist;
        let artlistall;

        if (_.isObject(opt) && opt.hasOwnProperty('artlist') && opt.hasOwnProperty('catlist')) {
            catlist = opt.catlist;
            artlist = opt.artlist;
            artlistall = opt.artlistall;
        }
        adapter.load({
            requestUrl: opt.requestUrl,
            catlist,
            artlist,
            artlistall,
        })
            .then(article => adapter.listImages(article))
            .then((article) => {
                categoryUtil.formatCatlist(article, catlist);
                articleUtil.formatArtlist(article, artlist);
                articleUtil.formatArtAlllist(article, artlistall);
                articleUtil.formatArticleSections(article);
                articleUtil.replaceTagsWithContent(article);
                resolve(article);
            })
            .catch((error) => {
                categoryUtil.formatCatlist(error.article, catlist);
                articleUtil.formatArtlist(error.article, artlist);
                articleUtil.formatArtAlllist(error.article, artlistall);
                articleUtil.formatArticleSections(error.article);
                articleUtil.replaceTagsWithContent(error.article);
                // http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
                // eslint-disable-next-line
                reject({
                    error: STATUS_CODE[error.status],
                    statusCode: error.status,
                    article: error.article,
                    artlist,
                    artlistall,
                });
            });
    });
};

Article.prototype.list = function list(articlePath) {
    const adapter = this.adapter;
    return new Promise((resolve, reject) => {
        adapter.listArticles(articlePath)
            .then((artlist) => {
                resolve(artlist);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

Article.prototype.sitemap = function sitemap(catlist, artlist) {
    const opts = this.opts;
    return new Promise((resolve, reject) => {
        // jscs:disable
        let sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.' +
            'org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';
        // jscs:enable
        if (_.isObject(catlist)) {
            for (let i = 0, l = catlist.length; i < l; i += 1) {
                if (catlist[i]) {
                    const cat = catlist[i];
                    sitemapXml += `    <url><loc>${opts.protocol}://${opts.domain}/${
                        lu.quoteUrl(cat.name)}/</loc><changefreq>weekly</changefreq><priority>0.85</priority></url>\n`;
                }
            }
        }
        if (_.isObject(artlist)) {
            for (let j = 0, m = artlist.length; j < m; j += 1) {
                if (artlist[j]) {
                    const art = artlist[j];
                    sitemapXml += `    <url><loc>${opts.protocol}://${opts.domain}${lu.quoteUrl(art.baseHref)}${
                        lu.quoteUrl(art.file)}</loc><changefreq>weekly</changefreq>
                        <priority>0.5</priority></url>\n`;
                }
            }
        }
        sitemapXml += '</urlset>\n';
        fs.writeFile(`${appPath}template/sitemap-${opts.domain}.xml`, sitemapXml, (err) => {
            if (err) {
                reject(err);
            }
            resolve(sitemapXml);
        });
    });
};

module.exports = Article;
