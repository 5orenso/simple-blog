'use strict';

var buster   = require('buster'),
    assert   = buster.assert,
    refute   = buster.refute,
    markdown = require('../../../lib/adapter/markdown')({
        logger: {
            log: function () { },
            err: function () { }
        },
        config: {
            adapter: {
                current: 'markdown',
                markdown: {
                    contentPath: __dirname + '/../../content/articles/',
                    photoPath: __dirname + '/../../content/images/',
                    maxArticles: 900
                }
            }
        }
    });

var simpleBlogIndex = { tagValues: { toc: '', fact: '', artlist: '' },
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
    tagValues: { toc: '', fact: '', artlist: '' },
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

var categoryList = [{ dev: 16777220,
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
    type: 'directory' }];

buster.testCase('lib/adapter/markdown', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test markdown adapter:': {
        'load existing file': function (done) {
            markdown.load({
                requestUrl: '/simple-blog/index'
            })
                .then(function (obj) {
                    assert.equals(obj.file, simpleBlogIndex.file);
                    assert.equals(obj.baseHref, simpleBlogIndex.baseHref);
                    done();
                });
        },
        'load non existing file': function (done) {
            markdown.load({
                requestUrl: '/simple-blog/index-does-not-exist'
            })
                .then(function (obj) {
                    console.log(obj);
                }, function (obj) {
                    assert.equals(obj.article.file, 'index-does-not-exist');
                    assert.equals(obj.article.baseHref, simpleBlogIndex.baseHref);
                    done();
                });
        },

        'list existing articles': function (done) {
            markdown.listArticles('/simple-blog/')
                .then(function (obj) {
                    assert.equals(obj[0].title, artlist[0].title);
                    assert.equals(obj[0].teaser, artlist[0].teaser);
                    assert.equals(obj[0].file, artlist[0].file);
                    assert.equals(obj[0].baseHref, artlist[0].baseHref);
                    done();
                });
        },

        'list non existing articles': function (done) {
            markdown.listArticles('/simple-blog-does-not-exist/')
                .then(function (obj) {
                    assert.equals(obj, []);
                    done();
                });
        },

        'list existing images': function (done) {
            markdown.listImages(simpleBlogIndex)
                .then(function (article) {
                    assert.equals(article.imageList[0].filename, 'test.jpg');
                    assert.equals(article.img[1], 'test.jpg');
                    done();
                });
        },

        'list non existing images': function (done) {
            markdown.listImages({})
                .then(function (article) {
                    refute(article.imageList);
                    refute(article.img);
                    done();
                });
        },

        'list categories': function (done) {
            markdown.listCategories('/')
                .then(function (catlist) {
                    assert.equals(catlist[0].name, categoryList[0].name);
                    assert.equals(catlist[0].type, categoryList[0].type);
                    done();
                });
        },

        'list categories wo/input': function (done) {
            markdown.listCategories()
                .then(function (catlist) {
                    assert.equals(catlist, []);
                    done();
                });
        }

    }
});
