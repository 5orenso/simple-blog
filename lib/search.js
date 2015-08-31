/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when         = require('when'),
    _            = require('underscore'),
    appPath      = __dirname + '/../';

var Search = function (options, mockServices) {
    var opts = options || {};
    var logger = opts.logger;
    mockServices = mockServices || {};
    var lu    = require(appPath + 'lib/local-util')(opts);

    var currentAdapter = 'elasticsearch';
    if (_.isObject(opts.config.searchAdapter) && _.isString(opts.config.searchAdapter.current)) {
        currentAdapter = opts.config.adapter.current;
    }

    var adapter = require(appPath + 'lib/adapter/' + currentAdapter)({
        config: opts.config,
        logger: logger
    }, mockServices[currentAdapter]);

    return {
        query: function (query, filter) {
            return when.promise(function (resolve, reject) {
                lu.timersReset();
                lu.timer(currentAdapter + '.query');
                when(adapter.query(query, filter))
                    .done(function (result) {
                        lu.timer(currentAdapter + '.query');
                        lu.sendUdp({ timers: lu.timersGet() });
                        resolve(result);
                    }, function (err) {
                        lu.timer(currentAdapter + '.query');
                        lu.sendUdp({ timers: lu.timersGet() });
                        reject({ error: err });
                    });
            });
        },
        index: function (obj, closeConnection) {
            return when.promise(function (resolve, reject) {
                lu.timersReset();
                lu.timer(currentAdapter + '.index');
                when(adapter.index(obj))
                    .done(function (result) {
                        var myCloseConnection = closeConnection;
                        lu.timer(currentAdapter + '.index');
                        lu.sendUdp({ timers: lu.timersGet() });
                        if (myCloseConnection) {
                            adapter.close();
                        }
                        resolve(result);
                    }, function (err) {
                        lu.timer(currentAdapter + '.index');
                        lu.sendUdp({ timers: lu.timersGet() });
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
