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


var LocalUtil = function (options, mock_services) {
    var opts = options || {};
    var logger = opts.logger;
    mock_services = mock_services || {};

    return {
        sortByKey: function sortByKey(array, key, noValue) {
            return array.sort(function(a, b) {
                var x = a[key] || noValue;
                var y = b[key] || noValue;
                return ((x < y) ? 1 : ((x > y) ? -1 : 0));
            });
        },


        quote_url: function quote_url (url) {
            if (_.isString(url)) {
                url = url.replace(/(\&)/g, '&amp;');
                url = url.replace(/\s/g, '%20');
                return url;
            } else {
                return '';
            }
        },



    };
};

module.exports = LocalUtil;
