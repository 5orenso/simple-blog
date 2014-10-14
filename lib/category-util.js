/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when          = require('when'),
    _             = require('underscore'),
    path          = require('path'),
    app_path      = __dirname + '/../',
    content_path  = path.normalize(app_path + 'content/articles/');

var CategoryUtil = function (options, mock_services) {
    var opts = options || {};
    var logger = opts.logger;

    mock_services = mock_services || {};

    return {
        format_catlist: function format_catlist (article, catlist) {
            if (!_.isObject(article.tag_values)) {
                article.tag_values = {};
            }
            article.catlist = catlist;
            article.tag_values.menu = '<ul class="catlist"><li><a href="/">Frontpage</a></li>';
            article.tag_values.menu_onepage = '<ul class="catlist"><li><a href="/">Frontpage</a></li>';
            for (var i in catlist) {
                if (catlist[i]) {
                    var dir = catlist[i];
                    article.tag_values.menu += '<li><a href="/' + dir.name + '/">' + dir.name + '</a></li>';
                    article.tag_values.menu_onepage += '<li><a href="#' + dir.name + '">' + dir.name + '</a></li>';
                }
            }
            article.tag_values.menu += '</ul>';
            article.tag_values.menu_onepage += '</ul>';
        },




    };
};

module.exports = CategoryUtil;
