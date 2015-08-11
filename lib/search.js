/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when         = require('when'),
    _            = require('underscore'),
    app_path     = __dirname + '/../';

var Search = function (options, mock_services) {
    var opts = options || {};
    var logger = opts.logger;
    mock_services = mock_services || {};

    var lu    = require(app_path + 'lib/local-util')(opts);

    var current_adapter = 'elasticsearch';
    if (_.isObject(opts.config.search_adapter) && _.isString(opts.config.search_adapter.current)) {
        current_adapter = opts.config.adapter.current;
    }

    var adapter = require(app_path + 'lib/adapter/' + current_adapter)({
        config: opts.config,
        logger: logger
    }, mock_services[current_adapter]);

    return {
        query: function (query, filter) {
            return when.promise( function (resolve, reject) {
                lu.timers_reset();
                lu.timer(current_adapter + '.query');
                when(adapter.query(query, filter))
                    .done(function (result) {
                        lu.timer(current_adapter + '.query');
                        lu.send_udp({ timers: lu.timers_get() });
                        resolve(result);
                    }, function (err) {
                        lu.timer(current_adapter + '.query');
                        lu.send_udp({ timers: lu.timers_get() });
                        reject({ error: err });
                    });
            });
        },
        index: function (obj, close_connection) {
            return when.promise( function (resolve, reject) {
                lu.timers_reset();
                lu.timer(current_adapter + '.index');
                when(adapter.index(obj))
                    .done(function (result) {
                        var _close_connection = close_connection;
                        lu.timer(current_adapter + '.index');
                        lu.send_udp({ timers: lu.timers_get() });
                        if (_close_connection) {
                            adapter.close();
                        }
                        resolve(result);
                    }, function (err) {
                        lu.timer(current_adapter + '.index');
                        lu.send_udp({ timers: lu.timers_get() });
                        reject({ error: err });
                    });
            });
        },
        index_artlist: function (artlist, close_connection) {
            return when.promise( function (resolve, reject) {
                when.map(artlist, function (value) {
                    return adapter.index(value);
                })
                    .done(function (results) {
                        var _close_connection = close_connection;
                        if (_close_connection) {
                            adapter.close();
                        }
                        resolve(results);
                    }, reject);
            });
        }

    };
};

module.exports = Search;
