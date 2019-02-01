/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const _ = require('underscore');
const elasticsearch = require('elasticsearch');
const LocalUtil = require('../local-util');

const localUtil = new LocalUtil();

let client;

const Elasticsearch = function Elasticsearch(options) {
    const opts = options || {};

    let config = {};
    if (_.isObject(opts.config)
        && _.isObject(opts.config.adapter)
        && _.isObject(opts.config.adapter.elasticsearch)) {
        config = opts.config.adapter.elasticsearch;
    }
    if (!config.server || !config.port) {
        throw new Error(`${'Missing config.adapter.elasticsearch.server and/or config.adapter.elasticsearch.port '
            + 'while trying to init "'}${__filename}" module!`);
    }

    client = new elasticsearch.Client({
        host: `${config.server}:${config.port}`,
        // log: 'trace'
    });

    function close() {
        client.close();
    }

    function ping() {
        return new Promise((resolve, reject) => {
            client.ping({
                requestTimeout: 1000,
                // undocumented params are appended to the query string
            }, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve('all is well');
                }
            });
        });
    }

    function find(query) {
        return new Promise((resolve, reject) => {
            client.search({
                index: config.index,
                type: config.type,
                size: 50,
                body: {
                    // jscs:disable
                    query: {
                        multi_match: {
                            // type: 'most_fields',
                            type: (config.multiMatchType || 'most_fields'),
                            tie_breaker: (config.multiMatchTieBreaker || 0.3),
                            query,
                            fields: [
                                'title*^10', 'title*.language^10',
                                'teaser*^5', 'teaser*.language^5',
                                'ingress*^5', 'ingress*.languag^5',
                                'body*^2', 'body*.language^2',
                                'col*^2', 'col*.language^2',
                                'footnote*', 'footnote*.language',
                                'tag*^15',
                            ],
                        },
                    },
                    // jscs:enable
                },
            }).then((resp) => {
                const hits = resp.hits.hits;
                // console.log(resp);

                const total = resp.hits.total;
                // jscs:disable
                const maxScore = resp.hits.max_score;
                // jscs:enable
                const timeMs = resp.took;
                // console.log('lib/adapter/elasticsearch->hits: ', hits);
                const results = {
                    meta: {
                        total,
                        maxScore,
                        timeMs,
                    },
                    hits: [],
                };
                for (let i = 0, l = hits.length; i < l; i += 1) {
                    if (hits[i]) {
                        // eslint-disable-next-line
                        if (_.isObject(hits[i]._source)) {
                            // eslint-disable-next-line
                            results.hits.push(hits[i]._source);
                        }
                    }
                }
                // console.log(results);
                resolve(results);
            }, (err) => {
                reject(err);
            });
        });
    }

    function indexSingle($obj) {
        const obj = $obj;
        return new Promise((resolve, reject) => {
            if (_.isObject(obj) && !_.isEmpty(obj.baseHref)) {
                obj.published = localUtil.isoDate(new Date(obj.published).getTime());
                client.index({
                    index: config.index,
                    type: config.type,
                    id: obj.baseHref + obj.file,
                    body: obj,
                }, (error, response) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(response);
                    }
                });
            } else {
                const reason = [];
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
                reject(new Error(`Error in input: ${reason.join(', ')} is missing.`));
            }
        });
    }

    return {
        query(query, filter) {
            return find(query, filter);
        },
        ping() {
            return ping();
        },
        index(obj) {
            return indexSingle(obj);
        },
        close() {
            close();
        },

    };
};

module.exports = Elasticsearch;
