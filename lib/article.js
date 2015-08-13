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
    appPath      = __dirname + '/../',
    articleUtil  = require(appPath + 'lib/article-util')(),
    categoryUtil = require(appPath + 'lib/category-util')();

var STATUS_CODE = {
    200: 'OK',
    404: 'Not Found',
    500: 'Internal Server Error'
};

var Article = function (options, mockServices) {
    var opts = options || {};
//    var maxArticlesInArtlist = opts.maxArticlesInArtlist || 9;
    var logger = opts.logger;
    mockServices = mockServices || {};

    var lu    = require(appPath + 'lib/local-util')(opts);

    var currentAdapter = 'markdown';
    if (_.isObject(opts.config.adapter) && _.isString(opts.config.adapter.current)) {
        currentAdapter = opts.config.adapter.current;
    }

    var adapter = require(appPath + 'lib/adapter/' + currentAdapter)({
        config: opts.config,
        logger: logger
    }, mockServices);

    return {
        load: function (opt) {
            return when.promise(function (resolve, reject) {
                var catlist, artlist;

                if (_.isObject(opt) && opt.hasOwnProperty('artlist') && opt.hasOwnProperty('catlist')) {
                    catlist = opt.catlist;
                    artlist = opt.artlist;
                }
                lu.timersReset();
                lu.timer(currentAdapter + '.load');
                when(adapter.load({
                    requestUrl: opts.requestUrl,
                    catlist: catlist,
                    artlist: artlist
                }))
                    .then(function (article) {
                        lu.timer(currentAdapter + '.load');
                        lu.timer(currentAdapter + '.listImages');
                        return adapter.listImages(article);
                    })
                    .then(function (article) {
                        lu.timer(currentAdapter + '.listImages');
                        lu.timer('categoryUtil.formatCatlist');
                        categoryUtil.formatCatlist(article, catlist);
                        lu.timer('categoryUtil.formatCatlist');
                        lu.timer('articleUtil.formatArtlist');
                        articleUtil.formatArtlist(article, artlist);
                        lu.timer('articleUtil.formatArtlist');
                        lu.timer('articleUtil.formatArticleSections');
                        articleUtil.formatArticleSections(article);
                        lu.timer('articleUtil.formatArticleSections');
                        lu.timer('articleUtil.replaceTagsWithContent');
                        articleUtil.replaceTagsWithContent(article);
                        lu.timer('articleUtil.replaceTagsWithContent');
                        lu.sendUdp({ timers: lu.timersGet() });
                        resolve(article);
                    })
                    .catch(function (error) {
                        lu.timer(currentAdapter + '.listImages');
                        categoryUtil.formatCatlist(error.article, catlist);
                        articleUtil.formatArtlist(error.article, artlist);
                        articleUtil.formatArticleSections(error.article);
                        articleUtil.replaceTagsWithContent(error.article);
                        lu.sendUdp({ timers: lu.timersGet() });
                        // http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
                        reject({
                            error: STATUS_CODE[error.status],
                            statusCode: error.status,
                            article: error.article,
                            artlist: artlist
                        });
                    })
                    .done();
            });
        },

        list: function (articlePath) {
            return when.promise(function (resolve, reject) {
                lu.timersReset();
                lu.timer(currentAdapter + '.listArticles');
                when(adapter.listArticles(articlePath))
                    .done(function (artlist) {
                        lu.timer(currentAdapter + '.listArticles');
                        lu.sendUdp({ timers: lu.timersGet() });
                        resolve(artlist);
                    }, function (error) {
                        lu.timer(currentAdapter + '.listArticles');
                        lu.sendUdp({ timers: lu.timersGet() });
                        reject(error);
                    });
            });
        },

        sitemap: function (catlist, artlist) {
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
        }
    };
};

module.exports = Article;
