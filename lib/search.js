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

function Search(options) {
    this.opts = options || {};
    this.logger = this.opts.logger;
    this.currentAdapter = 'elasticsearch';
    if (_.isObject(this.opts.config.searchAdapter) && _.isString(this.opts.config.searchAdapter.current)) {
        this.currentAdapter = this.opts.config.adapter.current;
    }

    this.adapter = require(appPath + 'lib/adapter/' + this.currentAdapter)({
        config: this.opts.config,
        logger: this.logger
    });
    // Add timer hooks to the functions you want to measure.
    var adapterFunctionToTime = ['query', 'ping', 'index', 'close'];
    var funcName;
    for (var j = 0; j <  adapterFunctionToTime.length; j++) {
        funcName = adapterFunctionToTime[j];
        this.adapter[funcName] = metrics.hook(this.adapter[funcName],
            'simpleblog.search.' + this.currentAdapter + '.' + funcName);
    }
}

Search.prototype.query = function query(inputQuery, filter) {
    var adapter = this.adapter;
    return when.promise(function (resolve, reject) {
        when(adapter.query(inputQuery, filter))
            .done(function (result) {
                resolve(result);
            }, function (err) {
                reject({ error: err });
            });
    });
};

Search.prototype.index = function index(obj, closeConnection) {
    var adapter = this.adapter;
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
};

Search.prototype.indexArtlist = function indexArtlist(artlist, closeConnection) {
    var adapter = this.adapter;
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
};

module.exports = Search;
