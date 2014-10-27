'use strict';

var buster       = require('buster'),
    assert       = buster.assert,
    refute       = buster.refute,
    when         = require('when'),
    article_util = require('../../lib/article-util')({
        logger: {
            log: function () { },
            err: function () { }
        },
    });

var markdown_input = "## My H2 Headline.\n" +
    "[my link](http://www.example.com)\n" +
    "![my image](http://www.example.com/image.jpg)\n" +
    "Done :)";
var markdown_output = {
    header: '<h2 class="toc-2"><a name="my-h2-headline-" class="anchor" href="#my-h2-headline-"><span class="header-link"></span></a>My H2 Headline.</h2>',
    link: '<a href="http://www.example.com">my link</a>',
    image: '<p class="image_inline"><img src="http://www.example.com/image.jpg" alt="my image"></p>',
};

buster.testCase('lib/article-util', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test article-util:': {
        'replaceMarked': function () {
            var result = article_util.replaceMarked(markdown_input);
            assert.match(result, markdown_output.header);
            assert.match(result, markdown_output.link);
            assert.match(result, markdown_output.image);
        },

        'getArticleFilename': function () {
            var result = article_util.getArticleFilename('/my-category/blog-article');
            assert.equals(result, 'blog-article');
        },

        'getArticlePathRelative': function () {
            var result = article_util.getArticlePathRelative('/home/simple-blog/content/articles/my-category/', '/home/simple-blog/content/articles/');
            assert.equals(result, '/my-category/');
        },

        'getArticlePathRelative w/missing article_path': function () {
            var result = article_util.getArticlePathRelative('', '/home/simple-blog/content/articles/');
            assert.equals(result, '/');
        },

        'getArticlePathRelative w/missing content_path': function () {
            var result = article_util.getArticlePathRelative('/my-category/');
            assert.equals(result, '/my-category/');
        },

        'getArticlePathRelative w/missing content_path and article_path': function () {
            var result = article_util.getArticlePathRelative();
            refute(result);
        },

        'getUrlFromRequest': function () {
            assert(true);
        },

        'populateArticleSections': function () {
            assert(true);
        },

        'buildTableOfContents': function () {
            assert(true);
        },

        'formatArticleSections': function () {
            assert(true);
        },

        'replaceTagsWithContent': function () {
            assert(true);
        },

        'formatArtlist': function () {
            assert(true);
        },


    }
});
