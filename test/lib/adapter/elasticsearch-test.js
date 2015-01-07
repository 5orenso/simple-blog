'use strict';

var buster       = require('buster'),
    assert       = buster.assert,
    refute       = buster.refute,
    when         = require('when');

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

var es = null;

buster.testCase("Elasticsearch", {
    setUp: function() {
        var that = this;
        this.elasticsearch_query_spy = this.spy();
        this.elasticsearch_ping_spy = this.spy();
        this.elasticsearch_index_spy = this.spy();

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
                        index: 'twitter',
                        type: 'tweet'
                    }
                }
            }
        }, {
            elasticsearch: {
                Client: function () {
                    return {
                        ping: function (opt, callback) {
                            that.elasticsearch_ping_spy();
                            callback(null, {status: 'ok'});
                        },
                        search: function (query) {
                            return when.promise(function (resolve, reject) {
                                that.elasticsearch_query_spy();
                                if (query.body.query.match === 'one-hit') {
                                    resolve({
                                        hits: {
                                            hits: [{
                                                _source: article
                                            }]
                                        },
                                        query: query
                                    });
                                } else if (query.body.query.match === 'no-hit') {
                                    resolve({
                                        hits: {
                                            hits: []
                                        },
                                        query: query
                                    });
                                } else if (query.body.query.match === 'two-hit') {
                                    resolve({
                                        hits: {
                                            hits: [{
                                                _source: article
                                            }, {
                                                _source: article
                                            }]
                                        },
                                        query: query
                                    });
                                }
                            });
                        },
                        index: function (obj, callback) {
                            that.elasticsearch_index_spy();
                            callback(null, {status: 'ok'});
                        }
                    };
                }
            }

        });


    },

    tearDown: function () {
        delete require.cache[require.resolve('../../../lib/adapter/elasticsearch')];
    },

    'search for existing word and expect one hit': function (done) {
        var that = this;
        when( es.query('one-hit', {}) )
            .done(function (obj) {
                assert.isArray(obj);
                assert.equals(obj[0].title, article.title);
                assert.equals(obj[0].published, article.published);
                assert.equals(obj[0].img, article.img);
                assert.equals(obj[0].body, article.body);
                assert.equals(obj[0].file, article.file);
                assert.equals(obj[0].base_href, article.base_href);
                assert(that.elasticsearch_query_spy.calledOnce);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },

    'search for existing word and expect two hits': function (done) {
        var that = this;
        when( es.query('two-hit', {}) )
            .done(function (obj) {
                assert.isArray(obj);
                assert.equals(obj[1].title, article.title);
                assert.equals(obj[1].published, article.published);
                assert.equals(obj[1].img, article.img);
                assert.equals(obj[1].body, article.body);
                assert.equals(obj[1].file, article.file);
                assert.equals(obj[1].base_href, article.base_href);
                assert(that.elasticsearch_query_spy.calledOnce);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },

    'search for non existing word': function (done) {
        var that = this;
        when( es.query('no-hit', {}) )
            .done(function (obj) {
                assert.isArray(obj);
                assert.equals(obj, []);
                assert(that.elasticsearch_query_spy.calledOnce);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },

    'ping server': function (done) {
        var that = this;
        when( es.ping() )
            .done(function (obj) {
                assert.equals(obj, 'all is well');
                assert(that.elasticsearch_ping_spy.calledOnce);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },


    'index object': function (done) {
        var that = this;
        when( es.index(article) )
            .done(function (obj) {
                assert.equals(obj, { status: 'ok' });
                assert(that.elasticsearch_index_spy.calledOnce);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },

    'index object with wrong input': function (done) {
        var that = this;
        when( es.index({}) )
            .done(function (obj) {
                console.log(obj);
                done();
            }, function (err) {
                assert.match(err, 'obj.base_href');
                assert.match(err, 'obj.file');
                done();
            });
    },


});

