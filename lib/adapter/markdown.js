/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const when = require('when');
const _ = require('underscore');
const fs = require('fs');
const path = require('path');
const walk = require('walk');
const ArticleUtil = require('../article-util');
const LocalUtil = require('../local-util');

const articleUtil = new ArticleUtil();
const localUtil = new LocalUtil();

const Markdown = function Markdown(options) {
    const opts = options || {};
    const logger = opts.logger;

    let config = {};
    if (_.isObject(opts.config) && _.isObject(opts.config.adapter)) {
        config = opts.config.adapter.markdown;
    }

    function checkIfArticleExists(filename, artlist) {
        // Should this function return the first article in the list
        // if the input does not exist inside the list?
        const baseFilename = filename.replace(/^(.+\/)/, '');
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
        return when.promise((resolve, reject) => {
            const requestUrl = opt.requestUrl;
            const fileBase = articleUtil.getArticleFilename(requestUrl);
            let file = fileBase;
            const filePath = articleUtil.getArticlePathRelative(requestUrl);
            if (!file.match(/\.md$/)) {
                file += '.md';
            }
            const filename = checkIfArticleExists(path.normalize(config.contentPath + filePath + file), opt.artlist);
            fs.readFile(filename, { encoding: 'utf8' }, (err, data) => {
                const article = articleUtil.populateArticleSections(data);
                article.data = data;
                article.file = fileBase;
                article.filename = path.normalize(filename);
                article.baseHref = articleUtil.getArticlePathRelative(article.filename, config.contentPath);
                if (err) {
                    reject({ status: 404, article });
                } else {
                    resolve(article);
                }
            });
        });
    }

    function listFiles(relativePath) {
        return when.promise((resolve, reject) => {
            logger.log('load_article_list->relativePath: ', relativePath);
            const selectedContentFolder = path.normalize(config.contentPath + relativePath);
            const walker = walk.walk(selectedContentFolder, { followLinks: true });
            let files = [];
            walker.on('file', ($root, $stat, next) => {
                let root = $root;
                const stat = $stat;
                if (stat.name.match(/^[^._]/) && stat.name.match(/\.md$/)) {
                    stat.baseHref = articleUtil.getArticlePathRelative(`${root}/${stat.name}`, config.contentPath);
                    const re = new RegExp(config.contentPath, 'g');
                    root = root.replace(re, '');
                    stat.name = stat.name.replace(/\.md$/, '');
                    stat.filename = path.normalize(`${root}/${stat.name}`);
                    files.push(stat);
                }
                next();
            });
            walker.on('end', () => {
                const array = [];
                let file;
                let baseHref;
                files = localUtil.sortByKey(files, 'mtime');

                function loadAllArticles(resolveAll) {
                    when(loadFile({
                        requestUrl: baseHref + file,
                    }))
                        .done(resolveAll, (err) => {
                            resolve({
                                tagValues: {},
                                title: `${err.status}: ${err.article.file}`,
                                file: err.article.file,
                                filename: err.article.filename,
                                baseHref: err.article.baseHref,
                                error: err,
                            });
                        });
                }

                let fileCnt = 0;
                for (let i = 0, l = files.length; i < l; i += 1) {
                    if (files[i] && fileCnt < config.maxArticles) {
                        fileCnt += 1;
                        file = files[i].name;
                        baseHref = files[i].baseHref;
                        array.push(when.promise(loadAllArticles));
                    }
                }
                when.all(array)
                    .then(($artlist) => {
                        const artlist = localUtil.sortByKey($artlist, 'published', '1900-01-01');
                        resolve(artlist);
                    })
                    .catch(reject);
            });
            walker.on('error', (err) => {
                reject(err);
            });
        });
    }

    function loadArticleImages($article) {
        const article = $article;
        return when.promise((resolve) => {
            if (!_.isObject(article) || !article.hasOwnProperty('images') || !_.isString(config.photoPath)) {
                resolve(article);
            } else {
                const photoPath = path.normalize(config.photoPath + article.images);
                const baseHref = article.images;
                logger.log('loadAllImages->photoPath: ', photoPath);
                const walker = walk.walk(photoPath, { followLinks: true });
                let files = [];
                walker.on('file', ($root, $stat, next) => {
                    let root = $root;
                    const stat = $stat;
                    if (stat.name.match(/^[^._]/)) {
                        const re = new RegExp(photoPath, 'g');
                        root = root.replace(re, '');
                        stat.filename = path.normalize(root + articleUtil.getArticleFilename(stat.name));
                        stat.baseHref = '/';
                        files.push(stat);
                    }
                    next();
                });
                walker.on('end', () => {
                    files = localUtil.sortByKey(files, 'mtime');
                    article.imageList = files;
                    for (let i = 0, l = files.length; i < l; i += 1) {
                        if (files[i]) {
                            if (!_.isArray(article.img)) {
                                article.img = [];
                            }
                            let imageUrl = baseHref + files[i].filename;
                            imageUrl = imageUrl.replace(/^\//, '');
                            article.img.push(imageUrl);
                        }
                    }
                    resolve(article);
                });
                walker.on('error', () => {
                    resolve(article);
                });
            }
        });
    }

    function loadCategoryList(relativePath) {
        return when.promise((resolve, reject) => {
            const completePath = path.normalize(config.contentPath + relativePath);
            logger.log('load_categories->root: ', completePath);
            const walker = walk.walk(completePath, { followLinks: true });
            const catlist = [];
            walker.on('directories', (root, dirStatsArray, next) => {
                for (let i = 0, l = dirStatsArray.length; i < l; i += 1) {
                    if (dirStatsArray[i]) {
                        const dir = dirStatsArray[i];
                        if (dir.name.match(/^[^._]/)) {
                            catlist.push(dir);
                        }
                    }
                }
                next();
            });
            walker.on('end', () => {
                resolve(catlist);
            });
            walker.on('error', (err) => {
                reject(err);
            });
        });
    }

    return {
        load(opt) {
            return when.promise((resolve, reject) => {
                when(loadFile(opt))
                    .done(resolve, reject);
            });
        },

        listArticles(relativePath) {
            return when.promise((resolve, reject) => {
                when(listFiles(relativePath))
                    .done((artlist) => {
                        resolve(artlist);
                    }, reject);
            });
        },

        listCategories(relativePath) {
            return when.promise((resolve, reject) => {
                when(loadCategoryList(relativePath))
                    .done(resolve, reject);
            });
        },

        listImages(article) {
            return when.promise((resolve, reject) => {
                when(loadArticleImages(article))
                    .done(resolve, reject);
            });
        },

    };
};

module.exports = Markdown;
