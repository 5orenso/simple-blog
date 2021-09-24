'use strict';

var buster = require('buster'),
    assert = buster.assert,
    refute = buster.refute,
    articlePath = '/simple-blog/',
    Category = require('../../lib/category'),
    category = new Category({
        logger: {
            log: function () {
            },
            err: function () {
            }
        },
        config: {
            adapter: {
                current: 'markdown',
                markdown: {
                    contentPath: __dirname + '/../content/articles/',
                    photoPath: __dirname + '/../content/images/',
                    maxArticles: 500
                }
            }
        }
    }),
    Article = require('../../lib/article'),
    article = new Article({
        logger: {
            log: function () {
            },
            err: function () {
            }
        },
        domain: 'www.mydomain.no',
        protocol: 'http',
        maxArticlesInArtlist: 500,
        config: {
            adapter: {
                current: 'markdown',
                markdown: {
                    contentPath: __dirname + '/../content/articles/',
                    photoPath: __dirname + '/../content/images/',
                    maxArticles: 500
                }
            }
        }
    }),
    articleNotFound = new Article({
        logger: {
            log: function () {
            },
            err: function () {
            }
        },
        config: {
            adapter: {
                current: 'markdown',
                markdown: {
                    contentPath: __dirname + '/../content/articles/',
                    photoPath: __dirname + '/../content/images/',
                    maxArticles: 500
                }
            }
        }
    }),
    articleWipNotFound = new Article({
        logger: {
            log: function () {
            },
            err: function () {
            }
        },
        config: {
            adapter: {
                current: 'markdown',
                markdown: {
                    contentPath: __dirname + '/../content/articles/',
                    photoPath: __dirname + '/../content/images/',
                    maxArticles: 500
                }
            }
        }
    }),
    articleWip = new Article({
        logger: {
            log: function () {
            },
            err: function () {
            }
        },
        config: {
            current: 'markdown',
            adapter: {
                markdown: {
                    contentPath: __dirname + '/../content/articles/',
                    photoPath: __dirname + '/../content/images/',
                    maxArticles: 500
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
        tagValues: [Object],
        title: 'Simple Blog Server',
        file: 'index',
        filename: './test/content/articles/simple-blog/index.md',
        baseHref: '/simple-blog/'
    }
];
// jscs:disable
var art = {
    tagValues: {
        toc: '<div class="toc" id="toc"><span class="toc-indent-1">&bull; <a href="#simple-title-1">' +
            'Simple title 1</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">' +
            'Simple sub title 1</a></span><span class="toc-indent-1">&bull; <a href="#simple-title-2">' +
            'Simple title 2</a></span><span class="toc-indent-2">&bull; <a href="#simple-sub-title-1">' +
            'Simple sub title 1</a></span><span class="toc-indent-3">&bull; <a href="#simple-sub-sub-title-1">' +
            'Simple sub sub title 1</a></span></div>',
        fact: '',
        artlist: '<ul class="artlist"><li><a href="/simple-blog/index">Simple Blog Server</a></li></ul>',
        menu: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="/simple-blog/">' +
            'simple-blog</a></li></ul>',
        menuOnepage: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="#simple-blog">' +
            'simple-blog</a></li></ul>',
        'artlist-block': '<div class="artlist"><div class="artlist-art"><h3><a href="/simple-blog/index">' +
            'Simple Blog Server</a></h3></div></div><br class="clear">',
        artlistOnepage: '<ul class="artlist"><li><a href="#/simple-blog/index">Simple Blog Server</a></li></ul>'
    },
    title: 'Simple Blog Server',
    file: 'index',
    filename: '<p>./test/content/articles/simple-blog/index.md</p>' + "\n",
    tag: ['simple,blog'],
    body: '<h1 class="toc-1"><a name="simple-title-1" class="anchor" href="#simple-title-1">' +
        '<span class="header-link"></span></a>Simple title 1</h1><h2 class="toc-2"><a ' +
        'name="simple-sub-title-1" class="anchor" href="#simple-sub-title-1"><span class="header-link">' +
        '</span></a>Simple sub title 1</h2><p>My simple blog text.</p>\n<h1 class="toc-1">' +
        '<a name="simple-title-2" class="anchor" href="#simple-title-2"><span class="header-link"></span></a>' +
        'Simple title 2</h1><h2 class="toc-2"><a name="simple-sub-title-1" class="anchor" ' +
        'href="#simple-sub-title-1"><span class="header-link"></span></a>Simple sub title 1</h2>' +
        '<h3 class="toc-3"><a name="simple-sub-sub-title-1" class="anchor" href="#simple-sub-sub-title-1">' +
        '<span class="header-link"></span></a>Simple sub sub title 1</h3>',
    body2: '<p>This is a test of body 2.\n<div class="toc" id="toc"><span class="toc-indent-1">&bull; ' +
        '<a href="#simple-title-1">Simple title 1</a></span><span class="toc-indent-2">&bull; ' +
        '<a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-1">&bull; ' +
        '<a href="#simple-title-2">Simple title 2</a></span><span class="toc-indent-2">&bull; ' +
        '<a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-3">&bull; ' +
        '<a href="#simple-sub-sub-title-1">Simple sub sub title 1</a></span></div></p>' + "\n",
    body3: '<p>This is a test of body 3.\n<div class="toc" id="toc"><span class="toc-indent-1">&bull; ' +
        '<a href="#simple-title-1">Simple title 1</a></span><span class="toc-indent-2">&bull; ' +
        '<a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-1">&bull; ' +
        '<a href="#simple-title-2">Simple title 2</a></span><span class="toc-indent-2">&bull; ' +
        '<a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-3">&bull; ' +
        '<a href="#simple-sub-sub-title-1">Simple sub sub title 1</a></span></div></p>' + "\n",
    body4: '<p>This is a test of body 4.\n<div class="toc" id="toc"><span class="toc-indent-1">&bull; ' +
        '<a href="#simple-title-1">Simple title 1</a></span><span class="toc-indent-2">&bull; ' +
        '<a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-1">&bull; ' +
        '<a href="#simple-title-2">Simple title 2</a></span><span class="toc-indent-2">&bull; ' +
        '<a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-3">&bull; ' +
        '<a href="#simple-sub-sub-title-1">Simple sub sub title 1</a></span></div></p>' + "\n",
    body5: '<p>This is a test of body 5.\n<div class="toc" id="toc"><span class="toc-indent-1">&bull; ' +
        '<a href="#simple-title-1">Simple title 1</a></span><span class="toc-indent-2">&bull; ' +
        '<a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-1">&bull; ' +
        '<a href="#simple-title-2">Simple title 2</a></span><span class="toc-indent-2">&bull; ' +
        '<a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-3">&bull; ' +
        '<a href="#simple-sub-sub-title-1">Simple sub sub title 1</a></span></div></p>' + "\n"

};

var artWip = { tagValues: { toc: '<div class="toc" id="toc"><span class="toc-indent-1">&bull; ' +
    '<a href="#simple-title-1-wip">Simple title 1 wip</a></span><span class="toc-indent-2">&bull; ' +
    '<a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-1">&bull; ' +
    '<a href="#simple-title-2">Simple title 2</a></span><span class="toc-indent-2">&bull; ' +
    '<a href="#simple-sub-title-1">Simple sub title 1</a></span><span class="toc-indent-3">&bull; ' +
    '<a href="#simple-sub-sub-title-1">Simple sub sub title 1</a></span></div>',
    fact: '',
    artlist: '<ul class="artlist"><li><a href="/simple-blog/index">Simple Blog Server</a></li></ul>',
    menu: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="/simple-blog/">simple-blog</a>' +
        '</li></ul>',
    menuOnepage: '<ul class="catlist"><li><a href="/">Frontpage</a></li><li><a href="#simple-blog">simple-blog</a>' +
        '</li></ul>',
    'artlist-block': '<div class="artlist"><div class="artlist-art"><h3><a href="/simple-blog//index">Simple Blog ' +
        'Server</a></h3></div></div><br class="clear">',
    artlistOnepage: '<ul class="artlist"><li><a href="#/simple-blog/index">Simple Blog Server</a></li></ul>' },
    published: '<p>2014-09-01</p>' + "\n",
    tag: ['simple,blog,wip'],
    title: 'Simple Blog Server WIP',
    img: ['simple-blog.jpg'],
    body: '<h1 class="toc-1"><a name="simple-title-1-wip" class="anchor" href="#simple-title-1-wip">' +
        '<span class="header-link"></span></a>Simple title 1 wip</h1><h2 class="toc-2"><a name="simple-sub-title-1" ' +
        'class="anchor" href="#simple-sub-title-1"><span class="header-link"></span></a>Simple sub title 1</h2><p>' +
        'My simple blog text.</p>\n<h1 class="toc-1"><a name="simple-title-2" class="anchor" ' +
        'href="#simple-title-2"><span class="header-link"></span></a>Simple title 2</h1><h2 class="toc-2"><a ' +
        'name="simple-sub-title-1" class="anchor" href="#simple-sub-title-1"><span class="header-link"></span>' +
        '</a>Simple sub title 1</h2><h3 class="toc-3"><a name="simple-sub-sub-title-1" class="anchor" ' +
        'href="#simple-sub-sub-title-1"><span class="header-link"></span></a>Simple sub sub title 1</h3>',
    filename: '<p>./simple-blog/test/lib/../content/articles/simple-blog/_index_wip.md</p>' + "\n"
};
// jscs:enable

buster.testCase('lib/article', {
    setUp: function () {
    },
    tearDown: function () {
        //delete require.cache[require.resolve('../../lib/article')];
    },
    'Test article:': {
        'catlist test': function (done) {
            category.list('/')
                .then(function (categoryList) {
                    assert.equals(categoryList[0].name, catlist[0].name);
                    assert.equals(categoryList[0].type, catlist[0].type);
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                });
        },

        'artlist test': function (done) {
            article.list(articlePath)
                .then(function (articleList) {
                    assert.equals(articleList[0].title, artlist[0].title);
                    assert.equals(articleList[0].baseHref, artlist[0].baseHref);
                    assert.equals(articleList[0].file, artlist[0].file);
                    done();
                });
        },

        'article test': function (done) {
            article.load({
                requestUrl: '/simple-blog/index',
                artlist: artlist,
                catlist: catlist
            })
                .then(function (article) {
                    // assert.equals(article.tagValues.toc, art.tagValues.toc);
                    // assert.equals(article.tagValues.artlist, art.tagValues.artlist);
                    // assert.equals(article.tagValues.artlistOnepage, art.tagValues.artlistOnepage);
                    assert.equals(article.title, art.title);
                    assert.equals(article.tag, art.tag);
                    // assert.match(article.body, art.body);
                    // assert.equals(article.body2, art.body2);
                    // assert.equals(article.body3, art.body3);
                    // assert.equals(article.body4, art.body4);
                    // assert.equals(article.body5, art.body5);

                    refute(article.body6);
                    refute(article.body7);
                    refute(article.body8);
                    refute(article.body9);
                    refute(article.aside6);
                    refute(article.aside7);
                    refute(article.aside8);
                    refute(article.aside9);

                    //delete require.cache[require.resolve('../../lib/article')];
                    done();
                });

        },

        'article not found': function (done) {
            articleNotFound.load({
                requestUrl: '/simple-blog/index_not_found',
                artlist: artlist,
                catlist: catlist
            })
                .then(function (article) {
                    refute(article.title);
                    //delete require.cache[require.resolve('../../lib/article')];
                    done();
                })
                .catch(function (response) {
                    assert.equals(response.statusCode, 404);
                    assert.equals(response.article.tagValues.artlist, artWip.tagValues.artlist);
                    assert.equals(response.article.tagValues.artlistOnepage, artWip.tagValues.artlistOnepage);
                    assert.equals(response.article.tagValues.menu, artWip.tagValues.menu);
                    done();
                });

        },

        '//article wip': function (done) {
            articleWip.load({
                requestUrl: '/simple-blog/_index_wip',
                artlist: artlist,
                catlist: catlist
            })
                .then(function (article) {
                    assert.equals(article.tagValues.toc, artWip.tagValues.toc);
                    assert.equals(article.tagValues.artlist, artWip.tagValues.artlist);
                    assert.equals(article.tagValues.artlistOnepage, artWip.tagValues.artlistOnepage);
                    assert.equals(article.title, artWip.title);
                    // assert.equals(article.tag, artWip.tag);
                    // assert.match(article.body, artWip.body);
                    //delete require.cache[require.resolve('../../lib/article')];
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                });

        },

        'article wip not found': function (done) {
            articleWipNotFound.load({
                requestUrl: '/simple-blog/_index_wip_not_found',
                artlist: artlist,
                catlist: catlist
            })
                .then(function (article) {
                    assert(false);
                    console.log(article.length);
                    //delete require.cache[require.resolve('../../lib/article')];
                    done();
                })
                .catch(function (response) {
                    assert.equals(response.statusCode, 404);
                    assert.equals(response.article.tagValues.artlist, artWip.tagValues.artlist);
                    assert.equals(response.article.tagValues.artlistOnepage, artWip.tagValues.artlistOnepage);
                    assert.equals(response.article.tagValues.menu, artWip.tagValues.menu);
                    done();
                });

        },

        'sitemap test': function (done) {
            article.sitemap(catlist, artlist)
                .then(function (xml) {
                    var parseString = require('xml2js').parseString;
                    parseString(xml, function (err, result) {
                        var urls = result.urlset.url;
                        assert.equals(urls[0].loc[0], 'http://www.mydomain.no/simple-blog/');
                        assert.equals(urls[0].changefreq[0], 'weekly');
                        assert.equals(urls[0].priority[0], '0.85');

                        assert.equals(urls[1].loc[0], 'http://www.mydomain.no/simple-blog/index');
                        assert.equals(urls[1].changefreq[0], 'weekly');
                        assert.equals(urls[1].priority[0], '0.5');
                        done();
                    });
                    //delete require.cache[require.resolve('../../lib/article')];
                })
                .catch(function (err) {
                    console.log(err);
                });

        }

    }
});
