'use strict';

var buster       = require('buster'),
    assert       = buster.assert;

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

var es = null;

buster.testCase('Elasticsearch', {
    setUp: function() {
        es = require('../../../lib/adapter/elasticsearch')({
            logger: {
                log: function () { },
                err: function () { }
            },
            config: {
                adapter: {
                    elasticsearch: {
                        server: '127.0.0.1',
                        port: 9200,
                        index: 'litt.no',
                        type: 'article',
                        multiMatchType: 'best_fields',
                        multiMatchTieBreaker: 0.3,
                    }
                }
            }
        });

    },

    tearDown: function () {
        delete require.cache[require.resolve('../../../lib/adapter/elasticsearch')];
    },

    '//missing config input. Should blow up': function () {
        assert.exception(function () {
            var _es = require('../../../lib/adapter/elasticsearch')({});
            console.log(_es);
        });
    },

    '//search for existing word and expect one hit': function (done) {
        es.query('one-hit', {})
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
            .catch((err) => {
                console.log(err);
                done();
            });
    },

    '//search for existing word and expect two hits': function (done) {
        es.query('two-hit', {})
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
            .catch((err) => {
                console.log(err);
                done();
            });
    },

    '//search for non existing word': function (done) {
        es.query('no-hit', {})
            .then(function (obj) {
                assert.isArray(obj.hits);
                // jscs:disable
                assert.equals(obj, { hits: [], meta: { maxScore: 0.83, timeMs: 4, total: 0 } });
                // jscs:enable
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
    },

    '//ping server': function (done) {
        es.ping()
            .then(function (obj) {
                assert.equals(obj, 'all is well');
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
    },

    '//index object': function (done) {
        es.index(article)
            .done(function (obj) {
                assert.equals(obj, { status: 'ok' });
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
    },

    '//index object with wrong input': function (done) {
        es.index({})
            .done(function (obj) {
                console.log(obj);
                done();
            })
            .catch((err) => {
                assert.match(err, 'obj.baseHref');
                assert.match(err, 'obj.file');
                done();
            });
    }

});
