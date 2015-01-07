'use strict';

var buster = require('buster'),
    assert = buster.assert,
    refute = buster.refute,
    when   = require('when'),
    config = require(__dirname + '/../../config/config-integration.js'),
    search = require(__dirname + '/../../lib/search')({
        logger: {
            log: function () {
            },
            err: function () {
            },
        },
        config: config
    }, config.adapter.mock_services);

var article = {
    tag_values: { toc: '', fact: '', artlist: '' },
    published: '2014-01-01',
    title: 'Simple blog 2',
    img: [ 'simple-blog.jpg' ],
    body: 'This is content number 2.',
    file: 'index',
    filename: 'my-path-to-the-files/content/articles/simple-blog/simple-blog.md',
    base_href: '/simple-blog/'
};

buster.testCase('lib/search', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test search:': {
        'query': function (done) {
            when( search.query('one-hit') )
                .done(function (obj) {
                    assert.isArray(obj);
                    assert.equals(obj[0].title, article.title);
                    assert.equals(obj[0].published, article.published);
                    assert.equals(obj[0].img, article.img);
                    assert.equals(obj[0].body, article.body);
                    assert.equals(obj[0].file, article.file);
                    assert.equals(obj[0].base_href, article.base_href);
                    done();
                });
        },

        'query for existing word and expect two hits': function (done) {
            when( search.query('two-hit', {}) )
                .done(function (obj) {
                    assert.isArray(obj);
                    assert.equals(obj[1].title, article.title);
                    assert.equals(obj[1].published, article.published);
                    assert.equals(obj[1].img, article.img);
                    assert.equals(obj[1].body, article.body);
                    assert.equals(obj[1].file, article.file);
                    assert.equals(obj[1].base_href, article.base_href);
                    done();
                }, function (err) {
                    console.log(err);
                    done();
                });
        },

        'query for non existing word': function (done) {
            when( search.query('no-hit', {}) )
                .done(function (obj) {
                    assert.isArray(obj);
                    assert.equals(obj, []);
                    done();
                }, function (err) {
                    console.log(err);
                    done();
                });
        },

        'index object': function (done) {
            when( search.index(article) )
                .done(function (obj) {
                    assert.equals(obj, { status: 'ok' });
                    done();
                }, function (err) {
                    console.log(err);
                    done();
                });
        },

        'index object with wrong input': function (done) {
            when( search.index({}) )
                .done(function (obj) {
                    console.log(obj);
                    done();
                }, function (err) {
                    assert.match(err.error, 'obj.base_href');
                    assert.match(err.error, 'obj.file');
                    done();
                });
        },

        'index artlist': function (done) {
            when( search.index_artlist([article, article, article]) )
                .done(function (obj) {
                    assert.isArray(obj);
                    assert.equals(obj[0], { status: 'ok' });
                    assert.equals(obj[1], { status: 'ok' });
                    assert.equals(obj[2], { status: 'ok' });
                    done();
                }, function (err) {
                    console.log(err);
                    done();
                });
        },



    }
});
