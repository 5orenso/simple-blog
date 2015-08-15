'use strict';

var buster       = require('buster'),
    assert       = buster.assert,
    refute       = buster.refute,
    when         = require('when');

var tableColumns = [
    { columnName: 'age', dataType: 'integer', characterMaximumLength: null },
    { columnName: 'agreement_time', dataType: 'integer', characterMaximumLength: null },
    { columnName: 'agreement_type', dataType: 'character varying', characterMaximumLength: 10 },
    { columnName: 'campaign_id', dataType: 'character varying', characterMaximumLength: 10 },
    { columnName: 'captured_amount', dataType: 'numeric', characterMaximumLength: null }
];

var simpleBlogIndex = {tagValues: { toc: '', fact: '', artlist: ''},
    published: '2014-09-01',
    tag: ['simple,blog'],
    title: 'Simple Blog Server',
    teaser: 'Life made easier',
    img: ['simple-blog.jpg'],
    aside: 'This is the aside.',
    body: '# Simple title 1\n\n## Simple sub title 1\n\nMy simple blog text.\n\n# Simple title 2\n\n## Simple sub ' +
        'title 1\n\n### Simple sub sub title 1\n\n```javascript \n\nconsole.log(\'hello world\');\n\n```\n\n![Simple' +
        ' blog image](simple-blog.jpg?w=600 "My image text")\n\n\n[:toc]\n\n\n[:menuOnepage]\n\n[:artlistOnepage]\n\n',
    body2: 'This is a test of body 2.\n[:toc]\n',
    aside2: 'This is a test of aside 2.\n[:toc]\n',
    body3: 'This is a test of body 3.\n[:toc]\n',
    aside3: 'This is a test of aside 3.\n[:toc]\n',
    body4: 'This is a test of body 4.\n[:toc]\n',
    aside4: 'This is a test of aside 4.\n[:toc]\n',
    body5: 'This is a test of body 5.\n[:toc]\n',
    aside5: 'This is a test of aside 5.\n[:toc]\n',
    images: ['/'],
    file: 'index',
    filename: 'my-path-to-the-files/content/articles/simple-blog/index.md',
    baseHref: '/simple-blog/' };

var artlist = [{
    tagValues: {toc: '', fact: '', artlist: ''},
    published: '2014-09-01',
    tag: ['simple,blog'],
    title: 'Simple Blog Server',
    teaser: 'Life made easier',
    img: ['simple-blog.jpg'],
    photos: 'test.jpg;;test2.jpg',
    aside: 'This is the aside.',
    body: '# Simple title 1\n\n## Simple sub title 1\n\nMy simple blog text.\n\n# Simple title 2\n\n## Simple sub ' +
        'title 1\n\n### Simple sub sub title 1\n\n```javascript \n\nconsole.log(\'hello world\');\n\n```\n\n![Simple ' +
        'blog image](simple-blog.jpg?w=600 "My image text")\n\n\n[:toc]\n\n\n[:menuOnepage]\n\n[:artlistOnepage]\n\n',
    body2: 'This is a test of body 2.\n[:toc]\n',
    aside2: 'This is a test of aside 2.\n[:toc]\n',
    body3: 'This is a test of body 3.\n[:toc]\n',
    aside3: 'This is a test of aside 3.\n[:toc]\n',
    body4: 'This is a test of body 4.\n[:toc]\n',
    aside4: 'This is a test of aside 4.\n[:toc]\n',
    body5: 'This is a test of body 5.\n[:toc]\n',
    aside5: 'This is a test of aside 5.\n[:toc]\n',
    images: ['/'],
    file: 'index',
    filename: 'my-path-to-the-files/content/articles/simple-blog/index.md',
    baseHref: '/simple-blog/'
},
    {
        tagValues: { toc: '', fact: '', artlist: '' },
        published: '2014-01-01',
        title: 'Simple blog 2',
        img: ['simple-blog.jpg'],
        body: 'This is content number 2.',
        file: 'simple-blog',
        filename: 'my-path-to-the-files/content/articles/simple-blog/simple-blog.md',
        baseHref: '/simple-blog/'
    }];

var article = {
    tagValues: { toc: '', fact: '', artlist: '' },
    published: '2014-01-01',
    title: 'Simple blog 2',
    img: ['test.jpg', 'test2.jpg', 'wipbilder/1/123.jpg'],
    photos: 'test.jpg;;test2.jpg;;/photo/?id=123.jpg[test]',
    body: 'This is content number 2.',
    file: 'index',
    filename: 'my-path-to-the-files/content/articles/simple-blog/simple-blog.md',
    baseHref: '/simple-blog/'
};

//var categoryList = [{ dev: 16777220,
//    mode: 16877,
//    nlink: 5,
//    uid: 501,
//    gid: 20,
//    rdev: 0,
//    blksize: 4096,
//    ino: 37773547,
//    size: 170,
//    blocks: 0,
////    atime: Tue Oct 28 2014 12:04:53 GMT+0100 (CET),
////    mtime: Fri Oct 24 2014 21:43:27 GMT+0200 (CEST),
////    ctime: Fri Oct 24 2014 21:43:27 GMT+0200 (CEST),
//    name: 'simple-blog',
//    type: 'directory' }];

var catlistResult = [
    {
        type: 'directory',
        tagValues: {
            toc: '',
            fact: '',
            artlist: ''
        },
        published: '2014-01-01',
        title: 'Simple blog 2',
        img: ['test.jpg', 'test2.jpg'],
        photos: 'test.jpg;;test2.jpg',
        body: 'This is content number 2.',
        file: 'index',
        filename: 'my-path-to-the-files/content/articles/simple-blog/simple-blog.md',
        baseHref: '/simple-blog/' }
];

var pg = null;

buster.testCase('PostgreSQL', {
    setUp: function() {
        var that = this;
//        this.clock = this.useFakeTimers();
        this.pgQuerySpy = this.spy();

        pg = require('../../../lib/adapter/postgresql')({
            logger: {
                log: function () { },
                err: function () { }
            },
            config: {
                adapter: {
                    current: 'postgresql',
                    markdown: {
                        contentPath: __dirname + '/../../content/articles/',
                        photoPath: __dirname + '/../../content/images/',
                        maxArticles: 900
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
                        query: function (q, values, qCallback) {
                            if (!qCallback) {
                                qCallback = values;
                            }
                            that.pgQuerySpy(q);
//                            console.log(q);

                            if (q.match(/-does-not-exist/)) {
                                qCallback('Error: doh!');
                            } else if (q.match(/LIMIT 1/i)) {
                                qCallback(null, {
                                    rows: [article]
                                });
                            } else if (q.match(/LIMIT \d+/i)) {
                                qCallback(null, {
                                    rows: artlist
                                });
                            } else {
                                qCallback(null, {
                                    rows: tableColumns
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
//        this.clock.restore();
        delete require.cache[require.resolve('../../../lib/adapter/postgresql')];
    },

    'get column names getColumnNames': function (done) {
        var that = this;
        when(pg.getColumnNames('spid_event'))
            .then(function (result) {
                assert.equals(result, tableColumns);
                assert(that.pgQuerySpy.calledOnce);
                done();
            });
    },

    'load existing file': function (done) {
        var that = this;
        when(pg.load({
            requestUrl: '/simple-blog/index'
        }))
            .done(function (obj) {
                assert.equals(obj.title, article.title);
                assert.equals(obj.published, article.published);
                assert.equals(obj.img, article.img);
                assert.equals(obj.body, article.body);
                assert.equals(obj.file, article.file);
                assert.equals(obj.baseHref, article.baseHref);
                assert(that.pgQuerySpy.calledOnce);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },

    'load non existing file': function (done) {
        when(pg.load({
            requestUrl: '/simple-blog/index-does-not-exist'
        }))
            .done(function (obj) {
                console.log(obj);
                done();
            }, function (obj) {
                assert.equals(obj.article.file, 'index-does-not-exist');
                assert.equals(obj.article.baseHref, simpleBlogIndex.baseHref);
                assert.equals(obj.status, 404);
                assert(obj.error);
                done();
            });
    },

    'list existing articles': function (done) {
        when(pg.listArticles('/simple-blog/'))
            .done(function (obj) {
//                console.log('listArticles:', obj);
                assert.equals(obj[0].title, artlist[0].title);
                assert.equals(obj[0].teaser, artlist[0].teaser);
                assert.equals(obj[0].file, artlist[0].file);
                assert.equals(obj[0].baseHref, artlist[0].baseHref);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },

    'list non existing articles w/special chars': function (done) {
        // jscs:disable
        when(pg.listArticles('/simple-blog-does-not-exist/\'"' + "\n\b\t\0\r\x1a"))
            // jscs:enable
            .done(function (obj) {
//                console.log('listArticles1:', obj);
                assert.equals(obj, []);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },

    'list non existing articles': function (done) {
        when(pg.listArticles('/simple-blog-does-not-exist/'))
            .done(function (obj) {
//                console.log('listArticles1:', obj);
                assert.equals(obj, []);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },

    'list existing images': function (done) {
        when(pg.listImages(simpleBlogIndex))
            .done(function (obj) {
                // TODO: should be fixed.
                assert.equals(obj, simpleBlogIndex);
//                assert.equals(article.imageList[0].filename, 'test.jpg');
//                assert.equals(article.img[1], 'test.jpg');
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },

    '// list non existing images': function (done) {
        when(pg.listImages({}))
            .done(function (article) {
                refute(article.imageList);
                refute(article.img);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },

    'list categories': function (done) {
        when(pg.listCategories('/'))
            .done(function (catlist) {
                console.log(catlist);
                assert.equals(catlist[0].name, catlistResult[0].name);
                assert.equals(catlist[0].type, catlistResult[0].type);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    },

    '// list categories wo/input': function (done) {
        when(pg.listCategories())
            .done(function (catlist) {
                assert.equals(catlist, []);
                done();
            }, function (err) {
                console.log(err);
                done();
            });
    }

});

