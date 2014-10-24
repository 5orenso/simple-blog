'use strict';

var buster   = require('buster'),
    assert   = buster.assert,
    refute   = buster.refute,
    when     = require('when'),
    markdown = require('../../../lib/adapter/markdown')({
        logger: {
            log: function (msg1, msg2) { console.log(msg1, msg2); },
            err: function (err1, err2) { console.log(err1, err2); }
        },
        config: {
            adapter: {
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
    filename: '/Users/sorenso/PhpstormProjects/simple-blog/test/content/articles/simple-blog/index.md',
    base_href: '/simple-blog/' };

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
//                    console.log(obj);
                    assert.equals(obj.article.file, 'index-does-not-exist');
                    assert.equals(obj.article.base_href, simple_blog_index.base_href);
                    done();
                });
        },
    }
});
