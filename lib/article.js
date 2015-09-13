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
    categoryUtil = require(appPath + 'lib/category-util')(),
    Metrics   = require(appPath + 'lib/metrics'),
    metrics   = new Metrics({
        useDataDog: true
    });

var STATUS_CODE = {
    200: 'OK',
    404: 'Not Found',
    500: 'Internal Server Error'
};

var Article = function (options, mockServices) {
    var opts = options || {};
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

    // Add timer hooks to the functions you want to measure.
    var adapterFunctionToTime = ['load', 'listArticles', 'listImages'];
    var funcName;
    for (var j = 0; j <  adapterFunctionToTime.length; j++) {
        funcName = adapterFunctionToTime[j];
        adapter[funcName] = metrics.hook(adapter[funcName],
            'simpleblog.article.' + currentAdapter + '.' + funcName);
    }
    var articleUtilFunctionsToTime = ['formatArtlist', 'replaceTagsWithContent', 'formatArticleSections',
        'buildTableOfContents', 'populateArticleSections', 'getUrlFromRequest', 'getArticlePathRelative',
        'replaceMarked'];
    for (var i = 0; i <  articleUtilFunctionsToTime.length; i++) {
        funcName = articleUtilFunctionsToTime[i];
        articleUtil[funcName] = metrics.hook(articleUtil[funcName],
            'simpleblog.articleUtil.' + funcName);
    }
    var categoryUtilFunctionsToTime = ['formatCatlist'];
    for (var k = 0; k <  categoryUtilFunctionsToTime.length; k++) {
        funcName = categoryUtilFunctionsToTime[k];
        categoryUtil[funcName] = metrics.hook(categoryUtil[funcName],
            'simpleblog.categoryUtil.' + funcName);
    }

    return {
        load: function (opt) {
            return when.promise(function (resolve, reject) {
                var catlist, artlist;

                if (_.isObject(opt) && opt.hasOwnProperty('artlist') && opt.hasOwnProperty('catlist')) {
                    catlist = opt.catlist;
                    artlist = opt.artlist;
                }
                when(adapter.load({
                    requestUrl: opts.requestUrl,
                    catlist: catlist,
                    artlist: artlist
                }))
                    .then(function (article) {
                        return adapter.listImages(article);
                    })
                    .then(function (article) {
                        categoryUtil.formatCatlist(article, catlist);
                        articleUtil.formatArtlist(article, artlist);
                        articleUtil.formatArticleSections(article);
                        articleUtil.replaceTagsWithContent(article);
                        resolve(article);
                    })
                    .catch(function (error) {
                        categoryUtil.formatCatlist(error.article, catlist);
                        articleUtil.formatArtlist(error.article, artlist);
                        articleUtil.formatArticleSections(error.article);
                        articleUtil.replaceTagsWithContent(error.article);
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
                when(adapter.listArticles(articlePath))
                    .done(function (artlist) {
                        resolve(artlist);
                    }, function (error) {
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
