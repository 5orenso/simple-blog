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

var Category = function (options, mockServices) {
    var opts = options || {};
    var logger = opts.logger;
    mockServices = mockServices || {};

    var currentAdapter = 'markdown';
    if (_.isObject(opts.config.adapter) && _.isString(opts.config.adapter.current)) {
        currentAdapter = opts.config.adapter.current;
    }

    var adapter = require(appPath + 'lib/adapter/' + currentAdapter)({
        config: opts.config,
        logger: logger
    }, mockServices);

    // Add timer hooks to the functions you want to measure.
    var adapterFunctionToTime = ['listCategories'];
    var funcName;
    for (var j = 0; j <  adapterFunctionToTime.length; j++) {
        funcName = adapterFunctionToTime[j];
        adapter[funcName] = metrics.hook(adapter[funcName],
            'simpleblog.category.' + currentAdapter + '.' + funcName);
    }

    return {
        list: function (rootCategoryPath) {
            return when.promise(function (resolve, reject) {
                when(adapter.listCategories(rootCategoryPath))
                    .done(function (catlist) {
                        resolve(catlist);
                    }, function (err) {
                        reject({ error: err });
                    });
            });
        }

    };
};

module.exports = Category;
