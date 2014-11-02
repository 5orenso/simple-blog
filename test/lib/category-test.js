'use strict';

var buster       = require('buster'),
    assert       = buster.assert,
    refute       = buster.refute,
    when         = require('when'),
    category     = require('../../lib/category')({
        logger: {
            log: function () { },
            err: function () { }
        },
        config: {
            adapter: {
                current: 'markdown',
                markdown: {
                    content_path: __dirname + '/../content/articles/',
                    photo_path: __dirname + '/../content/images/',
                    max_articles: 500,
                }
            }
        }
    });

var catlist = [ { dev: 16777220,
    mode: 16877,
    nlink: 5,
    uid: 501,
    gid: 20,
    rdev: 0,
    blksize: 4096,
    ino: 37773547,
    size: 170,
    blocks: 0,
    atime: 'Sat Oct 25 2014 23:26:33 GMT+0200 (CEST)',
    mtime: 'Fri Oct 24 2014 21:43:27 GMT+0200 (CEST)',
    ctime: 'Fri Oct 24 2014 21:43:27 GMT+0200 (CEST)',
    name: 'simple-blog',
    type: 'directory' } ];

buster.testCase('lib/category', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test category:': {
        'list existing categories': function (done) {
            when(category.list('/'))
                .then(function (obj) {
                    assert.equals(catlist[0].name, obj[0].name);
                    assert.equals(catlist[0].type, obj[0].type);
                    done();
                }).catch(console.log);
        },

        'list non existing categories': function (done) {
            when(category.list('/non-existing-path/'))
                .then(function (obj) {
                    assert.equals([], obj);
                    refute(obj[0]);
                    done();
                }).catch(console.log);
        },

    }
});
