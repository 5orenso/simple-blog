'use strict';

var buster       = require('buster'),
    assert       = buster.assert,
    refute       = buster.refute,
    when         = require('when');

var table_columns = [
    { column_name: 'age', data_type: 'integer', character_maximum_length: null },
    { column_name: 'agreement_time', data_type: 'integer', character_maximum_length: null },
    { column_name: 'agreement_type', data_type: 'character varying', character_maximum_length: 10 },
    { column_name: 'campaign_id', data_type: 'character varying', character_maximum_length: 10 },
    { column_name: 'captured_amount', data_type: 'numeric', character_maximum_length: null }
];

var simple_blog_index = { tag_values: { toc: '', fact: '', artlist: '' },
    published: '2014-09-01',
    tag: [ 'simple,blog' ],
    title: 'Simple Blog Server',
    teaser: 'Life made easier',
    img: [ 'simple-blog.jpg' ],
    aside: 'This is the aside.',
    body: '# Simple title 1\n\n## Simple sub title 1\n\nMy simple blog text.\n\n# Simple title 2\n\n## Simple sub title 1\n\n### Simple sub sub title 1\n\n```javascript \n\nconsole.log(\'hello world\');\n\n```\n\n![Simple blog image](simple-blog.jpg?w=600 "My image text")\n\n\n[:toc]\n\n\n[:menu_onepage]\n\n[:artlist_onepage]\n\n',
    body2: 'This is a test of body 2.\n[:toc]\n',
    aside2: 'This is a test of aside 2.\n[:toc]\n',
    body3: 'This is a test of body 3.\n[:toc]\n',
    aside3: 'This is a test of aside 3.\n[:toc]\n',
    body4: 'This is a test of body 4.\n[:toc]\n',
    aside4: 'This is a test of aside 4.\n[:toc]\n',
    body5: 'This is a test of body 5.\n[:toc]\n',
    aside5: 'This is a test of aside 5.\n[:toc]\n',
    images: [ '/' ],
    file: 'index',
    filename: 'my-path-to-the-files/content/articles/simple-blog/index.md',
    base_href: '/simple-blog/' };

var artlist = [{
    tag_values: { toc: '', fact: '', artlist: '' },
    published: '2014-09-01',
    tag: [ 'simple,blog' ],
    title: 'Simple Blog Server',
    teaser: 'Life made easier',
    img: [ 'simple-blog.jpg' ],
    aside: 'This is the aside.',
    body: '# Simple title 1\n\n## Simple sub title 1\n\nMy simple blog text.\n\n# Simple title 2\n\n## Simple sub title 1\n\n### Simple sub sub title 1\n\n```javascript \n\nconsole.log(\'hello world\');\n\n```\n\n![Simple blog image](simple-blog.jpg?w=600 "My image text")\n\n\n[:toc]\n\n\n[:menu_onepage]\n\n[:artlist_onepage]\n\n',
    body2: 'This is a test of body 2.\n[:toc]\n',
    aside2: 'This is a test of aside 2.\n[:toc]\n',
    body3: 'This is a test of body 3.\n[:toc]\n',
    aside3: 'This is a test of aside 3.\n[:toc]\n',
    body4: 'This is a test of body 4.\n[:toc]\n',
    aside4: 'This is a test of aside 4.\n[:toc]\n',
    body5: 'This is a test of body 5.\n[:toc]\n',
    aside5: 'This is a test of aside 5.\n[:toc]\n',
    images: [ '/' ],
    file: 'index',
    filename: 'my-path-to-the-files/content/articles/simple-blog/index.md',
    base_href: '/simple-blog/'
},
    {
        tag_values: { toc: '', fact: '', artlist: '' },
        published: '2014-01-01',
        title: 'Simple blog 2',
        img: [ 'simple-blog.jpg' ],
        body: 'This is content number 2.',
        file: 'simple-blog',
        filename: 'my-path-to-the-files/content/articles/simple-blog/simple-blog.md',
        base_href: '/simple-blog/'
    }];

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

var category_list = [ { dev: 16777220,
    mode: 16877,
    nlink: 5,
    uid: 501,
    gid: 20,
    rdev: 0,
    blksize: 4096,
    ino: 37773547,
    size: 170,
    blocks: 0,
//    atime: Tue Oct 28 2014 12:04:53 GMT+0100 (CET),
//    mtime: Fri Oct 24 2014 21:43:27 GMT+0200 (CEST),
//    ctime: Fri Oct 24 2014 21:43:27 GMT+0200 (CEST),
    name: 'simple-blog',
    type: 'directory' } ];


var pg = null;

buster.testCase("PostgreSQL", {
    setUp: function() {
        var that = this;
        this.clock = this.useFakeTimers();
        this.pg_query_spy = this.spy();

        pg = require('../../../lib/adapter/postgresql')({
            logger: {
                log: function () { },
                err: function () { }
            },
            config: {
                adapter: {
                    current: 'postgresql',
                    markdown: {
                        content_path: __dirname + '/../../content/articles/',
                        photo_path: __dirname + '/../../content/images/',
                        max_articles: 900,
                    },
                    postgresql: {
                        username: '',
                        password: '',
                        server: '127.0.0.1',
                        port: '5432',
                        database: 'test'
                    }
                }
            }
        }, {
            pg: {
                connect: function (opts, callback) {
                    callback(undefined, {
                        query: function (q, values, q_callback) {
                            if (!q_callback) {
                                q_callback = values;
                            }
                            that.pg_query_spy(q);
                            if (q.match(/-does-not-exist/)) {
                                q_callback('Error: doh!');
                            } else if (q.match(/LIMIT 1/i)) {
                                q_callback(null, {
                                    rows: [article]
                                });
                            } else if (q.match(/LIMIT \d+/i)) {
                                q_callback(null, {
                                    rows: artlist
                                });
                            } else {
                                q_callback(null, {
                                    rows: table_columns
                                });
                            }
                        }
                    }, function done() {

                    });
                }
            }
        });

    },

    tearDown: function () {
        this.clock.restore();
        delete require.cache[require.resolve('../../../lib/adapter/postgresql')];
    },

    "get column names get_column_names": function (done) {
        var that = this;
        when( pg.get_column_names('spid_event') )
            .then(function (result) {
                assert.equals(result, table_columns);
                assert(that.pg_query_spy.calledOnce);
                done();
            });
    },

    'load existing file': function (done) {
        var that = this;
        when( pg.load({
            request_url: '/simple-blog/index'
        }) )
            .done(function (obj) {
                assert.equals(obj.title, article.title);
                assert.equals(obj.published, article.published);
                assert.equals(obj.img, article.img);
                assert.equals(obj.body, article.body);
                assert.equals(obj.file, article.file);
                assert.equals(obj.base_href, article.base_href);
                assert(that.pg_query_spy.calledOnce);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },

    'load non existing file': function (done) {
        when( pg.load({
            request_url: '/simple-blog/index-does-not-exist'
        }) )
            .done(function (obj) {
                console.log(obj);
                done();
            }, function (obj) {
                assert.equals(obj.article.file, 'index-does-not-exist');
                assert.equals(obj.article.base_href, simple_blog_index.base_href);
                assert.equals(obj.status, 404);
                assert(obj.error);
                done();
            });
    },


    'list existing articles': function (done) {
        when( pg.list_articles('/simple-blog/') )
            .done(function (obj) {
                assert.equals(obj[0].title, artlist[0].title);
                assert.equals(obj[0].teaser, artlist[0].teaser);
                assert.equals(obj[0].file, artlist[0].file);
                assert.equals(obj[0].base_href, artlist[0].base_href);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },

    'list non existing articles': function (done) {
        when( pg.list_articles('/simple-blog-does-not-exist/') )
            .done(function (obj) {
                assert.equals(obj, []);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },

    '// list existing images': function (done) {
        when( pg.list_images(simple_blog_index) )
            .done(function (article) {
                assert.equals(article.image_list[0].filename, 'test.jpg');
                assert.equals(article.img[1], 'test.jpg');
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },

    '// list non existing images': function (done) {
        when( pg.list_images({}) )
            .done(function (article) {
                refute(article.image_list);
                refute(article.img);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },

    '// list categories': function (done) {
        when( pg.list_categories('/') )
            .done(function (catlist) {
                assert.equals(catlist[0].name, category_list[0].name);
                assert.equals(catlist[0].type, category_list[0].type);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },

    '// list categories wo/input': function (done) {
        when( pg.list_categories() )
            .done(function (catlist) {
                assert.equals(catlist, []);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },



});

