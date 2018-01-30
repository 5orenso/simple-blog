'use strict';

var buster       = require('buster'),
    assert       = buster.assert,
    refute       = buster.refute,
    strftime     = require('strftime'),
    ArticleUtil  = require('../../lib/article-util'),
    articleUtil  = new ArticleUtil({
        logger: {
            log: function () { },
            err: function () { }
        }
    });

// jscs:disable
var htmlCoponents = {
    flot: new RegExp('<div class="row">[\\s\\S]+<div class="flot-container 10u">' +
    '[\\s\\S]+<div id="flotplaceholder_\\d+_\\d+" class="flot-placeholder".+?>[\\s\\S]+' +
    '</div>[\\s\\S]+</div>[\\s\\S]+</div>[\\s\\S]+' +
    '<div class="row">[\\s\\S]+<div.+?class="flot-choices 12u">[\\s\\S]*' +
    '</div>[\\s\\S]+</div>[\\s\\S]+' +
    '<script type="text/javascript">[\\s\\S]+' +
    '\\$\\(function\\(\\) \\{[\\s\\S]+' +
    '</script>'),
    wsd: new RegExp('<img src="\\/pho\\/wsd\\/\\?data=.+?">')
};
var markdownInput = '## My H2 Headline.' + "\n" +
    '[my link](http://www.example.com)' + "\n" +
    '![my image](http://www.example.com/image.jpg)' + "\n" +
    'Done :)';
var markdownOutput = {
    header: '<h2 class="toc-2"><a name="my-h2-headline-" class="anchor" href="#my-h2-headline-">' +
        '<span class="header-link"></span></a>My H2 Headline.</h2>',
    link: '<a href="http://www.example.com">my link</a>',
    image: '<p class="image_inline "><a href="http://www.example.com/image.jpg" data-smoothzoom="group1" title="my image"><img src="http://www.example.com/image.jpg" alt="my image" title="my image" class="img-fluid"></a><span class="image_inline_text">my image</span></p>'
};

var articleMdBodyOnly = ':body test without title' + "\n" +
    '## Content span' + "\n" +
    'This can span several lines if you want to.' + "\n";

var articleMd = ':title My nice title' + "\n" +
    ':teaser test' + "\n" +
    '' + "\n" +
    ':img test-image.jpg' + "\n" +
    ':aside My aside content' + "\n" +
    ':body This is my body content. [:fa-link] [:fa-link 2]\n// youtube.com #video #yolo @sorenso' + "\n" +
    '## Content span' + "\n" +
    'This can span several lines if you want to.' + "\n" +
    '### Even more titles' + "\n" +
    'With sub content belonging to sections.' + "\n" +
    '## Table of contents' + "\n" +
    '[:toc]' + "\n" +
        '```wsd' + "\n" +
        'title Central Identification Service' + "\n" +
        'Browser->VG.no: GET /' + "\n" +
        '```' + "\n" +
        // '```flot' + "\n" +
        // 'xaxis: {}' + "\n" +
        // 'yaxis: {}' + "\n" +
        // '[{"data":[[1,2]]}]' + "\n" +
        // '```' + "\n" +
    ':tag foo,bar,gomle' + "\n" +
    ':img2 test-image.jpg' + "\n" +
    ':body2 test body2' + "\n" +
    ':col2 col2.1' + "\n" +
    ':col2 col2.2' + "\n" +
    ':col2 col2.3' + "\n";

var articleObjBodyOnly = {
    tagValues: {
        toc: '',
        fact: '',
        artlist: ''
    },
    body: 'test without title' + "\n" +
        '## Content span' + "\n" +
        'This can span several lines if you want to.' + "\n",
    title: 'test without title'
};

var articleObj = { tagValues: { toc: '', fact: '', artlist: '' },
    author: 'sorenso',
    published: '2014-12-21',
    baseHref: '/simpleblog/',
    title: 'My nice title',
    img: ['test-image.jpg'],
    aside: 'My aside content',
    body: 'This is my body content. [:fa-link] [:fa-link 2]\n// youtube.com #video #yolo @sorenso\n## Content span\nThis can span ' +
        'several lines if you want to.\n### Even more titles\nWith sub content belonging to sections.\n## Table of ' +
        'contents\n[:toc]' + "\n" +
        '```wsd' + "\n" +
        'title Central Identification Service' + "\n" +
        'Browser->VG.no: GET /' + "\n" +
        '```',
        // '```flot' + "\n" +
        // 'xaxis: {}' + "\n" +
        // 'yaxis: {}' + "\n" +
        // '[{"data":[[1,2]]}]' + "\n" +
        // '```',
    img2: ['test-image.jpg'],
    body2: 'test body2',
    col: ['col1', 'col2', 'col3', 'col4'],
    col2: ['col2.1', 'col2.2', 'col2.3'],
    tag: ['foo,bar,gomle']};

var articleObjHtml = {
    tagValues: {
        toc: '<div class="toc" id="toc"><span class="toc-indent-2">&bull; <a href="#content-span">Content span</a>' +
            '</span><span class="toc-indent-3">&bull; <a href="#even-more-titles">Even more titles</a></span>' +
            '<span class="toc-indent-2">&bull; <a href="#table-of-contents">Table of contents</a></span></div>',
        fact: '',
        artlist: '<ul class="artlist"><li><a href="/simple-blog/index">Simple Blog Server</a></li></ul>',
        'artlist-block': '<div class="artlist"><div class="artlist-art"><div class="artlist-image" style="">' +
            '<a href="/simple-blog/index"><img src="/images/pix.gif" style="height:100%; width:100%;"></a></div><h3>' +
            '<a href="/simple-blog/index">Simple Blog Server</a></h3></div></div><br class="clear">',
        artlistOnepage: '<ul class="artlist"><li><a href="#/simple-blog/index">Simple Blog Server</a></li></ul>'
    },
    title: 'My nice title',
    body: '<p>This is my body content. [:fa-link] [:fa-link 2]' + "\n" +
        '// youtube.com #video #yolo @sorenso</p>' + "\n" +
        '<h2 class="toc-2"><a name="content-span" class="anchor" href="#content-span"><span class="header-link">' +
        '</span></a>Content span</h2><p>This can span several lines if you want to.</p>' + "\n" +
        '<h3 class="toc-3"><a name="even-more-titles" class="anchor" href="#even-more-titles">' +
        '<span class="header-link"></span></a>Even more titles</h3><p>With sub content belonging to sections.</p>' + "\n" +
        '<h2 class="toc-2"><a name="table-of-contents" class="anchor" href="#table-of-contents">' +
        '<span class="header-link"></span></a>Table of contents</h2><p>[:toc]' + "\n" +
        '<img src="/pho/wsd/?data=title%20Central%20Identification%20Service%0ABrowser-%3EVG.no%3A%20GET%20%2F%0A">' +
        '</p>',
        // '<p><div class="row">' + "\n",
    body2: '<p>test body</p>',
    col: [
        '<p>col1</p>\n',
        '<p>col2</p>\n',
        '<p>col3</p>\n',
        '<p>col4</p>\n'
    ],
    col2: [
        '<p>col2.1</p>',
        '<p>col2.2</p>',
        '<p>col2.3</p>'
    ],
    img: ['test-image.jpg'],
    img2: ['test-image.jpg'],
    tag: ['foo,bar,gomle'],
    author: 'sorenso',
    published: '2014-12-21',
    baseHref: '/simpleblog/'
};
// jscs:enable

var artlist = [
    {
        tagValues: [Object],
        title: 'Simple Blog Server',
        file: 'index',
        filename: './test/content/articles/simple-blog/index.md',
        baseHref: '/simple-blog/'
    }
];

buster.testCase('lib/article-util', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test article-util:': {
        'replaceMarked test': function () {
            var result = articleUtil.replaceMarked(markdownInput);
            assert.match(result, markdownOutput.header);
            assert.match(result, markdownOutput.link);
            assert.match(result, markdownOutput.image);
        },

        'formatDate 2014-12-24 17:00:00': function () {
            var result = articleUtil.formatDate('2014-12-24 17:00:00');
            assert.equals(result, 'Dec 24, 2014');
        },

        'formatDate Xmas this year': function () {
            var currentYear = strftime('%Y');
            var xmasThisYear = currentYear + '-12-24 17:00:00';
            var result = articleUtil.formatDate(xmasThisYear);
            assert.equals(result, 'Dec 24');
        },

        'formatDate wo/input': function () {
            var result = articleUtil.formatDate();
            var expectedResult = strftime('%b %e');
            assert.equals(result, expectedResult);
        },

        'rssDate w/input 2014-12-24 17:00:00': function () {
            var date = '2014-12-24 17:00:00';
            var result = articleUtil.rssDate(date);
            var expectedResult = new Date(Date.parse(date)).toUTCString();
            assert.equals(result, expectedResult);
        },

        'rssDate wo/input': function () {
            var result = articleUtil.rssDate();
            var expectedResult = new Date(Date.parse(strftime('%Y-%m-%d %H:%M:%S'))).toUTCString();
            assert.equals(result, expectedResult);
        },

        'getArticleFilename test': function () {
            var result = articleUtil.getArticleFilename('/my-category/blog-article');
            assert.equals(result, 'blog-article');
        },

        'getArticlePathRelative test': function () {
            var result = articleUtil.getArticlePathRelative('/home/simple-blog/content/articles/my-category/',
                '/home/simple-blog/content/articles/');
            assert.equals(result, '/my-category/');
        },

        'getArticlePathRelative w/missing articlePath': function () {
            var result = articleUtil.getArticlePathRelative('', '/home/simple-blog/content/articles/');
            assert.equals(result, '/');
        },

        'getArticlePathRelative w/missing contentPath': function () {
            var result = articleUtil.getArticlePathRelative('/my-category/');
            assert.equals(result, '/my-category/');
        },

        'getArticlePathRelative w/missing contentPath and articlePath': function () {
            var result = articleUtil.getArticlePathRelative();
            refute(result);
        },

        'getUrlFromRequest test': function () {
            var result = articleUtil.getUrlFromRequest({ url: '/simple-blog/index' });
            assert.equals(result, '/simple-blog/index');
        },

        'getUrlFromRequest w/path only': function () {
            var result = articleUtil.getUrlFromRequest({ url: '/simple-blog/' });
            assert.equals(result, '/simple-blog/index');
        },

        'getUrlFromRequest w/encoded strings': function () {
            var result = articleUtil.getUrlFromRequest({ url: '/simple%20blog/index' });
            assert.equals(result, '/simple blog/index');
        },

        'getUrlFromRequest wo/input': function () {
            var result = articleUtil.getUrlFromRequest({});
            refute.defined(result);
        },

        'getUrlFromRequest w/undefined input': function () {
            var result = articleUtil.getUrlFromRequest();
            refute.defined(result);
        },

        'populateArticleSections test': function () {
            var result = articleUtil.populateArticleSections(articleMd);
            assert.equals(result.title, articleObj.title);
            assert.equals(result.img, articleObj.img);
            //    console.log('result:', result.body, '<--');
            //    console.log('articleObj:', articleObj.body, '<--');
            assert.equals(result.body, articleObj.body);
        },

        'populateArticleSections without title': function () {
            var result = articleUtil.populateArticleSections(articleMdBodyOnly);
            assert.equals(result.title, articleObjBodyOnly.title);
            assert.equals(result.img, articleObjBodyOnly.img);
            assert.equals(result.body, articleObjBodyOnly.body);
        },

        'buildTableOfContents test': function () {
            var article = {
                tagValues: { toc: '', fact: '', artlist: '' },
                title: articleObj.title,
                body: articleObj.body
            };
            article.body = articleUtil.replaceMarked(article.body);
            var result = articleUtil.buildTableOfContents(article, 'body');
            refute(result);
            assert.equals(article.tagValues.toc, articleObjHtml.tagValues.toc);
        },

        'buildTableOfContents w/empty body': function () {
            var article = {};
            var result = articleUtil.buildTableOfContents(article, 'body');
            assert.equals(article, {});
            refute(result);
        },

        'buildTableOfContents w/missing headlines in body': function () {
            var article = {
                tagValues: { toc: '' },
                body: 'This is a simple body'
            };
            var result = articleUtil.buildTableOfContents(article, 'body');
            assert.equals(article.tagValues.toc, '');
            refute(result);
        },

        'formatArticleSections test': function () {
            var article = {
                tagValues: { toc: '', fact: '', artlist: '' },
                title: articleObj.title,
                body: articleObj.body,
                col: articleObj.col,
                img: articleObj.img,
                tag: articleObj.tag,
                author: articleObj.author,
                published: articleObj.published,
                baseHref: articleObj.baseHref
            };
            var result = articleUtil.formatArticleSections(article);
            assert.equals(article.title, articleObjHtml.title);
            assert.match(article.body, articleObjHtml.body);
            assert.match(article.col, articleObjHtml.col);
            assert.equals(article.img, articleObjHtml.img);
            assert.equals(article.tag, articleObjHtml.tag);
            assert.equals(article.author, articleObjHtml.author);
            assert.equals(article.published, articleObjHtml.published);
            assert.equals(article.baseHref, articleObjHtml.baseHref);
            // assert.match(article.body, htmlCoponents.flot);
            assert.match(article.body, htmlCoponents.wsd);

            refute(result);
        },

        'replaceTagsWithContent test': function () {
            var article = {
                tagValues: {
                    toc: articleObjHtml.tagValues.toc,
                    fact: '',
                    artlist: ''
                },
                title: articleObjHtml.title,
                body: articleObjHtml.body,
                col: articleObjHtml.col,
                aside: articleObjHtml.aside,
                img: articleObjHtml.img,
                tag: articleObjHtml.tag
            };
            // <span class="icon fa-link"></span>
            // <span class="comment">// youtube.com
            // <span class="hash_tag">#<a href="https://twitter.com/search?q=%23video">video</a></span>
            // <span class="hash_tag">#<a href="https://twitter.com/search?q=%23yolo">yolo</a></span>
            // <span class="user">@<a href="https://twitter.com/sorenso">sorenso</a></span>
            var result = articleUtil.replaceTagsWithContent(article);
            assert.equals(article.col, articleObjHtml.col);
            assert.match(article.body, articleObjHtml.tagValues.toc);
            assert.match(article.body, '<span class="fa fa-link"></span>');
            assert.match(article.body, '<span class="fa fa-link"></span><span class="fa fa-link"></span>');
            assert.match(article.body, '<span class="comment">// youtube.com');
            assert.match(article.body, '<span class="hash_tag">#<a href="https://twitter.com/search?q=%23video">' +
                'video</a></span>');
            assert.match(article.body, '<span class="hash_tag">#<a href="https://twitter.com/search?q=%23yolo">' +
                'yolo</a></span>');
            assert.match(article.body, '<span class="user">@<a href="https://twitter.com/sorenso">' +
                'sorenso</a></span>');
            refute(result);
        },

        'formatArtlist test': function () {
            var article = {
                tagValues: {
                    toc: articleObjHtml.tagValues.toc,
                    fact: '',
                    artlist: ''
                },
                title: articleObjHtml.title,
                body: articleObjHtml.body,
                aside: articleObjHtml.aside,
                img: articleObjHtml.img,
                tag: articleObjHtml.tag
            };
            var result = articleUtil.formatArtlist(article, artlist);
            assert.equals(article.tagValues.artlist, articleObjHtml.tagValues.artlist);
            assert.equals(article.tagValues['artlist-block'], articleObjHtml.tagValues['artlist-block']);
            assert.equals(article.tagValues.artlistOnepage, articleObjHtml.tagValues.artlistOnepage);
            refute(result);
            assert(true);
        }

    }
});
