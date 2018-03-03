'use strict';

var buster = require('buster'),
    assert = buster.assert,
    elasticsearch = require('elasticsearch'),
    config = require(__dirname + '/../../config/config-integration.js');

var article = {
    tagValues: { toc: '', fact: '', artlist: '' },
    published: '2014-01-01',
    title: 'Simple blog 2',
    img: ['simple-blog.jpg'],
    body: 'This is content number 2.',
    file: 'index',
    filename: 'my-path-to-the-files/content/articles/simple-blog/simple-blog.md',
    baseHref: '/simple-blog/'
};

delete require.cache[require.resolve(__dirname + '/../../lib/search')];

var Search = require(__dirname + '/../../lib/search');
var search = new Search({
        logger: {
            log: function () {
            },
            err: function () {
            }
        },
        config: config
    });

buster.testCase('lib/search', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test search:': {
        '//query plain': function (done) {
            search.query('one-hit')
                .then(function (obj) {
                    assert.isArray(obj.hits);
                    assert.equals(obj.hits[0].title, article.title);
                    assert.equals(obj.hits[0].published, article.published);
                    assert.equals(obj.hits[0].img, article.img);
                    assert.equals(obj.hits[0].body, article.body);
                    assert.equals(obj.hits[0].file, article.file);
                    assert.equals(obj.hits[0].baseHref, article.baseHref);
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        },

        '//query for existing word and expect two hits': function (done) {
            search.query('two-hit', {})
                .then(function (obj) {
                    assert.isArray(obj.hits);
                    assert.equals(obj.hits[1].title, article.title);
                    assert.equals(obj.hits[1].published, article.published);
                    assert.equals(obj.hits[1].img, article.img);
                    assert.equals(obj.hits[1].body, article.body);
                    assert.equals(obj.hits[1].file, article.file);
                    assert.equals(obj.hits[1].baseHref, article.baseHref);
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        },

        '//query for non existing word': function (done) {
            search.query('no-hit', {})
                .then(function (obj) {
                    assert.isArray(obj.hits);
                    assert.equals(obj.hits, []);
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        },

        '//index object': function (done) {
            search.index(article)
                .then(function (obj) {
                    assert.equals(obj, { status: 'ok' });
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        },

        '//index object with wrong input': function (done) {
            search.index({})
                .then(function (obj) {
                    console.log(obj);
                    done();
                })
                .catch(function (err) {
                    assert.match(err.error, 'obj.baseHref');
                    assert.match(err.error, 'obj.file');
                    done();
                });
        },

        '//index artlist': function (done) {
            search.indexArtlist([article, article, article])
                .then(function (obj) {
                    assert.isArray(obj);
                    assert.equals(obj[0], { status: 'ok' });
                    assert.equals(obj[1], { status: 'ok' });
                    assert.equals(obj[2], { status: 'ok' });
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        }

    }
});
