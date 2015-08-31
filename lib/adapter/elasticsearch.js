/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when          = require('when'),
    _             = require('underscore'),
    elasticsearch = require('elasticsearch');

var client;

var Elasticsearch = function (options, mockServices) {
    var opts = options || {};
    // var logger = opts.logger;
    mockServices = mockServices || {};

    var config = {};
    if (_.isObject(opts.config) && _.isObject(opts.config.adapter) && _.isObject(opts.config.adapter.elasticsearch)) {
        config = opts.config.adapter.elasticsearch;
    }
    if (!config.server || !config.port) {
        throw new Error('Missing config.adapter.elasticsearch.server and/or config.adapter.elasticsearch.port ' +
            'while trying to init "' + __filename + '" module!');
    }

    elasticsearch = mockServices.elasticsearch || elasticsearch;

    client = new elasticsearch.Client({
        host: config.server + ':' + config.port
        //log: 'trace'
    });

    function close() {
        client.close();
    }

    function ping() {
        return when.promise(function (resolve, reject) {
            client.ping({
                requestTimeout: 1000,
                // undocumented params are appended to the query string
                hello: 'elasticsearch!'
            }, function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve('all is well');
                }
            });

        });
    }

    function find(query) {
        return when.promise(function (resolve, reject) {
            client.search({
                index: config.index,
                type: config.type,
                size: 50,
                body: {
                    // jscs:disable
                    query: {
                        multi_match: {
                            //type: 'most_fields',
                            "type": 'best_fields',
                            "tie_breaker": 0.3,
                            query: query,
                            fields: [
                                'title*', 'title.language',
                                'teaser*', 'teaser.language',
                                'ingress*', 'ingress.language',
                                'body*', 'body.language',
                                'col*', 'col.language',
                                'footnote*', 'footnote.language'
                            ]
                        }
                    }
                    // jscs:enable
                }
            }).then(function (resp) {
                var hits = resp.hits.hits;
                //console.log('lib/adapter/elasticsearch->hits: ', hits);
                var results = [];
                for (var i = 0; i < hits.length; i++) {
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

    function indexSingle(obj) {
        return when.promise(function (resolve, reject) {
            if (_.isObject(obj) && !_.isEmpty(obj.baseHref)) {
                client.index({
                    index: config.index,
                    type: config.type,
                    id: obj.baseHref + obj.file,
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
                    if (_.isEmpty(obj.baseHref)) {
                        reason.push('obj.baseHref');
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
                when(indexSingle(obj))
                    .done(resolve, reject);
            });
        },
        close: function () {
            close();
        }

    };
};

module.exports = Elasticsearch;
