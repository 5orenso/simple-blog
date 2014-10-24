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
    path          = require('path'),
    walk          = require('walk'),
    app_path      = __dirname + '/../',
    article_util  = require(app_path + 'lib/article-util')(),
    category_util = require(app_path + 'lib/category-util')(),
    local_util    = require(app_path + 'lib/local-util')();

var STATUS_CODE = {
    200: 'OK',
    404: 'Not Found',
    500: 'Internal Server Error'
};

var Article = function (options, mock_services) {
    var opts = options || {};
    var max_articles_in_artlist = opts.max_articles_in_artlist || 9;
    var logger = opts.logger;
    mock_services = mock_services || {};

    var adapter = require(app_path + 'lib/adapter/markdown')({
        config: opts.config,
        logger: logger
    });


    return {
        load: function (opt) {
            return when.promise(function (resolve, reject) {
                var catlist, artlist;
                if (_.isObject(opt) && opt.hasOwnProperty('artlist') && opt.hasOwnProperty('catlist')) {
                    catlist = opt.catlist;
                    artlist = opt.artlist;
                }
                when(adapter.load({
                    request_url: opts.request_url,
                    catlist: catlist,
                    artlist: artlist
                }))
                    .then(adapter.list_images)
                    .then(function (article) {
                        category_util.format_catlist(article, catlist);
                        article_util.formatArtlist(article, artlist);
                        article_util.formatArticleSections(article);
                        article_util.replaceTagsWithContent(article);
                        resolve(article);
                    })
                    .catch(function (error) {
                        category_util.format_catlist(error.article, catlist);
                        article_util.formatArtlist(error.article, artlist);
                        article_util.formatArticleSections(error.article);
                        article_util.replaceTagsWithContent(error.article);
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


        list: function () {
            return when.promise( function (resolve, reject) {
                when(adapter.list_articles(opts.article_path))
                    .done(resolve, reject);
            });
        },


        sitemap: function (opt) {
            var catlist, artlist;
            if (_.isObject(opt) && opt.hasOwnProperty('artlist') && opt.hasOwnProperty('catlist')) {
                catlist = opt.catlist;
                artlist = opt.artlist;
            }
            return when.promise( function (resolve, reject) {
                var sitemap_xml = '<?xml version="1.0" encoding="UTF-8"?>' + "\n" +
                    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">' + "\n";
                if (_.isObject(catlist)) {
                    for (var i in catlist) {
                        if (catlist[i]) {
                            var cat = catlist[i];
                            sitemap_xml += '    <url><loc>' + opts.protocol + '://' + opts.domain + '/' + local_util.quote_url(cat.name) + '/</loc><changefreq>weekly</changefreq><priority>0.85</priority></url>' + "\n";
                        }
                    }
                }
                if (_.isObject(artlist)) {
                    for (var j in artlist) {
                        if (artlist[j]) {
                            var art = artlist[j];
                            sitemap_xml += '    <url><loc>' + opts.protocol + '://' + opts.domain + local_util.quote_url(art.base_href) + local_util.quote_url(art.file) + '</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>' +  "\n";
                        }
                    }
                }
                sitemap_xml += '</urlset>' + "\n";
                fs.writeFile(app_path + 'template/sitemap.xml', sitemap_xml, function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(sitemap_xml);
                });
            });
        }
    };
};

module.exports = Article;
