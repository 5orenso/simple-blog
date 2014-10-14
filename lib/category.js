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


    function load_category_list (root, callback) {
        logger.log('load_cateogries->root: ', root);
        var walker  = walk.walk(root, { followLinks: true });
        var catlist = [];
        walker.on("directories", function (root, dirStatsArray, next) {
            for (var i in dirStatsArray) {
                if (dirStatsArray[i]) {
                    var dir = dirStatsArray[i];
                    if (dir.name.match(/^[^\.]/)) {
                        catlist.push(dir);
                    }
                }
            }
            next();
        });
        walker.on('end', function () {
            callback(null, catlist);
        });
        walker.on('error', function (err, entry, stat) {
            callback(err);
        });
    }

    return {
        list: function () {
            return when.promise( function (resolve, reject) {
                var content_path = opts.content_path;
                load_category_list(content_path, function (err, catlist) {
                    if (err) { reject({ error: err }); }
                    resolve(catlist);
                });
            });
        }

    };
};

module.exports = Category;
