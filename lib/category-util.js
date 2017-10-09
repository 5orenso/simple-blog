/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var _       = require('underscore');

function CategoryUtil(options) {
    this.opts = options || {};
    this.logger = this.opts.logger;
}

CategoryUtil.prototype.formatCatlist = function formatCatlist(article, catlist) {
    if (!_.isObject(article.tagValues)) {
        article.tagValues = {};
    }
    article.catlist = catlist;
    article.tagValues.menu = '<ul class="catlist"><li><a href="/">Frontpage</a></li>';
    article.tagValues.menuOnepage = '<ul class="catlist"><li><a href="/">Frontpage</a></li>';
    for (var i in catlist) {
        if (catlist[i]) {
            var dir = catlist[i];
            dir.baseHref = '/' + dir.name + '/';
            article.tagValues.menu += '<li><a href="/' + dir.name + '/">' + dir.name + '</a></li>';
            article.tagValues.menuOnepage += '<li><a href="#' + dir.name + '">' + dir.name + '</a></li>';
        }
    }
    article.tagValues.menu += '</ul>';
    article.tagValues.menuOnepage += '</ul>';
};

module.exports = CategoryUtil;
