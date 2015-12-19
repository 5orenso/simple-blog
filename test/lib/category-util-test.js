'use strict';

var buster       = require('buster'),
    assert       = buster.assert,
    refute       = buster.refute,
    CategoryUtil = require('../../lib/category-util'),
    categoryUtil = new CategoryUtil({
        logger: {
            log: function () { },
            err: function () { }
        }
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
    tagValues: {
        toc: '',
        fact: '',
        artlist: '',
        menu: '',
        menuOnepage: ''
    },
    title: 'Simple Blog Server',
    file: 'index',
    filename: '',
    tag: [],
    body: ''
};

var articleResult = {
    tagValues: {
        menu: '<ul class="catlist"><li><a href="/">Frontpage</a></li>' +
            '<li><a href="/simple-blog/">simple-blog</a></li></ul>',
        menuOnepage: '<ul class="catlist"><li><a href="/">Frontpage</a></li>' +
            '<li><a href="#simple-blog">simple-blog</a></li></ul>'
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
        'formatCatlist test': function () {
            var result = categoryUtil.formatCatlist(article, catlist);
            assert.equals(article.tagValues.menu, articleResult.tagValues.menu);
            assert.equals(article.tagValues.menuOnepage, articleResult.tagValues.menuOnepage);
            assert.equals(article.catlist[0].name, articleResult.catlist[0].name);
            assert.equals(article.catlist[0].type, articleResult.catlist[0].type);
            refute(result);
        }
    }
});
