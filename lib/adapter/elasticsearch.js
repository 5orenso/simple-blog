/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when          = require('when'),
    _             = require('underscore'),
    path          = require('path'),
    elasticsearch = require('elasticsearch'),
    util          = require('util'),
    app_path      = __dirname + '/../../',
    article_util  = require(app_path + 'lib/article-util')(),
    local_util    = require(app_path + 'lib/local-util')();

var client;

var Elasticsearch = function (options, mock_services) {
    var opts = options || {};
    var logger = opts.logger;
    mock_services = mock_services || {};

    var config = {};
    if (_.isObject(opts.config) && _.isObject(opts.config.adapter)) {
        config = opts.config.adapter.elasticsearch;
    }
    elasticsearch = mock_services.elasticsearch || elasticsearch;

    client = new elasticsearch.Client({
        host: config.server + ':' + config.port,
        //log: 'trace'
    });

    function ping () {
        return when.promise(function (resolve, reject) {
            client.ping({
                requestTimeout: 1000,
                // undocumented params are appended to the query string
                hello: "elasticsearch!"
            }, function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve('all is well');
                }
            });

        });
    }


    function find (query, values) {
        return when.promise(function (resolve, reject) {
            client.search({
                index: config.index,
                type: config.type,
                size: 50,
                body: {
                    query: {
                        match: query
                    }
                }
            }).then(function (resp) {
                var hits = resp.hits.hits;
                resolve(hits);
            }, function (err) {
                reject(err);
            });

        });
    }


    function index_single (obj) {
        return when.promise(function (resolve, reject) {
            resolve();
            client.index({
                index: config.index,
                type: config.type,
                id: obj.base_href + obj.file,
                body: obj
            }, function (error, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }



    return {
        query: function (query, filter) {
            return when.promise(function (resolve, reject) {
                when(find(query, filter))
                    .done(resolve, reject);
            });
        },
        ping: function (query, filter) {
            return when.promise(function (resolve, reject) {
                when(ping())
                    .done(resolve, reject);
            });
        },
        index: function (obj) {
            return when.promise(function (resolve, reject) {
                when(index_single(obj))
                    .done(resolve, reject);
            });
        },


//        load: function (opt) {
//            return when.promise(function (resolve, reject) {
//                when(load_article(opt))
//                    .done(resolve, reject);
//            });
//        },
//
//        list_articles: function (relative_path) {
//            return when.promise(function (resolve, reject) {
//                when(list_articles(relative_path))
//                    .done(function (artlist) {
//                        resolve(artlist);
//                    }, reject);
//            });
//        },
//
//        list_categories: function (relative_path) {
//            return when.promise(function (resolve, reject) {
//                when(list_categories(relative_path))
//                    .done(resolve, reject);
////                resolve({});
//            });
//        },
////
//        list_images: function (article) {
//            return when.promise(function (resolve, reject) {
////                when(load_article_images(article))
////                    .done(resolve, reject);
//                resolve(article);
//            });
//        },
//
//        get_column_names : get_column_names,


    };
};

module.exports = Elasticsearch;