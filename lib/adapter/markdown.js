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
    app_path      = __dirname + '/../../',
    article_util  = require(app_path + 'lib/article-util')(),
    local_util    = require(app_path + 'lib/local-util')();


var Markdown = function (options, mock_services) {
    var opts = options || {};
    var logger = opts.logger;
    mock_services = mock_services || {};

    var config = {};
    if (_.isObject(opts.config) && _.isObject(opts.config.adapter)) {
        config = opts.config.adapter.markdown;
    }


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


    function load_file (opt) {
        return when.promise( function (resolve, reject) {
            var request_url = opt.request_url;
            var file_base = article_util.getArticleFilename(request_url);
            var file = file_base;
            var file_path = article_util.getArticlePathRelative(request_url);
            if (!file.match(/\.md$/)) {
                file += '.md';
            }
            var filename = check_if_article_exists(path.normalize(config.content_path + file_path + file), opt.artlist);
            fs.readFile(filename, { encoding: 'utf8'}, function (err, data) {
                var article = article_util.populateArticleSections(data);
                article.file = file_base;
                article.filename = path.normalize(filename);
                article.base_href = article_util.getArticlePathRelative(article.filename, config.content_path);
                if (err) {
                    reject({ status: 404, article: article });
                } else {
                    resolve(article);
                }
            });
        });
    }



    function list_files (relative_path) {
        return when.promise( function (resolve, reject) {
            logger.log('load_article_list->relative_path: ', relative_path);
            var selected_content_folder = path.normalize(config.content_path + relative_path);
            var walker = walk.walk(selected_content_folder, { followLinks: true });
            var files = [];
            walker.on("file", function (root, stat, next) {
                if (stat.name.match(/^[^\._]/)) {
                    stat.base_href = article_util.getArticlePathRelative(root + '/' + stat.name, config.content_path);
                    var re = new RegExp(config.content_path, "g");
                    root = root.replace(re, '');
                    stat.name = stat.name.replace(/\.md$/, '');
                    stat.filename = path.normalize(root + '/' + stat.name);
                    files.push(stat);
                }
                next();
            });
            walker.on('end', function () {
                var array = [];
                files = local_util.sortByKey(files, 'mtime');

                function loadAllArticles(resolve, reject) {
                    when(load_file({
                        request_url: base_href + file,
                    }))
//                       .then(loadAllImages)
                        .done(resolve, function (err) {
                            resolve({
                                tag_values: {},
                                title: err.status + ': ' + err.article.file,
                                file: err.article.file,
                                filename: err.article.filename,
                                base_href: err.article.base_href,
                                error : err
                            });
                        });
                }

                var file_cnt = 0;
                for (var i in files) {
                    if (files[i] && file_cnt < config.max_articles) {
                        file_cnt++;
                        var file = files[i].name,
                            base_href = files[i].base_href;
                        array.push(when.promise(loadAllArticles));
                    }
                }
                when.all(array)
                    .then(function (artlist) {
                        artlist = local_util.sortByKey(artlist, 'published', '1900-01-01');
                        resolve(artlist);
                    })
                    .catch(reject);
            });
            walker.on('error', function (err, entry, stat) {
                reject(err);
            });
        });
    }


    function load_article_images (article) {
        return when.promise( function (resolve, reject) {
            if (!_.isObject(article) || !article.hasOwnProperty('images') || !_.isString(config.photo_path)) {
                resolve(article);
            } else {
                var photo_path = path.normalize(config.photo_path + article.images);
                var base_href = article.images;
                logger.log('loadAllImages->photo_path: ', photo_path);
                var walker = walk.walk(photo_path, { followLinks: true });
                var files = [];
                walker.on("file", function (root, stat, next) {
                    if (stat.name.match(/^[^\._]/)) {
                        var re = new RegExp(photo_path, "g");
                        root = root.replace(re, '');
                        stat.filename = path.normalize(root + article_util.getArticleFilename(stat.name));
                        stat.base_href = '/';
                        files.push(stat);
                    }
                    next();
                });
                walker.on('end', function () {
                    var array = [];
                    files = local_util.sortByKey(files, 'mtime');
                    article.image_list = files;
                    for (var i in files) {
                        if (files[i]) {
                            if (!_.isArray(article.img)) {
                                article.img = [];
                            }
                            var image_url = base_href + files[i].filename;
                            image_url = image_url.replace(/^\//, '');
                            article.img.push(image_url);
                        }
                    }
                    resolve(article);
                });
                walker.on('error', function (err, entry, stat) {
                    resolve(article);
                });
            }
        });
    }


    function load_category_list (relative_path) {
        return when.promise( function (resolve, reject) {
            var complete_path = path.normalize(config.content_path + relative_path);
            logger.log('load_categories->root: ', complete_path);
            var walker = walk.walk(complete_path, { followLinks: true });
            var catlist = [];
            walker.on("directories", function (root, dirStatsArray, next) {
                for (var i in dirStatsArray) {
                    if (dirStatsArray[i]) {
                        var dir = dirStatsArray[i];
                        if (dir.name.match(/^[^\.]/)) {
                            catlist.push(dir);
                        }
                    }
                }
                next();
            });
            walker.on('end', function () {
                resolve(catlist);
            });
            walker.on('error', function (err, entry, stat) {
                reject(err);
            });
        });
    }


    return {
        load: function (opt) {
            return when.promise(function (resolve, reject) {
                when(load_file(opt))
                    .done(resolve, reject);
            });
        },

        list_articles: function (relative_path) {
            return when.promise(function (resolve, reject) {
                when(list_files(relative_path))
                    .done(function (artlist) {
                        resolve(artlist);
                    }, reject);
            });
        },

        list_categories: function (relative_path) {
            return when.promise(function (resolve, reject) {
                when(load_category_list(relative_path))
                    .done(resolve, reject);
            });
        },

        list_images: function (article) {
            return when.promise(function (resolve, reject) {
                when(load_article_images(article))
                    .done(resolve, reject);
            });
        }




    };
};

module.exports = Markdown;
