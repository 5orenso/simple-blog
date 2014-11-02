'use strict';

var buster   = require('buster'),
    assert   = buster.assert,
    refute   = buster.refute,
    when     = require('when'),
    markdown = require('../../../lib/adapter/markdown')({
        logger: {
            log: function () { },
            err: function () { }
        },
        config: {
            adapter: {
                current: 'markdown',
                markdown: {
                    content_path: __dirname + '/../../content/articles/',
                    photo_path: __dirname + '/../../content/images/',
                    max_articles: 900,
                }
            }
        }

    });

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

buster.testCase('lib/adapter/markdown', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test markdown adapter:': {
        'load existing file': function (done) {
            when( markdown.load({
                request_url: '/simple-blog/index'
            }) )
                .done(function (obj) {
                    assert.equals(obj.file, simple_blog_index.file);
                    assert.equals(obj.base_href, simple_blog_index.base_href);
                    done();
                });
        },
        'load non existing file': function (done) {
            when( markdown.load({
                request_url: '/simple-blog/index-does-not-exist'
            }) )
                .done(function (obj) {
                    console.log(obj);
                }, function (obj) {
                    assert.equals(obj.article.file, 'index-does-not-exist');
                    assert.equals(obj.article.base_href, simple_blog_index.base_href);
                    done();
                });
        },

        'list existing articles': function (done) {
            when( markdown.list_articles('/simple-blog/') )
                .done(function (obj) {
                    assert.equals(obj[0].title, artlist[0].title);
                    assert.equals(obj[0].teaser, artlist[0].teaser);
                    assert.equals(obj[0].file, artlist[0].file);
                    assert.equals(obj[0].base_href, artlist[0].base_href);
                    done();
                });
        },

        'list non existing articles': function (done) {
            when( markdown.list_articles('/simple-blog-does-not-exist/') )
                .done(function (obj) {
                    assert.equals(obj, []);
                    done();
                });
        },

        'list existing images': function (done) {
            when( markdown.list_images(simple_blog_index) )
                .done(function (article) {
                    assert.equals(article.image_list[0].filename, 'test.jpg');
                    assert.equals(article.img[1], 'test.jpg');
                    done();
                });
        },

        'list non existing images': function (done) {
            when( markdown.list_images({}) )
                .done(function (article) {
                    refute(article.image_list);
                    refute(article.img);
                    done();
                });
        },

        'list categories': function (done) {
            when( markdown.list_categories('/') )
                .done(function (catlist) {
                    assert.equals(catlist[0].name, category_list[0].name);
                    assert.equals(catlist[0].type, category_list[0].type);
                    done();
                });
        },

        'list categories wo/input': function (done) {
            when( markdown.list_categories() )
                .done(function (catlist) {
                    assert.equals(catlist, []);
                    done();
                });
        },

    }
});
