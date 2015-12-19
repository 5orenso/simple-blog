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

function Category(options, mockServices) {
    this.opts = options || {};
    var logger = this.opts.logger;
    mockServices = mockServices || {};

    var currentAdapter = 'markdown';
    if (_.isObject(this.opts.config.adapter) && _.isString(this.opts.config.adapter.current)) {
        currentAdapter = this.opts.config.adapter.current;
    }

    this.adapter = require(appPath + 'lib/adapter/' + currentAdapter)({
        config: this.opts.config,
        logger: logger
    }, mockServices);

    // Add timer hooks to the functions you want to measure.
    var adapterFunctionToTime = ['listCategories'];
    var funcName;
    for (var j = 0; j <  adapterFunctionToTime.length; j++) {
        funcName = adapterFunctionToTime[j];
        this.adapter[funcName] = metrics.hook(this.adapter[funcName],
            'simpleblog.category.' + currentAdapter + '.' + funcName);
    }
}

Category.prototype.list = function list(rootCategoryPath) {
    var adapter = this.adapter;
    return when.promise(function (resolve, reject) {
        when(adapter.listCategories(rootCategoryPath))
            .done(function (catlist) {
                resolve(catlist);
            }, function (err) {
                reject({ error: err });
            });
    });
};

module.exports = Category;
