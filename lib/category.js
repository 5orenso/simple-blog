/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when         = require('when'),
    _            = require('underscore'),
    appPath     = __dirname + '/../';

var Category = function (options, mockServices) {
    var opts = options || {};
    var logger = opts.logger;
    mockServices = mockServices || {};

    var lu    = require(appPath + 'lib/local-util')(opts);

    var currentAdapter = 'markdown';
    if (_.isObject(opts.config.adapter) && _.isString(opts.config.adapter.current)) {
        currentAdapter = opts.config.adapter.current;
    }

    var adapter = require(appPath + 'lib/adapter/' + currentAdapter)({
        config: opts.config,
        logger: logger
    }, mockServices);

    return {
        list: function (rootCategoryPath) {
            return when.promise(function (resolve, reject) {
                lu.timersReset();
                lu.timer(currentAdapter + '.listCategories');
                when(adapter.listCategories(rootCategoryPath))
                    .done(function (catlist) {
                        lu.timer(currentAdapter + '.listCategories');
                        lu.sendUdp({ timers: lu.timersGet() });
                        resolve(catlist);
                    }, function (err) {
                        lu.timer(currentAdapter + '.listCategories');
                        lu.sendUdp({ timers: lu.timersGet() });
                        reject({ error: err });
                    });
            });
        }

    };
};

module.exports = Category;
