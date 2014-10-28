'use strict';

var buster = require('buster'),
    assert = buster.assert,
    refute = buster.refute,
    when   = require('when'),
    article_path = '/simple-blog/',
    category = require('../../lib/category')({
        logger: {
            log: function () {
            },
            err: function () {
            },
        },
        config: {
            adapter: {
                markdown: {
                    content_path: __dirname + '/../content/articles/',
                    photo_path: __dirname + '/../content/images/',
                    max_articles: 500,
                }
            }
        }
    }),
    article = require('../../lib/article')({
        logger: {
            log: function () {
            },
            err: function () {
            },
        },
        request_url: '/simple-blog/index',
        domain: 'www.mydomain.no',
        protocol: 'http',
        max_articles_in_artlist : 500,
        config: {
            adapter: {
                markdown: {
                    content_path: __dirname + '/../content/articles/',
                    photo_path: __dirname + '/../content/images/',
                    max_articles: 500,
                }
            }
        }
    }),
    article_not_found = require('../../lib/article')({
        logger: {
            log: function () {
            },
            err: function () {
            },
        },
        request_url: '/simple-blog/index_not_found',
        config: {
            adapter: {
                markdown: {
                    content_path: __dirname + '/../content/articles/',
                    photo_path: __dirname + '/../content/images/',
                    max_articles: 500,
                }
            }
        }
    }),
    article_wip_not_found = require('../../lib/article')({
        logger: {
            log: function () {
            },
            err: function () {
            },
        },
        request_url: '/simple-blog/_index_wip_not_found',
        config: {
            adapter: {
                markdown: {
                    content_path: __dirname + '/../content/articles/',
                    photo_path: __dirname + '/../content/images/',
                    max_articles: 500,
                }
            }
        }
    }),
    article_wip = require('../../lib/article')({
        logger: {
            log: function () {
            },
            err: function () {
            },
        },
        request_url: '/simple-blog/_index_wip',
        config: {
            adapter: {
                markdown: {
                    content_path: __dirname + '/../content/articles/',
                    photo_path: __dirname + '/../content/images/',
                    max_articles: 500,
                }
            }
        }
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
        file: 'index',
        filename: './test/content/articles/simple-blog/index.md',
        base_href: '/simple-blog/'
    }
];
var art = {
    tag_values: {
        toc: '<div class="toc" id="toc"><span class="toc-indent-1">&bull; <a href="#simple-title-1">Simple title 1</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-1">&bull; <a href="#simple-title-2">Simple title 2</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-3">&bull; <a href="#simple-sub-sub-title-1">Simple sub sub title 1</a></span></div>',
        fact: '',
        artlist: '<ul class="artlist"><li><a href="/simple-blog/index">Simple Blog Server</a></li></ul>',
        menu: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="/simple-blog/">simple-blog</a></li></ul>',
        menu_onepage: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="#simple-blog">simple-blog</a></li></ul>',
        'artlist-block': '<div class="artlist"><div class="artlist-art"><h3><a href="/simple-blog/index">Simple Blog Server</a></h3></div></div><br class="clear">',
        artlist_onepage: '<ul class="artlist"><li><a href="#/simple-blog/index">Simple Blog Server</a></li></ul>'
    },
    title: 'Simple Blog Server',
    file: 'index',
    filename: '<p>./test/content/articles/simple-blog/index.md</p>\n',
    tag: [ 'simple,blog' ],
    body: '<h1 class="toc-1"><a name="simple-title-1" class="anchor" href="#simple-title-1"><span class="header-link"></span></a>Simple title 1</h1><h2 class="toc-2"><a name="simple-sub-title-1" class="anchor" href="#simple-sub-title-1"><span class="header-link"></span></a>Simple sub title 1</h2><p>My simple blog text.</p>\n<h1 class="toc-1"><a name="simple-title-2" class="anchor" href="#simple-title-2"><span class="header-link"></span></a>Simple title 2</h1><h2 class="toc-2"><a name="simple-sub-title-1" class="anchor" href="#simple-sub-title-1"><span class="header-link"></span></a>Simple sub title 1</h2><h3 class="toc-3"><a name="simple-sub-sub-title-1" class="anchor" href="#simple-sub-sub-title-1"><span class="header-link"></span></a>Simple sub sub title 1</h3><pre><code class="lang-javascript">\nconsole.<span class="hljs-built_in">log</span>(<span class="hljs-string">\'hello world\'</span>);\n</code></pre>\n<p><p class="image_inline"><img src="simple-blog.jpg?w=600" alt="Simple blog image" title="My image text"></p></p>\n<p><div class="toc" id="toc"><span class="toc-indent-1">&bull; <a href="#simple-title-1">Simple title 1</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-1">&bull; <a href="#simple-title-2">Simple title 2</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-3">&bull; <a href="#simple-sub-sub-title-1">Simple sub sub title 1</a></span></div></p>\n',
    body2: '<p>This is a test of body 2.\n<div class="toc" id="toc"><span class="toc-indent-1">&bull; <a href="#simple-title-1">Simple title 1</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-1">&bull; <a href="#simple-title-2">Simple title 2</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-3">&bull; <a href="#simple-sub-sub-title-1">Simple sub sub title 1</a></span></div></p>\n',
    body3: '<p>This is a test of body 3.\n<div class="toc" id="toc"><span class="toc-indent-1">&bull; <a href="#simple-title-1">Simple title 1</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-1">&bull; <a href="#simple-title-2">Simple title 2</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-3">&bull; <a href="#simple-sub-sub-title-1">Simple sub sub title 1</a></span></div></p>\n',
    body4: '<p>This is a test of body 4.\n<div class="toc" id="toc"><span class="toc-indent-1">&bull; <a href="#simple-title-1">Simple title 1</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-1">&bull; <a href="#simple-title-2">Simple title 2</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-3">&bull; <a href="#simple-sub-sub-title-1">Simple sub sub title 1</a></span></div></p>\n',
    body5: '<p>This is a test of body 5.\n<div class="toc" id="toc"><span class="toc-indent-1">&bull; <a href="#simple-title-1">Simple title 1</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-1">&bull; <a href="#simple-title-2">Simple title 2</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-3">&bull; <a href="#simple-sub-sub-title-1">Simple sub sub title 1</a></span></div></p>\n',

};
var art_not_found = {
    error: '404: Not found.',
    article: {
        file: undefined,
        filename: '<p>_index_wip_not_found.md</p>\n',
        base_href: '/',
        tag_values: {
            menu: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="/simple-blog/">simple-blog</a></li></ul>',
            menu_onepage: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="#simple-blog">simple-blog</a></li></ul>',
            artlist: '<ul class="artlist"><li><a href="/simple-blog/index">Simple Blog Server</a></li></ul>',
            'artlist-block': '<div class="artlist"><div class="artlist-art"><h3><a href="/simple-blog//index">Simple Blog Server</a></h3></div></div><br class="clear">',
            artlist_onepage: '<ul class="artlist"><li><a href="#/simple-blog/index">Simple Blog Server</a></li></ul>'
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
                file: 'index',
                filename: './test/content/articles/simple-blog/index.md',
                base_href: '/simple-blog/' } ]
    }
};
var art_wip = { tag_values: { toc: '<div class="toc" id="toc"><span class="toc-indent-1">&bull; <a href="#simple-title-1-wip">Simple title 1 wip</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-1">&bull; <a href="#simple-title-2">Simple title 2</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-3">&bull; <a href="#simple-sub-sub-title-1">Simple sub sub title 1</a></span></div>',
    fact: '',
    artlist: '<ul class="artlist"><li><a href="/simple-blog/index">Simple Blog Server</a></li></ul>',
    menu: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="/simple-blog/">simple-blog</a></li></ul>',
    menu_onepage: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="#simple-blog">simple-blog</a></li></ul>',
    'artlist-block': '<div class="artlist"><div class="artlist-art"><h3><a href="/simple-blog//index">Simple Blog Server</a></h3></div></div><br class="clear">',
    artlist_onepage: '<ul class="artlist"><li><a href="#/simple-blog/index">Simple Blog Server</a></li></ul>' },
    published: '<p>2014-09-01</p>\n',
    tag: [ 'simple,blog,wip' ],
    title: 'Simple Blog Server WIP',
    img: [ 'simple-blog.jpg' ],
    body: '<h1 class="toc-1"><a name="simple-title-1-wip" class="anchor" href="#simple-title-1-wip"><span class="header-link"></span></a>Simple title 1 wip</h1><h2 class="toc-2"><a name="simple-sub-title-1" class="anchor" href="#simple-sub-title-1"><span class="header-link"></span></a>Simple sub title 1</h2><p>My simple blog text.</p>\n<h1 class="toc-1"><a name="simple-title-2" class="anchor" href="#simple-title-2"><span class="header-link"></span></a>Simple title 2</h1><h2 class="toc-2"><a name="simple-sub-title-1" class="anchor" href="#simple-sub-title-1"><span class="header-link"></span></a>Simple sub title 1</h2><h3 class="toc-3"><a name="simple-sub-sub-title-1" class="anchor" href="#simple-sub-sub-title-1"><span class="header-link"></span></a>Simple sub sub title 1</h3><pre><code class="lang-javascript">\nconsole.<span class="hljs-built_in">log</span>(<span class="hljs-string">\'hello world\'</span>);\n</code></pre>\n<p><p class="image_inline"><img src="simple-blog.jpg?w=600" alt="Simple blog image" title="My image text"></p></p>\n<p><div class="toc" id="toc"><span class="toc-indent-1">&bull; <a href="#simple-title-1-wip">Simple title 1 wip</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-1">&bull; <a href="#simple-title-2">Simple title 2</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-3">&bull; <a href="#simple-sub-sub-title-1">Simple sub sub title 1</a></span></div></p>\n',
    filename: '<p>./simple-blog/test/lib/../content/articles/simple-blog/_index_wip.md</p>\n'
};

buster.testCase('lib/article', {
    setUp: function () {
    },
    tearDown: function () {
        delete require.cache[require.resolve('../../lib/article')];
    },
    'Test article:': {
        'catlist': function (done) {
            when( category.list('/') )
                .done(function (category_list) {
                    assert.equals(catlist[0].name, category_list[0].name);
                    assert.equals(catlist[0].type, category_list[0].type);
                    done();
                }, function (err) {
                    console.log(err);
                });
        },

        'artlist': function (done) {
            when( article.list(article_path) )
                .done(function (article_list) {
                    assert.equals(artlist[0].title, article_list[0].title);
                    assert.equals(artlist[0].base_href, article_list[0].base_href);
                    assert.equals(artlist[0].file, article_list[0].file);
                    done();
                });
        },

        'article': function (done) {
            when( article.load({
                artlist: artlist,
                catlist: catlist
            }) )
                .done(function (article) {
                    assert.equals(art.tag_values.toc, article.tag_values.toc);
                    assert.equals(art.tag_values.artlist, article.tag_values.artlist);
                    assert.equals(art.tag_values.artlist_onepage, article.tag_values.artlist_onepage);
                    assert.equals(art.title, article.title);
                    assert.equals(art.tag, article.tag);
                    assert.match(article.body, art.body);
                    assert.equals(art.body2, article.body2);
                    assert.equals(art.body3, article.body3);
                    assert.equals(art.body4, article.body4);
                    assert.equals(art.body5, article.body5);

                    refute(article.body6);
                    refute(article.body7);
                    refute(article.body8);
                    refute(article.body9);
                    refute(article.aside6);
                    refute(article.aside7);
                    refute(article.aside8);
                    refute(article.aside9);

                    delete require.cache[require.resolve('../../lib/article')];
                    done();
                });

        },

        'article not found': function (done) {
            when( article_not_found.load({
                artlist: artlist,
                catlist: catlist,
            }) )
                .done(function (article) {
                    refute(article.title);
                    delete require.cache[require.resolve('../../lib/article')];
                    done();
                }, function (response) {
                    assert.equals(404, response.statusCode);
                    assert.equals(art_wip.tag_values.artlist, response.article.tag_values.artlist);
                    assert.equals(art_wip.tag_values.artlist_onepage, response.article.tag_values.artlist_onepage);
                    assert.equals(art_wip.tag_values.menu, response.article.tag_values.menu);
                    done();
                });

        },

        'article wip': function (done) {
            when( article_wip.load({
                artlist: artlist,
                catlist: catlist,
            }) )
                .done(function (article) {
                    assert.equals(art_wip.tag_values.toc, article.tag_values.toc);
                    assert.equals(art_wip.tag_values.artlist, article.tag_values.artlist);
                    assert.equals(art_wip.tag_values.artlist_onepage, article.tag_values.artlist_onepage);
                    assert.equals(art_wip.title, article.title);
                    assert.equals(art_wip.tag, article.tag);
                    assert.equals(art_wip.body, article.body);
                    delete require.cache[require.resolve('../../lib/article')];
                    done();
                }, function (err) {
                    console.log(err);
                });

        },

        'article wip not found': function (done) {
            when( article_wip_not_found.load({
                artlist: artlist,
                catlist: catlist,
            }) )
                .done(function (article) {
                    assert(false);
                    delete require.cache[require.resolve('../../lib/article')];
                    done();
                }, function (response) {
                    assert.equals(404, response.statusCode);
                    assert.equals(art_wip.tag_values.artlist, response.article.tag_values.artlist);
                    assert.equals(art_wip.tag_values.artlist_onepage, response.article.tag_values.artlist_onepage);
                    assert.equals(art_wip.tag_values.menu, response.article.tag_values.menu);
                    done();
                });

        },


        'sitemap': function (done) {
            when( article.sitemap({
                artlist: artlist,
                catlist: catlist
            }) )
                .done(function (xml) {
                    var parseString = require('xml2js').parseString;
                    parseString(xml, function (err, result) {
                        var urls = result.urlset.url;
                        assert.equals('http://www.mydomain.no/simple-blog/', urls[0].loc[0]);
                        assert.equals('weekly', urls[0].changefreq[0]);
                        assert.equals('0.85', urls[0].priority[0]);

                        assert.equals('http://www.mydomain.no/simple-blog/index', urls[1].loc[0]);
                        assert.equals('weekly', urls[1].changefreq[0]);
                        assert.equals('0.5', urls[1].priority[0]);
                        done();
                    });
                    delete require.cache[require.resolve('../../lib/article')];
                }, function (err) {
                    console.log(err);
                });

        },




    }
});


