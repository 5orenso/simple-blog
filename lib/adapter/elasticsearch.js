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
    if (_.isObject(opts.config) && _.isObject(opts.config.adapter) && _.isObject(opts.config.adapter.elasticsearch)) {
        config = opts.config.adapter.elasticsearch;
    }
    if (!config.server || !config.port) {
        throw new Error('Missing config.adapter.elasticsearch.server and/or config.adapter.elasticsearch.port while trying to init "' + __filename + '" module!');
    }

    elasticsearch = mock_services.elasticsearch || elasticsearch;


    client = new elasticsearch.Client({
        host: config.server + ':' + config.port,
        //log: 'trace'
    });

    function close () {
        client.close();
    }


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
                //console.log('lib/adapter/elasticsearch->hits: ', hits);
                var results = [];
                for (var i=0; i<hits.length; i++) {
                    if (hits[i]) {
                        if (_.isObject(hits[i]._source)) {
                            results.push(hits[i]._source);
                        }
                    }
                }
                resolve(results);
            }, function (err) {
                reject(err);
            });

        });
    }


    function index_single (obj) {
        return when.promise(function (resolve, reject) {
            if (_.isObject(obj) && !_.isEmpty(obj.base_href) ) {
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
            } else {
                var reason = [];
                if (_.isObject(config)) {
                    if (_.isEmpty(config.index)) {
                        reason.push('config.index');
                    }
                    if (_.isEmpty(config.type)) {
                        reason.push('config.type');
                    }
                } else {
                    reason.push('config');
                }
                if (_.isObject(obj)) {
                    if (_.isEmpty(obj.base_href)) {
                        reason.push('obj.base_href');
                    }
                    if (_.isEmpty(obj.file)) {
                        reason.push('obj.file');
                    }
                } else {
                    reason.push('obj');
                }
                reject('Error in input: ' + reason.join(', ') + ' is missing.');
            }

        });
    }



    return {
        query: function (query, filter) {
            return when.promise(function (resolve, reject) {
                when(find(query, filter))
                    .done(resolve, reject);
            });
        },
        ping: function () {
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
        close: function () {
            close();
        }

    };
};

module.exports = Elasticsearch;