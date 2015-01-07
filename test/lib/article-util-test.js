'use strict';

var buster       = require('buster'),
    assert       = buster.assert,
    refute       = buster.refute,
    when         = require('when'),
    strftime     = require('strftime'),
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

var article_md = ":title My nice title\n" +
    ":img test-image.jpg\n" +
    ":aside My aside content\n" +
    ":body This is my body content. [:fa-link]\n// youtube.com #video #yolo @sorenso\n" +
    "## Content span\n" +
    "This can span several lines if you want to.\n" +
    "### Even more titles\n" +
    "With sub content belonging to sections.\n" +
    "## Table of contents\n" +
    "[:toc]\n" +
    ":tag foo,bar,gomle\n";

var article_obj = { tag_values: { toc: '', fact: '', artlist: '' },
    author: 'sorenso',
    published: '2014-12-21',
    base_href: '/simpleblog/',
    title: 'My nice title',
    img: [ 'test-image.jpg' ],
    aside: 'My aside content',
    body: 'This is my body content. [:fa-link]\n// youtube.com #video #yolo @sorenso\n## Content span\nThis can span several lines if you want to.\n### Even more titles\nWith sub content belonging to sections.\n## Table of contents\n[:toc]\n',
    tag: [ 'foo,bar,gomle' ] };

var article_obj_html = {
    tag_values: {
        toc: '<div class="toc" id="toc"><span class="toc-indent-2">&bull; <a href="#content-span">Content span</a></span><span class="toc-indent-3">&bull; <a href="#even-more-titles">Even more titles</a></span><span class="toc-indent-2">&bull; <a href="#table-of-contents">Table of contents</a></span></div>',
        fact: '',
        artlist: '<ul class="artlist"><li><a href="/simple-blog/index">Simple Blog Server</a></li></ul>',
        'artlist-block': '<div class="artlist"><div class="artlist-art"><div class="artlist-image" style=""><a href="/simple-blog/index"><img src="/images/pix.gif" style="height:100%; width:100%;"></a></div><h3><a href="/simple-blog/index">Simple Blog Server</a></h3></div></div><br class="clear">',
        artlist_onepage: '<ul class="artlist"><li><a href="#/simple-blog/index">Simple Blog Server</a></li></ul>'
    },
    title: 'My nice title',
    body: '<p>This is my body content. [:fa-link]\n// youtube.com #video #yolo @sorenso</p>\n<h2 class="toc-2"><a name="content-span" class="anchor" href="#content-span"><span class="header-link"></span></a>Content span</h2><p>This can span several lines if you want to.</p>\n<h3 class="toc-3"><a name="even-more-titles" class="anchor" href="#even-more-titles"><span class="header-link"></span></a>Even more titles</h3><p>With sub content belonging to sections.</p>\n<h2 class="toc-2"><a name="table-of-contents" class="anchor" href="#table-of-contents"><span class="header-link"></span></a>Table of contents</h2><p>[:toc]</p>\n',
    img: [ 'test-image.jpg' ],
    tag: [ 'foo,bar,gomle' ],
    author: 'sorenso',
    published: '2014-12-21',
    base_href: '/simpleblog/'
};

var artlist = [
    {
        tag_values: [Object],
        title: 'Simple Blog Server',
        file: 'index',
        filename: './test/content/articles/simple-blog/index.md',
        base_href: '/simple-blog/'
    }
];


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

        'formatDate 2014-12-24 17:00:00': function () {
            var result = article_util.formatDate('2014-12-24 17:00:00');
            assert.equals(result, 'Dec 24, 2014');
        },

        'formatDate Xmas this year': function () {
            var current_year = strftime('%Y');
            var xmas_this_year = current_year + '-12-24 17:00:00';
            var result = article_util.formatDate(xmas_this_year);
            assert.equals(result, 'Dec 24');
        },

        'formatDate wo/input': function () {
            var result = article_util.formatDate();
            var expected_result = strftime('%b %e');
            assert.equals(result, expected_result);
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
            var result = article_util.getUrlFromRequest({ url: '/simple-blog/index' });
            assert.equals(result, '/simple-blog/index');
        },

        'getUrlFromRequest w/path only': function () {
            var result = article_util.getUrlFromRequest({ url: '/simple-blog/' });
            assert.equals(result, '/simple-blog/index');
        },

        'getUrlFromRequest w/encoded strings': function () {
            var result = article_util.getUrlFromRequest({ url: '/simple%20blog/index' });
            assert.equals(result, '/simple blog/index');
        },

        'getUrlFromRequest wo/input': function () {
            var result = article_util.getUrlFromRequest({});
            refute.defined(result);
        },

        'getUrlFromRequest w/undefined input': function () {
            var result = article_util.getUrlFromRequest();
            refute.defined(result);
        },

        'populateArticleSections': function () {
            var result = article_util.populateArticleSections(article_md);
            assert.equals(result.title, article_obj.title);
            assert.equals(result.img, article_obj.img);
            assert.equals(result.body, article_obj.body);
        },

        'buildTableOfContents': function () {
            var article = {
                tag_values: { toc: '', fact: '', artlist: '' },
                title: article_obj.title,
                body: article_obj.body
            };
            article.body = article_util.replaceMarked(article.body);
            var result = article_util.buildTableOfContents(article, 'body');
            refute(result);
            assert.equals(article.tag_values.toc, article_obj_html.tag_values.toc);
        },

        'buildTableOfContents w/empty body': function () {
            var article = {};
            var result = article_util.buildTableOfContents(article, 'body');
            assert.equals(article, {});
            refute(result);
        },

        'buildTableOfContents w/missing headlines in body': function () {
            var article = {
                tag_values: { toc: '' },
                body: 'This is a simple body'
            };
            var result = article_util.buildTableOfContents(article, 'body');
            assert.equals(article.tag_values.toc, '');
            refute(result);
        },

        'formatArticleSections': function () {
            var article = {
                tag_values: { toc: '', fact: '', artlist: '' },
                title: article_obj.title,
                body: article_obj.body,
                img: article_obj.img,
                tag: article_obj.tag,
                author: article_obj.author,
                published: article_obj.published,
                base_href: article_obj.base_href
            };
            var result = article_util.formatArticleSections(article);
            assert.equals(article.title, article_obj_html.title);
            assert.equals(article.body, article_obj_html.body);
            assert.equals(article.img, article_obj_html.img);
            assert.equals(article.tag, article_obj_html.tag);
            assert.equals(article.author, article_obj_html.author);
            assert.equals(article.published, article_obj_html.published);
            assert.equals(article.base_href, article_obj_html.base_href);

            refute(result);
        },

        'replaceTagsWithContent': function () {
            var article = {
                tag_values: {
                    toc: article_obj_html.tag_values.toc,
                    fact: '',
                    artlist: ''
                },
                title: article_obj_html.title,
                body: article_obj_html.body,
                aside: article_obj_html.aside,
                img: article_obj_html.img,
                tag: article_obj_html.tag
            };
            // <span class="icon fa-link"></span>
            // <span class="comment">// youtube.com
            // <span class="hash_tag">#<a href="https://twitter.com/search?q=%23video">video</a></span>
            // <span class="hash_tag">#<a href="https://twitter.com/search?q=%23yolo">yolo</a></span>
            // <span class="user">@<a href="https://twitter.com/sorenso">sorenso</a></span>
            var result = article_util.replaceTagsWithContent(article);
            console.log(article);
            assert.match(article.body, article_obj_html.tag_values.toc);
            assert.match(article.body, '<span class="icon fa-link"></span>');
            assert.match(article.body, '<span class="comment">// youtube.com');
            assert.match(article.body, '<span class="hash_tag">#<a href="https://twitter.com/search?q=%23video">video</a></span>');
            assert.match(article.body, '<span class="hash_tag">#<a href="https://twitter.com/search?q=%23yolo">yolo</a></span>');
            assert.match(article.body, '<span class="user">@<a href="https://twitter.com/sorenso">sorenso</a></span>');
            refute(result);
        },

        'formatArtlist': function () {
            var article = {
                tag_values: {
                    toc: article_obj_html.tag_values.toc,
                    fact: '',
                    artlist: ''
                },
                title: article_obj_html.title,
                body: article_obj_html.body,
                aside: article_obj_html.aside,
                img: article_obj_html.img,
                tag: article_obj_html.tag
            };
            var result = article_util.formatArtlist(article, artlist);
            assert.equals(article.tag_values.artlist, article_obj_html.tag_values.artlist);
            assert.equals(article.tag_values['artlist-block'], article_obj_html.tag_values['artlist-block']);
            assert.equals(article.tag_values.artlist_onepage, article_obj_html.tag_values.artlist_onepage);
            refute(result);
            assert(true);
        },


    }
});
