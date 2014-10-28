/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when         = require('when'),
    _            = require('underscore'),
    fs           = require('fs'),
    path         = require('path'),
    walk         = require('walk'),
    app_path     = __dirname + '/../';

var Category = function (options, mock_services) {
    var opts = options || {};
    var logger = opts.logger;
    mock_services = mock_services || {};

    var adapter = require(app_path + 'lib/adapter/markdown')({
        config: opts.config,
        logger: logger
    });

    return {
        list: function (root_category_path) {
            return when.promise( function (resolve, reject) {
                when(adapter.list_categories(root_category_path))
                    .done(resolve, function (err) {
                        reject({ error: err });
                    });
            });
        }

    };
};

module.exports = Category;
