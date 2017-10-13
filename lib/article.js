/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when          = require('when'),
    _             = require('underscore'),
    fs            =  require('fs'),
    appPath       = __dirname + '/../',
    ArticleUtil   = require(appPath + 'lib/article-util'),
    articleUtil   = new ArticleUtil(),
    CategoryUtil  = require(appPath + 'lib/category-util'),
    categoryUtil  = new CategoryUtil(),
    LocalUtil     = require(appPath + 'lib/local-util'),
    lu;

var STATUS_CODE = {
    200: 'OK',
    404: 'Not Found',
    500: 'Internal Server Error'
};

function Article(options) {
    this.opts = options || {};
    var logger = this.opts.logger;
    lu = new LocalUtil(this.opts);

    var currentAdapter = 'markdown';
    if (_.isObject(this.opts.config.adapter) && _.isString(this.opts.config.adapter.current)) {
        currentAdapter = this.opts.config.adapter.current;
    }

    this.adapter = require(appPath + 'lib/adapter/' + currentAdapter)({
        config: this.opts.config,
        logger: logger
    });

}

Article.prototype.load = function load(opt) {
    var adapter = this.adapter;
    return when.promise(function (resolve, reject) {
        var catlist, artlist, artlistall;

        if (_.isObject(opt) && opt.hasOwnProperty('artlist') && opt.hasOwnProperty('catlist')) {
            catlist = opt.catlist;
            artlist = opt.artlist;
            artlistall = opt.artlistall;
        }
        when(adapter.load({
            requestUrl: opt.requestUrl,
            catlist: catlist,
            artlist: artlist,
            artlistall: artlistall
        }))
            .then(function (article) {
                return adapter.listImages(article);
            })
            .then(function (article) {
                categoryUtil.formatCatlist(article, catlist);
                articleUtil.formatArtlist(article, artlist);
                articleUtil.formatArtAlllist(article, artlistall);
                articleUtil.formatArticleSections(article);
                articleUtil.replaceTagsWithContent(article);
                resolve(article);
            })
            .catch(function (error) {
                categoryUtil.formatCatlist(error.article, catlist);
                articleUtil.formatArtlist(error.article, artlist);
                articleUtil.formatArtAlllist(error.article, artlistall);
                articleUtil.formatArticleSections(error.article);
                articleUtil.replaceTagsWithContent(error.article);
                // http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
                reject({
                    error: STATUS_CODE[error.status],
                    statusCode: error.status,
                    article: error.article,
                    artlist: artlist,
                    artlistall: artlistall
                });
            })
            .done();
    });
};

Article.prototype.list = function list(articlePath) {
    var adapter = this.adapter;
    return when.promise(function (resolve, reject) {
        when(adapter.listArticles(articlePath))
            .done(function (artlist) {
                resolve(artlist);
            }, function (error) {
                reject(error);
            });
    });
};

Article.prototype.sitemap = function (catlist, artlist) {
    var opts = this.opts;
    return when.promise(function (resolve, reject) {
        // jscs:disable
        var sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>' + "\n" +
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.' +
            'org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">' + "\n";
        // jscs:enable
        if (_.isObject(catlist)) {
            for (var i in catlist) {
                if (catlist[i]) {
                    var cat = catlist[i];
                    // jscs:disable
                    sitemapXml += '    <url><loc>' + opts.protocol + '://' + opts.domain + '/' +
                        lu.quoteUrl(cat.name) + '/</loc><changefreq>weekly</changefreq><priority>0.85' +
                        '</priority></url>' + "\n";
                    // jscs:enable
                }
            }
        }
        if (_.isObject(artlist)) {
            for (var j in artlist) {
                if (artlist[j]) {
                    var art = artlist[j];
                    // jscs:disable
                    sitemapXml += '    <url><loc>' + opts.protocol + '://' + opts.domain +
                        lu.quoteUrl(art.baseHref) + lu.quoteUrl(art.file) + '</loc><changefreq>weekly' +
                        '</changefreq><priority>0.5</priority></url>' +  "\n";
                    // jscs:enable
                }
            }
        }
        // jscs:disable
        sitemapXml += '</urlset>' + "\n";
        // jscs:enable
        fs.writeFile(appPath + 'template/sitemap-' + opts.domain + '.xml', sitemapXml, function (err) {
            if (err) {
                reject(err);
            }
            resolve(sitemapXml);
        });
    });
};

module.exports = Article;
