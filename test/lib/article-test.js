'use strict';

var buster = require('buster'),
    assert = buster.assert,
    refute = buster.refute,
    when   = require('when'),
    content_path = __dirname + '/../content/articles/',
    article = require('../../lib/article')({
        logger: {
            log: function () {
            },
            err: function () {
            },
        },
        filename: content_path + 'simple-blog/index',
        article_path: 'simple-blog/',
        content_path: content_path
    }),
    article_not_found = require('../../lib/article')({
        logger: {
            log: function () {
            },
            err: function () {
            },
        },
        filename: content_path + 'simple-blog/index_not_found',
        article_path: 'simple-blog/',
        content_path: content_path
    }),
    article_wip_not_found = require('../../lib/article')({
        logger: {
            log: function () {
            },
            err: function () {
            },
        },
        filename: content_path + 'simple-blog/_index_wip_not_found',
        article_path: 'simple-blog/',
        content_path: content_path
    }),
    article_wip = require('../../lib/article')({
        logger: {
            log: function () {
            },
            err: function () {
            },
        },
        filename: content_path + 'simple-blog/_index_wip',
        article_path: 'simple-blog/',
        content_path: content_path
    });

var catlist = [
    {
        dev: 16777219,
        mode: 16877,
        nlink: 3,
        uid: 501,
        gid: 20,
        rdev: 0,
        blksize: 4096,
        ino: 37773547,
        size: 102,
        blocks: 0,
        atime: 'Thu Sep 18 2014 22:26:54 GMT+0200 (CEST)',
        mtime: 'Thu Sep 18 2014 22:03:41 GMT+0200 (CEST)',
        ctime: 'Thu Sep 18 2014 22:03:41 GMT+0200 (CEST)',
        name: 'simple-blog',
        type: 'directory'
    }
];
var artlist = [
    {
        tag_values: [Object],
        title: 'Simple Blog Server',
        file: '/index',
        filename: '/Users/sorenso/PhpstormProjects/simple-blog/test/content/articles/simple-blog/index.md',
        base_href: 'simple-blog/'
    }
];
var art = {
    tag_values: {
        toc: '<div class="toc" id="toc"><span class="toc-indent-1">&bull; <a href="#simple-title-1">Simple title 1</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-1">&bull; <a href="#simple-title-2">Simple title 2</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-3">&bull; <a href="#simple-sub-sub-title-1">Simple sub sub title 1</a></span></div>',
        fact: '',
        artlist: '<ul class="artlist"><li><a href="simple-blog/index">Simple Blog Server</a></li></ul>',
        menu: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="/simple-blog/">simple-blog</a></li></ul>',
        menu_onepage: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="#simple-blog">simple-blog</a></li></ul>',
        'artlist-block': '<div class="artlist"><div class="artlist-art"><h3><a href="simple-blog/index">Simple Blog Server</a></h3></div></div><br class="clear">',
        artlist_onepage: '<ul class="artlist"><li><a href="#/index">Simple Blog Server</a></li></ul>'
    },
    title: 'Simple Blog Server',
    file: undefined,
    filename: '<p>/Users/sorenso/PhpstormProjects/simple-blog/test/content/articles/simple-blog/index.md</p>\n',
    tag: [ 'simple,blog' ],
    body: '<h1 class="toc-1"><a name="simple-title-1" class="anchor" href="#simple-title-1"><span class="header-link"></span></a>Simple title 1</h1><h2 class="toc-2"><a name="simple-sub-title-1" class="anchor" href="#simple-sub-title-1"><span class="header-link"></span></a>Simple sub title 1</h2><p>My simple blog text.</p>\n<h1 class="toc-1"><a name="simple-title-2" class="anchor" href="#simple-title-2"><span class="header-link"></span></a>Simple title 2</h1><h2 class="toc-2"><a name="simple-sub-title-1" class="anchor" href="#simple-sub-title-1"><span class="header-link"></span></a>Simple sub title 1</h2><h3 class="toc-3"><a name="simple-sub-sub-title-1" class="anchor" href="#simple-sub-sub-title-1"><span class="header-link"></span></a>Simple sub sub title 1</h3><pre><code class="lang-javascript">\nconsole.<span class="hljs-built_in">log</span>(<span class="hljs-string">\'hello world\'</span>);\n</code></pre>\n<p><p class="image_inline"><img src="simple-blog.jpg?w=600" alt="Simple blog image" title="My image text"></p></p>\n<p><div class="toc" id="toc"><span class="toc-indent-1">&bull; <a href="#simple-title-1">Simple title 1</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-1">&bull; <a href="#simple-title-2">Simple title 2</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-3">&bull; <a href="#simple-sub-sub-title-1">Simple sub sub title 1</a></span></div></p>\n'
};
var art_not_found = {
    error: '404: Not found.',
    article: {
        file: undefined,
        filename: '<p>_index_wip_not_found.md</p>\n',
        base_href: undefined,
        tag_values: {
            menu: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="/simple-blog/">simple-blog</a></li></ul>',
            menu_onepage: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="#simple-blog">simple-blog</a></li></ul>',
            artlist: '<ul class="artlist"><li><a href="simple-blog/index">Simple Blog Server</a></li></ul>',
            'artlist-block': '<div class="artlist"><div class="artlist-art"><h3><a href="simple-blog//index">Simple Blog Server</a></h3></div></div><br class="clear">',
            artlist_onepage: '<ul class="artlist"><li><a href="#/index">Simple Blog Server</a></li></ul>'
        },
        catlist:
            [ { dev: 16777219,
                mode: 16877,
                nlink: 3,
                uid: 501,
                gid: 20,
                rdev: 0,
                blksize: 4096,
                ino: 37773547,
                size: 102,
                blocks: 0,
                name: 'simple-blog',
                type: 'directory' } ],
        artlist:
            [ { tag_values: [Object],
                title: 'Simple Blog Server',
                file: '/index',
                filename: '/Users/sorenso/PhpstormProjects/simple-blog/test/content/articles/simple-blog/index.md',
                base_href: 'simple-blog/' } ]
    }
};
var art_wip = { tag_values: { toc: '<div class="toc" id="toc"><span class="toc-indent-1">&bull; <a href="#simple-title-1-wip">Simple title 1 wip</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-1">&bull; <a href="#simple-title-2">Simple title 2</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-3">&bull; <a href="#simple-sub-sub-title-1">Simple sub sub title 1</a></span></div>',
    fact: '',
    artlist: '<ul class="artlist"><li><a href="simple-blog/index">Simple Blog Server</a></li></ul>',
    menu: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="/simple-blog/">simple-blog</a></li></ul>',
    menu_onepage: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="#simple-blog">simple-blog</a></li></ul>',
    'artlist-block': '<div class="artlist"><div class="artlist-art"><h3><a href="simple-blog//index">Simple Blog Server</a></h3></div></div><br class="clear">',
    artlist_onepage: '<ul class="artlist"><li><a href="#/index">Simple Blog Server</a></li></ul>' },
    published: '<p>2014-09-01</p>\n',
    tag: [ 'simple,blog,wip' ],
    title: 'Simple Blog Server WIP',
    img: [ 'simple-blog.jpg' ],
    body: '<h1 class="toc-1"><a name="simple-title-1-wip" class="anchor" href="#simple-title-1-wip"><span class="header-link"></span></a>Simple title 1 wip</h1><h2 class="toc-2"><a name="simple-sub-title-1" class="anchor" href="#simple-sub-title-1"><span class="header-link"></span></a>Simple sub title 1</h2><p>My simple blog text.</p>\n<h1 class="toc-1"><a name="simple-title-2" class="anchor" href="#simple-title-2"><span class="header-link"></span></a>Simple title 2</h1><h2 class="toc-2"><a name="simple-sub-title-1" class="anchor" href="#simple-sub-title-1"><span class="header-link"></span></a>Simple sub title 1</h2><h3 class="toc-3"><a name="simple-sub-sub-title-1" class="anchor" href="#simple-sub-sub-title-1"><span class="header-link"></span></a>Simple sub sub title 1</h3><pre><code class="lang-javascript">\nconsole.<span class="hljs-built_in">log</span>(<span class="hljs-string">\'hello world\'</span>);\n</code></pre>\n<p><p class="image_inline"><img src="simple-blog.jpg?w=600" alt="Simple blog image" title="My image text"></p></p>\n<p><div class="toc" id="toc"><span class="toc-indent-1">&bull; <a href="#simple-title-1-wip">Simple title 1 wip</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-1">&bull; <a href="#simple-title-2">Simple title 2</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-3">&bull; <a href="#simple-sub-sub-title-1">Simple sub sub title 1</a></span></div></p>\n',
    filename: '<p>/Users/sorenso/PhpstormProjects/simple-blog/test/lib/../content/articles/simple-blog/_index_wip.md</p>\n'
};

buster.testCase('lib/article', {
    setUp: function () {
    },
    tearDown: function () {
        delete require.cache[require.resolve('../../lib/article')];
    },
    'Test article:': {
        'catlist': function (done) {
            when( article.catlist({}) )
                .done(function (obj) {
                    assert.equals(catlist[0].name, obj.catlist[0].name);
                    assert.equals(catlist[0].type, obj.catlist[0].type);
                    done();
                });
        },

        'artlist': function (done) {
            when( article.artlist({}) )
                .done(function (obj) {
                    assert.equals(artlist[0].title, obj.artlist[0].title);
                    assert.equals(artlist[0].base_href, obj.artlist[0].base_href);
                    assert.equals(artlist[0].file, obj.artlist[0].file);
                    done();
                });
        },

        'article': function (done) {
            when( article.article({
                artlist: artlist,
                catlist: catlist,
                content_path: content_path
            }) )
                .done(function (article) {
                    assert.equals(art.tag_values.toc, article.tag_values.toc);
                    assert.equals(art.tag_values.artlist, article.tag_values.artlist);
                    assert.equals(art.tag_values.artlist_onepage, article.tag_values.artlist_onepage);
                    assert.equals(art.title, article.title);
                    assert.equals(art.filename, article.filename);
                    assert.equals(art.tag, article.tag);
                    assert.equals(art.body, article.body);
                    delete require.cache[require.resolve('../../lib/article')];
                    done();
                });

        },

        'article not found': function (done) {
            when( article_not_found.article({
                artlist: artlist,
                catlist: catlist,
                content_path: content_path
            }) )
                .done(function (article) {
                    assert.equals(art.tag_values.toc, article.tag_values.toc);
                    assert.equals(art.tag_values.artlist, article.tag_values.artlist);
                    assert.equals(art.tag_values.artlist_onepage, article.tag_values.artlist_onepage);
                    assert.equals(art.title, article.title);
                    assert.equals(art.filename, article.filename);
                    assert.equals(art.tag, article.tag);
                    assert.equals(art.body, article.body);
                    delete require.cache[require.resolve('../../lib/article')];
                    done();
                });

        },

        'article wip': function (done) {
            when( article_wip.article({
                artlist: artlist,
                catlist: catlist,
                content_path: content_path
            }) )
                .done(function (article) {
//                    console.log(article);
                    assert.equals(art_wip.tag_values.toc, article.tag_values.toc);
                    assert.equals(art_wip.tag_values.artlist, article.tag_values.artlist);
                    assert.equals(art_wip.tag_values.artlist_onepage, article.tag_values.artlist_onepage);
                    assert.equals(art_wip.title, article.title);
                    assert.equals(art_wip.filename, article.filename);
                    assert.equals(art_wip.tag, article.tag);
                    assert.equals(art_wip.body, article.body);
                    delete require.cache[require.resolve('../../lib/article')];
                    done();
                }, function (err) {
                    console.log(err);
                });

        },

        'article wip not found': function (done) {
            when( article_wip_not_found.article({
                artlist: artlist,
                catlist: catlist,
                content_path: content_path
            }) )
                .done(function (article) {
                    assert(false);
                    delete require.cache[require.resolve('../../lib/article')];
                    done();
                }, function (err) {
//                    console.log(err.article);
                    var article = err.article;
                    assert.equals('404: Not found.', err.error);
                    assert.equals(art.tag_values.artlist, article.tag_values.artlist);
                    assert.equals(art.tag_values.artlist_onepage, article.tag_values.artlist_onepage);
                    assert.equals(artlist[0].title, article.artlist[0].title);
                    assert.equals(artlist[0].base_href, article.artlist[0].base_href);
                    assert.equals(artlist[0].file, article.artlist[0].file);

//                    console.log(err.error);
                    done();
                });

        }




    }
});


