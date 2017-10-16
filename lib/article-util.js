/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var _             = require('underscore'),
    strftime      = require('strftime'),
    marked        = require('marked'),
    renderer      = new marked.Renderer(),
    path          = require('path'),
    fs            = require('fs'),
    appPath      = __dirname + '/../',
    myPlugins     = [],
    myReplacers   = [];

function loadPlugins(opt) {
    var stat = fs.lstatSync(opt.path);
    if (stat.isDirectory()) {
        fs.readdirSync(opt.path).forEach(function (file) {
            if (file.match(/\.js$/)) {
                try {
                    console.log('+ plugin is enabled: ', file);
                    var Plugin = require(opt.path + file);
                    var plugin = new Plugin();
                    myPlugins.push(plugin);
                } catch (err) {
                    console.error('! plugin crashed on require:', file, err);
                }
            }
        });
    }
}

function loadReplacers(opt) {
    var stat = fs.lstatSync(opt.path);
    if (stat.isDirectory()) {
        fs.readdirSync(opt.path).forEach(function (file) {
            if (file.match(/\.js$/)) {
                try {
                    console.log('+ replacer is enabled: ', file);
                    var Replacer = require(opt.path + file);
                    var replacer = new Replacer();
                    myReplacers.push(replacer);
                } catch (err) {
                    console.error('! replacer crashed on require:', file, err);
                }
            }
        });
    }
}

loadPlugins({
    path: path.normalize(appPath + 'lib/plugins/')
});
loadReplacers({
    path: path.normalize(appPath + 'lib/replacers/')
});

// Markdown setup.
marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});
renderer.heading = function (text, level) {
    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return '<h' + level + ' class="toc-' + level + '"><a name="' +
        escapedText +
        '" class="anchor" href="#' +
        escapedText +
        '"><span class="header-link"></span></a>' +
        text + '</h' + level + '>';
};
// <a href="#" id="pop">
//     <img id="imageresource" src="http://patyshibuya.com.br/wp-content/uploads/2014/04/04.jpg" style="width: 400px; height: 264px;">
//     Click to Enlarge
// </a>
renderer.image = function (href, title, text) {
    const src = href;
    href = href.replace(/(w=[0-9]+)/, 'w=2000');
    return '<p class="image_inline"><a href="' + href + '" data-smoothzoom="group1" title="' + (title ? title : text) +
        '">' + '<img src="' + src + '" alt="' + text + '" title="' + (title ? title : text) + '">' +
        '</a><span class="image_inline_text">' + (title ? title : text) + '</span></p>';
};

function ArticleUtil(options) {
    this.opts = options || {};
    this.logger = this.opts.logger;
}

ArticleUtil.prototype.replaceMarked = function (input) {
    return marked(input, { renderer: renderer });
};

ArticleUtil.prototype.substring = function (input, start, end) {
    return input.substring(start, end);
};

ArticleUtil.prototype.cleanHtml = function (input) {
    input = input.replace(/<(h[1-9]).+?>.+?<\/\1>/gi, '');
    return input.replace(/<.+?>/g, ' ');
};

ArticleUtil.prototype.formatDate = function (isoDate) {
    isoDate = isoDate ? isoDate : strftime('%Y-%m-%d');
    var format = '%b %e';
    var currentYear = strftime('%Y');
    var thisYear = strftime('%Y', new Date(Date.parse(isoDate)));
    if (currentYear > thisYear) {
        format =  '%b %e, %Y';
    }
    return strftime(format, new Date(Date.parse(isoDate)));
};

ArticleUtil.prototype.rssDate = function (isoDate) {
    isoDate = isoDate ? isoDate : strftime('%Y-%m-%d %H:%M:%S');
    var newDate = new Date(Date.parse(isoDate));
    return newDate.toUTCString();
};

ArticleUtil.prototype.getArticleFilename = function getArticleFilename(completeFilename) {
    var filename;
    if (_.isString(completeFilename)) {
        filename = completeFilename.replace(/^.*\//, '');
        filename = filename.replace(/\?.*$/, '');
    }
    return filename === '' ? 'index' : filename;
};

ArticleUtil.prototype.getArticlePathRelative = function getArticlePathRelative(completePath, contentPath) {
    if (!_.isString(contentPath)) {
        contentPath = '';
    }
    if (_.isString(completePath)) {
        contentPath = path.normalize(contentPath);
        var relativePath = completePath;
        if (_.isString(relativePath)) {
            var re = new RegExp(contentPath, 'i');
            relativePath = relativePath.replace(re, '');

            // Remove filename
            relativePath = relativePath.replace(/(\/*[^\/]+$)/, '');
            relativePath = relativePath.replace(/\/+/g, '/');

            if (!relativePath.match(/^\//)) {
                relativePath = '/' + relativePath;
            }
            if (!relativePath.match(/\/$/)) {
                relativePath = relativePath + '/';
            }
        }
        return relativePath ? relativePath : '/';
    } else {
        return null;
    }
};

ArticleUtil.prototype.getUrlFromRequest = function getUrlFromRequest(req) {
    if (_.isObject(req)) {
        if (_.isString(req.url)) {
            var articleFilename = req.url;//.replace(/\//, '');
            articleFilename = decodeURIComponent(articleFilename);
            articleFilename = articleFilename.replace(/\.html/, '');
            if (articleFilename.match(/\/$/)) {
                articleFilename += 'index';
            }
            return articleFilename;
        }
    }
    return undefined;
};

ArticleUtil.prototype.populateArticleSections = function populateArticleSections(data) {
    if (!data) {
        return {};
    }
    // Split content into sections.
    // jscs:disable
    var dataLines = data.split("\n"),
    // jscs:enable
        mode = 'body',
        lastMode,
        article = {
            tagValues: {
                toc: '',
                fact: '',
                artlist: ''
            }
        };
    function replacerSections(match, p1, p2, p3) {
        if (_.isString(p2)) {
            lastMode = mode;
            mode = p2;
        }
        return p3;
    }
    var colNumber = {};
    for (var i in dataLines) {
        if (_.isString(dataLines[i])) {
            var lineContainsMode = false;
            // var line_mode_equals_last_mode = false;
            if (dataLines[i].match(/(^:([a-zA-Z0-9\-]+)\s*)(.*)$/)) {
                lineContainsMode = true;
            }
            var dataLine = dataLines[i].replace(/(^:([a-zA-Z0-9\-]+)\s*)(.*)$/, replacerSections);
            if (_.isString(article[mode]) && article[mode].length > 0) {
                if (mode.match(/^(title|teaser)$/)) {
                    mode = lastMode;
                } else {
                    // jscs:disable
                    article[mode] += "\n" + dataLine;
                    // jscs:enable
                }
            } else {
                if (mode.match(/^(col|col\d+)$/)) {
                    if (!_.isArray(article[mode])) {
                        article[mode] = [];
                    }
                    if (lineContainsMode) {
                        if (_.isUndefined(colNumber[mode])) {
                            colNumber[mode] = 0;
                        } else {
                            colNumber[mode]++;
                        }
                    }
                    if (_.isEmpty(article[mode][colNumber[mode]])) {
                        article[mode][colNumber[mode]] = dataLine;
                    } else {
                        // jscs:disable
                        article[mode][colNumber[mode]] += "\n" + dataLine;
                        // jscs:enable
                    }
                } else if (mode.match(/^(img|imgtext|img2|img3|img4|img5|img6|img7|img8|img9|tag|images)$/)) {
                    // Push all values into an array.
                    if (!_.isArray(article[mode])) {
                        article[mode] = [];
                    }
                    if (!_.isArray(article[mode + 'Text'])) {
                        article[mode + 'Text'] = [];
                    }
                    if (mode.match(/img/)) {
                        var dataArray = dataLine.split(/#/);
                        article[mode].push(dataArray[0]);
                        article[mode + 'Text'].push(dataArray[1]);
                    } else {
                        article[mode].push(dataLine);
                    }
                    // Switch back to the previous mode.
                    mode = lastMode;
                } else {
                    article[mode] = dataLine;
                }
            }
        }
    }

    // Do we have a title section? If not chop the first line of the body
    if (_.isEmpty(article.title)) {
        // jscs:disable
        var bodyLines = article.body.split("\n");
        // jscs:enable
        article.title = bodyLines[0];
    }

    return article;
};

ArticleUtil.prototype.buildTableOfContents = function buildTableOfContents(article, field) {
    function replacerHeadlines(match, p1, p2, p3, p4, p5) {
        var tocHeadline = '<a href="' + p4 + '">' + p5 + '</a>';
        var indentLevel = p2;
        return '<span class="toc-indent-' + indentLevel + '">&bull; ' + tocHeadline + '</span>';
    }
    // Find all headlines and generate toc.
    if (_.isObject(article) && _.isString(article[field])) {
        var tocArray = article[field].match(/(<h([1-9]) class=\"toc-\2\">.+?<\/h\2>)/g) || [];
        if (tocArray.length > 0) {
            article.tagValues.toc = '<div class="toc" id="toc">';
            for (var i in tocArray) {
                if (tocArray[i]) {
                    var headline = tocArray[i];
                    // jscs:disable
                    headline = headline.replace(/(<h([1-9]) class=\"toc-\2\"><a name="(.+?)" class="anchor" href="(#.+?)"><span class="header-link"><\/span><\/a>(.+?)<\/h\2>)/g, replacerHeadlines);
                    // jscs:enable
                    article.tagValues.toc += headline;
                }
            }
            article.tagValues.toc += '</div>';
        }
    }
};

ArticleUtil.prototype.formatArticleSections = function formatArticleSections(article) {
    for (var field in article) {
        if (_.isString(article[field])) {
            if (typeof article[field + 'Raw'] === 'undefined') {
                article[field + 'Raw'] = article[field];
                // console.log(field + 'Raw');
            }
            if (field.match(/^(title|author|published)/)) {
                // Remove trailing new lines.
                article[field] = article[field].replace(/(\n|\r)+$/, '');
            } else if (field.match(/^(body|aside|ingress|teaser|footnote|col|youtube)/)) {
                // Parse markdown to html
                for (var i in myPlugins) {
                    if (_.isObject(myPlugins[i])) {
                        var plugin = myPlugins[i];
                        article[field] = article[field].replace(plugin.get('regexp'), plugin.replacer);
                    }
                }
                article[field] = this.replaceMarked(article[field]);
                this.buildTableOfContents(article, field);
            } else {
                // Parse markdown to html
                article[field] = article[field].replace(/(\n|\r)+$/, '');
            }
        } else if (_.isArray(article[field])) {
            if (field.match(/^(body|aside|ingress|teaser|footnote|col|youtube)/)) {
                for (var i in article[field]) { // jshint ignore:line
                    if (_.isString(article[field][i])) {
                        // Parse markdown to html
                        /* jshint ignore:start */
                        for (var j in myPlugins) {
                            if (_.isObject(myPlugins[j])) {
                                var plugin = myPlugins[j]; // jshint ignore:line
                                article[field][i] = article[field][i].replace(
                                    plugin.get('regexp'),
                                    plugin.replacer
                                );
                            }
                        }
                        /* jshint ignore:end */
                        article[field][i] = this.replaceMarked(article[field][i]);
                        this.buildTableOfContents(article, field);
                    }
                }
            }
        }
    }
};

ArticleUtil.prototype.replaceTagsWithContent = function replaceTagsWithContent(article) {
    var logger = this.logger;
    function replacerTags(match, p1, p2) {
        if (logger) {
            logger.log('replaceTagsWithContent->replacerTags->p1: ' + p1);
        }
        if (p1.match(/^fa-/)) {
            var result = '<span class="icon ' + p1 + '"></span>';
            if (!_.isUndefined(p2)) {
                var count = parseInt(p2.trim());
                if (_.isNumber(count)) {
                    result = new Array(count + 1).join(result);
                }
            }
            return result;
        }
        return article.tagValues[p1] || article[p1] || '';
    }

    // Insert tag into sections.
    // TODO: Do not replace tags inside code blocks.
    var fields = ['toc', 'body', 'aside', 'col', 'footnote'];
    for (var i in fields) {
        if (fields[i]) {
            var field = fields[i];
            for (var j = 0; j < 10; j++){
                var replaceField = field;
                if (j > 0) {
                    replaceField = field + j;
                }
                if (_.isString(article[replaceField])) {
                    for (var m in myReplacers) {
                        if (_.isObject(myReplacers[m])) {
                            var replacer = myReplacers[m];
                            article[field] = article[field].replace(replacer.get('regexp'), replacer.replacer);
                        }
                    }
                    article[replaceField] = article[replaceField].replace(
                        /\[:([a-z_\-0-9]+)(\s[a-z_\-0-9]+)*?\]/g,
                        replacerTags
                    );
                } else if (_.isArray(article[replaceField])) {
                    for (var k in article[replaceField]) {
                        if (_.isString(article[replaceField][k])) {
                            /* jshint ignore:start */
                            for (var n in myReplacers) {
                                if (_.isObject(myReplacers[n])) {
                                    var replacer = myReplacers[n]; // jshint ignore:line
                                    article[replaceField][k] = article[replaceField][k].replace(
                                        replacer.get('regexp'),
                                        replacer.replacer
                                    );
                                }
                            }
                            /* jshint ignore:end */
                            article[replaceField][k] = article[replaceField][k].replace(
                                /\[:([a-z_\-0-9]+)(\s[a-z_\-0-9]+)*?\]/g,
                                replacerTags
                            );
                        }
                    }
                } else if (_.isString(article.tagValues[replaceField])) {
                    article.tagValues[replaceField] =
                        article.tagValues[replaceField].replace(
                            /\[:([a-z_\-0-9]+)(\s[a-z_\-0-9]+)*?\]/gm,
                            replacerTags
                        );
                }
            }
        }
    }
};

ArticleUtil.prototype.formatArtlist = function formatArtlist(article, artlist) {
    if (!_.isObject(article.tagValues)) {
        article.tagValues = {};
    }
    article.artlist = artlist || {};
    article.tagValues.artlist = '<ul class="artlist">';
    article.tagValues['artlist-block'] = '<div class="artlist">';
    article.tagValues.artlistOnepage = '<ul class="artlist">';
    if (_.isObject(artlist)) {
        for (var i in artlist) {
            if (artlist[i]) {
                var art = artlist[i];
                article.tagValues.artlist += '<li><a href="' + path.normalize(art.baseHref + art.file) + '">' +
                    art.title + '</a></li>';
                article.tagValues['artlist-block'] += '<div class="artlist-art">' +
                    '<div class="artlist-image" style="' +  (_.isArray(art.img) ? 'background-image: ' +
                    'url(\'/pho/' + art.img[0] + '?w=500\');' : '') +
                    '"><a href="' + path.normalize(art.baseHref + art.file) + '"><img src="/images/pix.gif" ' +
                    'style="height:100%; width:100%;"></a></div>' +
                    '<h3><a href="' + art.baseHref + art.file + '">' + art.title + '</a></h3>' +
                    '</div>';
                article.tagValues.artlistOnepage += '<li><a href="#' + path.normalize(art.baseHref + art.file) +
                    '">' + art.title + '</a></li>';
            }
        }
    }
    article.tagValues.artlist += '</ul>';
    article.tagValues['artlist-block'] += '</div><br class="clear">';
    article.tagValues.artlistOnepage += '</ul>';
};

ArticleUtil.prototype.formatArtAlllist = function formatArtAlllist(article, artlistall) {
    if (!_.isObject(article.tagValues)) {
        article.tagValues = {};
    }
    article.artlistall = artlistall || {};
    article.tagValues.artlistall = '<ul class="artlistall">';
    article.tagValues['artlistall-block'] = '<div class="artlistall">';
    article.tagValues.artlistallOnepage = '<ul class="artlistall">';
    if (_.isObject(artlistall)) {
        for (var i in artlistall) {
            if (artlistall[i]) {
                var art = artlistall[i];
                article.tagValues.artlistall += '<li><a href="' + path.normalize(art.baseHref + art.file) + '">' +
                    art.title + '</a></li>';
                article.tagValues['artlistall-block'] += '<div class="artlistall-art">' +
                    '<div class="artlistall-image" style="' +  (_.isArray(art.img) ? 'background-image: ' +
                    'url(\'/pho/' + art.img[0] + '?w=500\');' : '') +
                    '"><a href="' + path.normalize(art.baseHref + art.file) + '"><img src="/images/pix.gif" ' +
                    'style="height:100%; width:100%;"></a></div>' +
                    '<h3><a href="' + art.baseHref + art.file + '">' + art.title + '</a></h3>' +
                    '</div>';
                article.tagValues.artlistallOnepage += '<li><a href="#' + path.normalize(art.baseHref + art.file) +
                    '">' + art.title + '</a></li>';
            }
        }
    }
    article.tagValues.artlistall += '</ul>';
    article.tagValues['artlistall-block'] += '</div><br class="clear">';
    article.tagValues.artlistallOnepage += '</ul>';
};

module.exports = ArticleUtil;
