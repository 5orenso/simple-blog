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
    appPath      = __dirname + '/../../',
    articleUtil  = require(appPath + 'lib/article-util')(),
    localUtil    = require(appPath + 'lib/local-util')();

var Markdown = function (options, mockServices) {
    var opts = options || {};
    var logger = opts.logger;
    mockServices = mockServices || {};

    var config = {};
    if (_.isObject(opts.config) && _.isObject(opts.config.adapter)) {
        config = opts.config.adapter.markdown;
    }

    function checkIfArticleExists(filename, artlist) {
        // Should this function return the first article in the list
        // if the input does not exist inside the list?
        var baseFilename = filename.replace(/^(.+\/)/, '');
        if (baseFilename.match(/^_/)) {
            return filename;
        }
        function articleExists(el) {
            return el.filename === filename;
        }
        if (baseFilename.match(/^index\.(md|html|htm)$/)) {
            if (_.isArray(artlist) && artlist.length > 0) {
                if (!artlist.some(articleExists)) {
                    return artlist[0].filename;
                }
            }
        }
        return filename;
    }

    function loadFile(opt) {
        return when.promise(function (resolve, reject) {
            var requestUrl = opt.requestUrl;
            var fileBase = articleUtil.getArticleFilename(requestUrl);
            var file = fileBase;
            var filePath = articleUtil.getArticlePathRelative(requestUrl);
            if (!file.match(/\.md$/)) {
                file += '.md';
            }
            var filename = checkIfArticleExists(path.normalize(config.contentPath + filePath + file), opt.artlist);
            fs.readFile(filename, { encoding: 'utf8'}, function (err, data) {
                var article = articleUtil.populateArticleSections(data);
                article.file = fileBase;
                article.filename = path.normalize(filename);
                article.baseHref = articleUtil.getArticlePathRelative(article.filename, config.contentPath);
                if (err) {
                    reject({ status: 404, article: article });
                } else {
                    resolve(article);
                }
            });
        });
    }

    function listFiles(relativePath) {
        return when.promise(function (resolve, reject) {
            logger.log('load_article_list->relativePath: ', relativePath);
            var selectedContentFolder = path.normalize(config.contentPath + relativePath);
            var walker = walk.walk(selectedContentFolder, { followLinks: true });
            var files = [];
            walker.on('file', function (root, stat, next) {
                if (stat.name.match(/^[^\._]/)) {
                    stat.baseHref = articleUtil.getArticlePathRelative(root + '/' + stat.name, config.contentPath);
                    var re = new RegExp(config.contentPath, 'g');
                    root = root.replace(re, '');
                    stat.name = stat.name.replace(/\.md$/, '');
                    stat.filename = path.normalize(root + '/' + stat.name);
                    files.push(stat);
                }
                next();
            });
            walker.on('end', function () {
                var array = [];
                files = localUtil.sortByKey(files, 'mtime');

                function loadAllArticles(resolve) {
                    when(loadFile({
                        requestUrl: baseHref + file
                    }))
//                       .then(loadAllImages)
                        .done(resolve, function (err) {
                            resolve({
                                tagValues: {},
                                title: err.status + ': ' + err.article.file,
                                file: err.article.file,
                                filename: err.article.filename,
                                baseHref: err.article.baseHref,
                                error: err
                            });
                        });
                }

                var fileCnt = 0;
                for (var i in files) {
                    if (files[i] && fileCnt < config.maxArticles) {
                        fileCnt++;
                        var file = files[i].name,
                            baseHref = files[i].baseHref;
                        array.push(when.promise(loadAllArticles));
                    }
                }
                when.all(array)
                    .then(function (artlist) {
                        artlist = localUtil.sortByKey(artlist, 'published', '1900-01-01');
                        resolve(artlist);
                    })
                    .catch(reject);
            });
            walker.on('error', function (err) {
                reject(err);
            });
        });
    }

    function loadArticleImages(article) {
        return when.promise(function (resolve) {
            if (!_.isObject(article) || !article.hasOwnProperty('images') || !_.isString(config.photoPath)) {
                resolve(article);
            } else {
                var photoPath = path.normalize(config.photoPath + article.images);
                var baseHref = article.images;
                logger.log('loadAllImages->photoPath: ', photoPath);
                var walker = walk.walk(photoPath, { followLinks: true });
                var files = [];
                walker.on('file', function (root, stat, next) {
                    if (stat.name.match(/^[^\._]/)) {
                        var re = new RegExp(photoPath, 'g');
                        root = root.replace(re, '');
                        stat.filename = path.normalize(root + articleUtil.getArticleFilename(stat.name));
                        stat.baseHref = '/';
                        files.push(stat);
                    }
                    next();
                });
                walker.on('end', function () {
                    files = localUtil.sortByKey(files, 'mtime');
                    article.imageList = files;
                    for (var i in files) {
                        if (files[i]) {
                            if (!_.isArray(article.img)) {
                                article.img = [];
                            }
                            var imageUrl = baseHref + files[i].filename;
                            imageUrl = imageUrl.replace(/^\//, '');
                            article.img.push(imageUrl);
                        }
                    }
                    resolve(article);
                });
                walker.on('error', function () {
                    resolve(article);
                });
            }
        });
    }

    function loadCategoryList(relativePath) {
        return when.promise(function (resolve, reject) {
            var completePath = path.normalize(config.contentPath + relativePath);
            logger.log('load_categories->root: ', completePath);
            var walker = walk.walk(completePath, { followLinks: true });
            var catlist = [];
            walker.on('directories', function (root, dirStatsArray, next) {
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
            walker.on('error', function (err) {
                reject(err);
            });
        });
    }

    return {
        load: function (opt) {
            return when.promise(function (resolve, reject) {
                when(loadFile(opt))
                    .done(resolve, reject);
            });
        },

        listArticles: function (relativePath) {
            return when.promise(function (resolve, reject) {
                when(listFiles(relativePath))
                    .done(function (artlist) {
                        resolve(artlist);
                    }, reject);
            });
        },

        listCategories: function (relativePath) {
            return when.promise(function (resolve, reject) {
                when(loadCategoryList(relativePath))
                    .done(resolve, reject);
            });
        },

        listImages: function (article) {
            return when.promise(function (resolve, reject) {
                when(loadArticleImages(article))
                    .done(resolve, reject);
            });
        }

    };
};

module.exports = Markdown;
