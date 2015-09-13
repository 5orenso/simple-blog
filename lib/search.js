/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when      = require('when'),
    _         = require('underscore'),
    appPath   = __dirname + '/../',
    Metrics   = require(appPath + 'lib/metrics'),
    metrics   = new Metrics({
        useDataDog: true
    });

var Search = function (options, mockServices) {
    var opts = options || {};
    var logger = opts.logger;
    mockServices = mockServices || {};

    var currentAdapter = 'elasticsearch';
    if (_.isObject(opts.config.searchAdapter) && _.isString(opts.config.searchAdapter.current)) {
        currentAdapter = opts.config.adapter.current;
    }

    var adapter = require(appPath + 'lib/adapter/' + currentAdapter)({
        config: opts.config,
        logger: logger
    }, mockServices[currentAdapter]);
    // Add timer hooks to the functions you want to measure.
    var adapterFunctionToTime = ['query', 'ping', 'index', 'close'];
    var funcName;
    for (var j = 0; j <  adapterFunctionToTime.length; j++) {
        funcName = adapterFunctionToTime[j];
        adapter[funcName] = metrics.hook(adapter[funcName],
            'simpleblog.search.' + currentAdapter + '.' + funcName);
    }

    return {
        query: function (query, filter) {
            return when.promise(function (resolve, reject) {
                when(adapter.query(query, filter))
                    .done(function (result) {
                        resolve(result);
                    }, function (err) {
                        reject({ error: err });
                    });
            });
        },
        index: function (obj, closeConnection) {
            return when.promise(function (resolve, reject) {
                when(adapter.index(obj))
                    .done(function (result) {
                        var myCloseConnection = closeConnection;
                        if (myCloseConnection) {
                            adapter.close();
                        }
                        resolve(result);
                    }, function (err) {
                        reject({ error: err });
                    });
            });
        },
        indexArtlist: function (artlist, closeConnection) {
            return when.promise(function (resolve, reject) {
                when.map(artlist, function (value) {
                    return adapter.index(value);
                })
                    .done(function (results) {
                        var myCloseConnection = closeConnection;
                        if (myCloseConnection) {
                            adapter.close();
                        }
                        resolve(results);
                    }, reject);
            });
        }

    };
};

module.exports = Search;
