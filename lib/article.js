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



    function check_if_article_exists (filename, artlist) {
        // Should this function return the first article in the list
        // if the input does not exist inside the list?
        var base_filename = filename.replace(/^(.+\/)/, '');
        if (base_filename.match(/^_/)) {
            return filename;
        }
        function article_exists (el, index, array) {
            return el.filename === filename;
        }
        if (base_filename.match(/^index\.(md|html|htm)$/)) {
            if (_.isArray(artlist) && artlist.length > 0) {
                if (!artlist.some(article_exists)) {
                    return artlist[0].filename;
                }
            }
        }
        return filename;
    }


    function load_article (opt, callback) {
        if (!opt.filename.match(/\.md$/)) {
            opt.filename += '.md';
        }
        var filename = check_if_article_exists(opt.filename, opt.artlist);
        logger.log('load_article->filename: ', filename);
        fs.readFile(path.normalize(filename), { encoding: 'utf8'}, function (err, data) {
            var article = article_util.populate_article_sections(data);
            article.file = opt.file;
            article.filename = filename;
            article.base_href = opt.base_href;
            if (err) {
                logger.err(404, 'File not found: ' + filename);
                callback(404, article);
            }
            callback(err, article);
        });
    }


    function load_artlist (content_root, relative_path, callback) {
        logger.log('load_artlist->content_root: ', content_root);
        logger.log('load_artlist->relative_path: ', relative_path);
        var walker  = walk.walk(content_root, { followLinks: true });
        var files = [];
        walker.on("file", function (root, stat, next) {
            if (stat.name.match(/^[^\._]/)) {
                var re = new RegExp(content_root,"g");
                root = root.replace(re,'');
                stat.name = stat.name.replace(/\.md$/, '');
                stat.filename = path.normalize(root + '/' + stat.name);
                stat.base_href = relative_path;
                files.push(stat);
            }
            next();
        });
        walker.on('end', function() {
            var array = [];
            files = local_util.sortByKey(files, 'mtime');

            function loadAllArticles (resolve, reject) {
                load_article({
                    filename: content_root + file,
                    file: file,
                    base_href: base_href
                }, function(err, article) {
                    resolve(article);
                });
            }

            var file_cnt = 0;
            for (var i in files) {
                if (files[i] && file_cnt < max_articles_in_artlist) {
                    file_cnt++;
                    var file = files[i].filename,
                        base_href = files[i].base_href;
                    array.push(when.promise(loadAllArticles));
                }
            }
            when.all(array)
                .then(function(artlist) {
                    artlist = local_util.sortByKey(artlist, 'published', '1900-01-01');
                    callback(null, artlist);
                });
        });
        walker.on('error', function (err, entry, stat) {
            callback(err);
        });
    }


    return {
        load: function (opt) {
            var catlist, artlist;
            if (_.isObject(opt) && opt.hasOwnProperty('artlist') && opt.hasOwnProperty('catlist')) {
                catlist = opt.catlist;
                artlist = opt.artlist;
            }
            return when.promise(function (resolve, reject) {
                load_article({
                    filename: opts.filename,
                    catlist: catlist,
                    artlist: artlist
                }, function (err, article) {
                    if (err) {
                        // http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
                        reject({
                            error: STATUS_CODE[err],
                            statusCode: err,
                            article: article
                        });
                    }
                    category_util.format_catlist(article, catlist);
                    article_util.format_artlist(article, artlist);
                    article_util.format_article_sections(article);
                    article_util.replace_tags_with_content(article);
                    resolve(article);
                });
            });
        },

        list: function (opt) {
            return when.promise( function (resolve, reject) {
                var content_path = path.normalize(opts.content_path + opts.article_path);
                load_artlist(content_path, opts.article_path, function (err, artlist) {
                    if (err) {
                        reject({ error: err });
                    }
                    resolve(artlist);
                });
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
                            sitemap_xml += '    <url><loc>' + opts.protocol + '://' + opts.domain + local_util.quote_url(art.file) + '</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>' +  "\n";
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
