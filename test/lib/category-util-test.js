'use strict';

var buster       = require('buster'),
    assert       = buster.assert,
    refute       = buster.refute,
    category_util = require('../../lib/category-util')({
        logger: {
            log: function () { },
            err: function () { }
        },
    });

var catlist = [
    {
        dev: 16777219,
        mode: 16877,
        nlink: 3,
        uid: 501,
        gid: 20,
        rdev: 0,
        blksize: 4096,
        ino: 37773547,
        size: 102,
        blocks: 0,
        atime: 'Thu Sep 18 2014 22:26:54 GMT+0200 (CEST)',
        mtime: 'Thu Sep 18 2014 22:03:41 GMT+0200 (CEST)',
        ctime: 'Thu Sep 18 2014 22:03:41 GMT+0200 (CEST)',
        name: 'simple-blog',
        type: 'directory'
    }
];
var article = {
    tag_values: {
        toc: '',
        fact: '',
        artlist: '',
        menu: '',
        menu_onepage: '',
    },
    title: 'Simple Blog Server',
    file: 'index',
    filename: '',
    tag: [],
    body: '',
};

var article_result = {
    tag_values: {
        menu: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="/simple-blog/">simple-blog</a></li></ul>',
        menu_onepage: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="#simple-blog">simple-blog</a></li></ul>'
    },
    catlist: [{ dev: 16777219,
        mode: 16877,
        nlink: 3,
        uid: 501,
        gid: 20,
        rdev: 0,
        blksize: 4096,
        ino: 37773547,
        size: 102,
        blocks: 0,
        atime: 'Thu Sep 18 2014 22:26:54 GMT+0200 (CEST)',
        mtime: 'Thu Sep 18 2014 22:03:41 GMT+0200 (CEST)',
        ctime: 'Thu Sep 18 2014 22:03:41 GMT+0200 (CEST)',
        name: 'simple-blog',
        type: 'directory'
    }]
};

buster.testCase('lib/category-util', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test category-util:': {
        'format_catlist': function () {
            var result = category_util.format_catlist(article, catlist);
            assert.equals(article.tag_values.menu, article_result.tag_values.menu);
            assert.equals(article.tag_values.menu_onepage, article_result.tag_values.menu_onepage);
            assert.equals(article.catlist[0].name, article_result.catlist[0].name);
            assert.equals(article.catlist[0].type, article_result.catlist[0].type);
            refute(result);
        },


    }
});
