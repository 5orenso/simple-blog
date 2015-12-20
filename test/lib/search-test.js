'use strict';

var buster = require('buster'),
    assert = buster.assert,
    when   = require('when'),
    sinon  = require('sinon'),
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
sinon.stub(elasticsearch, 'Client', function () {
    // jscs:disable
    return {
        ping: function (opt, callback) {
            callback(null, {status: 'ok'});
        },
        search: function (query) {
            return when.promise(function (resolve, reject) {
                //console.log('elasticsearch for: ', query.body.query.match._all);
                //console.log('elasticsearch for: ', query.body.query);
                if (query.body.query.multi_match.query === 'one-hit') {
                    //console.log('elasticsearch : ONE HIT');
                    resolve({
                        took: 4,
                        hits: {
                            total: 1,
                            max_score: 0.83,
                            hits: [{
                                _source: article
                            }]
                        },
                        query: query
                    });
                } else if (query.body.query.multi_match.query === 'no-hit') {
                    //console.log('elasticsearch : NO HIT');
                    resolve({
                        took: 4,
                        hits: {
                            total: 0,
                            max_score: 0.83,
                            hits: []
                        },
                        query: query
                    });
                } else if (query.body.query.multi_match.query === 'two-hit') {
                    resolve({
                        took: 4,
                        hits: {
                            total: 2,
                            max_score: 0.83,
                            hits: [{
                                _source: article
                            }, {
                                _source: article
                            }]
                        },
                        query: query
                    });
                } else if (query.body.query.multi_match.query === 'blow-up') {
                    reject('search inside elasticsearch mock failed, because you asked it to do so :)');
                } else {
                    resolve({
                        took: 4,
                        hits: {
                            total: 1,
                            max_score: 0.83,
                            hits: [{
                                _source: article
                            }]
                        },
                        query: query
                    });
                }
            });
        },
        index: function (obj, callback) {
            callback(null, {status: 'ok'});
        }
    };
    // jscs:enable
});

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
        'query plain': function (done) {
            when(search.query('one-hit'))
                .done(function (obj) {
                    assert.isArray(obj.hits);
                    assert.equals(obj.hits[0].title, article.title);
                    assert.equals(obj.hits[0].published, article.published);
                    assert.equals(obj.hits[0].img, article.img);
                    assert.equals(obj.hits[0].body, article.body);
                    assert.equals(obj.hits[0].file, article.file);
                    assert.equals(obj.hits[0].baseHref, article.baseHref);
                    done();
                }, function (err) {
                    console.log(err);
                    done();
                });
        },

        'query for existing word and expect two hits': function (done) {
            when(search.query('two-hit', {}))
                .done(function (obj) {
                    assert.isArray(obj.hits);
                    assert.equals(obj.hits[1].title, article.title);
                    assert.equals(obj.hits[1].published, article.published);
                    assert.equals(obj.hits[1].img, article.img);
                    assert.equals(obj.hits[1].body, article.body);
                    assert.equals(obj.hits[1].file, article.file);
                    assert.equals(obj.hits[1].baseHref, article.baseHref);
                    done();
                }, function (err) {
                    console.log(err);
                    done();
                });
        },

        'query for non existing word': function (done) {
            when(search.query('no-hit', {}))
                .done(function (obj) {
                    assert.isArray(obj.hits);
                    assert.equals(obj.hits, []);
                    done();
                }, function (err) {
                    console.log(err);
                    done();
                });
        },

        'index object': function (done) {
            when(search.index(article))
                .done(function (obj) {
                    assert.equals(obj, { status: 'ok' });
                    done();
                }, function (err) {
                    console.log(err);
                    done();
                });
        },

        'index object with wrong input': function (done) {
            when(search.index({}))
                .done(function (obj) {
                    console.log(obj);
                    done();
                }, function (err) {
                    assert.match(err.error, 'obj.baseHref');
                    assert.match(err.error, 'obj.file');
                    done();
                });
        },

        'index artlist': function (done) {
            when(search.indexArtlist([article, article, article]))
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
        }

    }
});
