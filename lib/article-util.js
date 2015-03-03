/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when          = require('when'),
    _             = require('underscore'),
    strftime      = require('strftime'),
    marked        = require('marked'),
    renderer      = new marked.Renderer(),
    path          = require('path'),
    app_path      = __dirname + '/../';


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
renderer.image = function (href, title, text) {
    return '<p class="image_inline">' +
        '<img src="' + href + '" alt="' + text + '"' + (title ? ' title="' + title + '"' : '') + '>' +
        '</p>';
};



var ArticleUtil = function (options, mock_services) {
    var opts = options || {};
    var logger = opts.logger;

    mock_services = mock_services || {};

    return {
        replaceMarked: function (input) {
            return marked(input, { renderer: renderer });
        },

        formatDate: function (iso_date) {
            iso_date = iso_date ? iso_date : strftime('%Y-%m-%d');
            var format = '%b %e';
            var current_year = strftime('%Y');
            var this_year = strftime('%Y', new Date(Date.parse(iso_date)));
            if (current_year > this_year) {
                format =  '%b %e, %Y';
            }
            return strftime(format, new Date(Date.parse(iso_date)));
        },

        rssDate: function (iso_date) {
            iso_date = iso_date ? iso_date : strftime('%Y-%m-%d %H:%M:%S');
            var format = '%b %e';
            var current_year = strftime('%Y');
            var this_year = strftime('%Y', new Date(Date.parse(iso_date)));
            if (current_year > this_year) {
                format =  '%b %e, %Y';
            }
            var newDate = new Date(Date.parse(iso_date));
            return newDate.toUTCString();
        },

        getArticleFilename: function getArticleFilename (complete_filename) {
            var filename;
            if (_.isString(complete_filename)) {
                filename = complete_filename.replace(/^.*\//, '');
                filename = filename.replace(/\?.*$/, '');
            }
            return filename === '' ? 'index' : filename;
        },

        getArticlePathRelative: function getArticlePathRelative (complete_path, content_path) {
            if (!_.isString(content_path)) {
                content_path = '';
            }
            if (_.isString(complete_path)) {
                content_path = path.normalize(content_path);
                var relative_path = complete_path;
                if (_.isString(relative_path)) {
                    var re = new RegExp(content_path, 'i');
                    relative_path = relative_path.replace(re, '');

                    // Remove filename
                    relative_path = relative_path.replace(/(\/*[^\/]+$)/, '');
                    relative_path = relative_path.replace(/\/+/g, '/');

                    if (!relative_path.match(/^\//)) {
                        relative_path = '/' + relative_path;
                    }
                    if (!relative_path.match(/\/$/)) {
                        relative_path = relative_path + '/';
                    }
                }
                return relative_path ? relative_path : '/';
            } else {
                return null;
            }
        },


        getUrlFromRequest: function getUrlFromRequest (req) {
            if (_.isObject(req)) {
                if (_.isString(req.url)) {
                    var article_filename = req.url;//.replace(/\//, '');
                    article_filename = decodeURIComponent(article_filename);
                    article_filename = article_filename.replace(/\.html/, '');
                    if (article_filename.match(/\/$/)) {
                        article_filename += 'index';
                    }
                    return article_filename;
                }
            }
            return undefined;
        },


        populateArticleSections: function populateArticleSections (data) {
            if (!data) {
                return {};
            }
            // Split content into sections.
            var data_lines = data.split("\n"),
                mode = 'title',
                last_mode,
                article = {
                    tag_values: {
                        toc: '',
                        fact: '',
                        artlist: ''
                    }
                };
            function replacer_sections(match, p1, p2, p3) {
                if (_.isString(p2)) {
                    last_mode = mode;
                    mode = p2;
                }
                return p3;
            }
            for (var i in data_lines) {
                if (_.isString(data_lines[i])) {
                    var data_line = data_lines[i].replace(/(^:([a-zA-Z0-9\-]+)\s*)(.*)$/, replacer_sections);
                    if (_.isString(article[mode]) && article[mode].length > 0) {
                        article[mode] += "\n" + data_line;
                    } else {
                        if (mode.match(/^(img|img2|img3|img4|img5|img6|img7|img8|img9|tag|images)$/)) {
                            // Push all values into an array.
                            if (!_.isArray(article[mode])) {
                                article[mode] = [];
                            }
                            if (!_.isArray(article[mode + '_text'])) {
                                article[mode + '_text'] = [];
                            }
                            if (mode.match(/img/)) {
                                var data_array = data_line.split(/#/);
                                article[mode].push(data_array[0]);
                                article[mode + '_text'].push(data_array[1]);
                            } else {
                                article[mode].push(data_line);
                            }
                            // Switch back to the previous mode.
                            mode = last_mode;
                        } else {
                            article[mode] = data_line;
                        }
                    }
                }
            }
            return article;
        },


        buildTableOfContents: function buildTableOfContents (article, field) {
            function replacer_headlines(match, p1, p2, p3, p4, p5) {
                var toc_headline = '<a href="' + p4 + '">' + p5 + '</a>';
                var indent_level = p2;
                return '<span class="toc-indent-' + indent_level + '">&bull; ' + toc_headline + '</span>';
            }
            // Find all headlines and generate toc.
            if (_.isObject(article) && _.isString(article[field])) {
                var toc_array = article[field].match(/(<h([1-9]) class=\"toc-\2\">.+?<\/h\2>)/g) || [];
                if (toc_array.length > 0) {
                    article.tag_values.toc = '<div class="toc" id="toc">';
                    for (var i in toc_array) {
                        if (toc_array[i]) {
                            var headline = toc_array[i];
                            headline = headline.replace(/(<h([1-9]) class=\"toc-\2\"><a name="(.+?)" class="anchor" href="(#.+?)"><span class="header-link"><\/span><\/a>(.+?)<\/h\2>)/g, replacer_headlines);
                            article.tag_values.toc += headline;
                        }
                    }
                    article.tag_values.toc += '</div>';
                }
            }
        },


        formatArticleSections: function formatArticleSections (article) {
            for (var field in article) {
                if (_.isString(article[field])) {
                    if (field.match(/^(title|author|published)/)) {
                        // Remove trailing new lines.
                        article[field] = article[field].replace(/(\n|\r)+$/, '');
                    } else if (field.match(/^(body|ingress|teaser)/)) {
                        // Parse markdown to html
                        article[field] = this.replaceMarked(article[field]);
                        this.buildTableOfContents(article, field);
                    } else {
                        // Parse markdown to html
                        article[field] = article[field].replace(/(\n|\r)+$/, '');
                    }
                }
            }
        },



        replaceTagsWithContent: function replaceTagsWithContent (article) {
            function replacer_tags(match, p1, p2, p3) {
                if (logger) {
                    logger.log('replaceTagsWithContent->replacer_tags->p1: ' + p1);
                }
                if (p1.match(/^fa-/)) {
                    return '<span class="icon ' + p1 + '"></span>';
                }
                return article.tag_values[p1] || '';
            }
            function replacer_code_style(match, p1, p2, p3) {
                if (logger) {
                    logger.log('replaceTagsWithContent->replacer_code_style->p1,p2: ', p1, p2);
                }
                return '<span class="comment">' + p1 + p2 + '</span>';
            }
            function replacer_hash_tags(match, p1, p2, p3) {
                if (logger) {
                    logger.log('replaceTagsWithContent->replacer_hash_tags->p1,p2: ', p1, p2);
                }
                return '<span class="hash_tag">' + p1 + '<a href="https://twitter.com/search?q=%23' + p2 + '">' + p2 + '</a></span>';
            }
            function replacer_users(match, p1, p2, p3) {
                if (logger) {
                    logger.log('replaceTagsWithContent->replacer_users->p1,p2: ', p1, p2);
                }
                return '<span class="user">' + p1 + '<a href="https://twitter.com/' + p2 + '">' + p2 + '</a></span>';
            }
            // Insert tag into sections.
            // TODO: Do not replace tags inside code blocks.
            var fields = ['toc', 'body', 'aside'];
            for (var i in fields) {
                if (fields[i]) {
                    var field = fields[i];
                    for(var j = 0; j < 10; j++){
                        var replace_field = field;
                        if (j > 0) {
                            replace_field = field + j;
                        }
                        if (_.isString(article[replace_field])) {
                            article[replace_field] = article[replace_field].replace(/\[:([a-z_\-0-9]+)(\s[a-z_\-0-9]+)*?\]/g, replacer_tags);
                            article[replace_field] = article[replace_field].replace(/\s+(#)([a-z_\-0-9\.]+)/gi, replacer_hash_tags);
                            article[replace_field] = article[replace_field].replace(/\s+(@)([a-z_\-0-9\.]+)/gi, replacer_users);
                            article[replace_field] = article[replace_field].replace(/^(\/\/\s+)(.+?)$/gm, replacer_code_style);
                        }
                        else if (_.isString(article.tag_values[replace_field])) {
                            article.tag_values[replace_field] = article.tag_values[replace_field].replace(/\[:([a-z_\-0-9]+)(\s[a-z_\-0-9]+)*?\]/g, replacer_tags);
                        }
                    }
                }
            }
        },


        formatArtlist: function formatArtlist (article, artlist) {
            if (!_.isObject(article.tag_values)) {
                article.tag_values = {};
            }
            article.artlist = artlist || {};
            article.tag_values.artlist = '<ul class="artlist">';
            article.tag_values['artlist-block'] = '<div class="artlist">';
            article.tag_values.artlist_onepage = '<ul class="artlist">';
            if (_.isObject(artlist)) {
                for (var i in artlist) {
                    if (artlist[i]) {
                        var art = artlist[i];
                        article.tag_values.artlist += '<li><a href="' + path.normalize(art.base_href + art.file) + '">' + art.title + '</a></li>';
                        article.tag_values['artlist-block'] += '<div class="artlist-art">' +
                            '<div class="artlist-image" style="' +  (_.isArray(art.img) ? 'background-image: url(\'/pho/' + art.img[0] + '?w=500\');' : '' ) +
                            '"><a href="' + path.normalize(art.base_href + art.file) + '"><img src="/images/pix.gif" style="height:100%; width:100%;"></a></div>' +
                            '<h3><a href="' + art.base_href + art.file + '">' + art.title + '</a></h3>' +
                            '</div>';
                        article.tag_values.artlist_onepage += '<li><a href="#' + path.normalize(art.base_href + art.file) + '">' + art.title + '</a></li>';
                    }
                }
            }
            article.tag_values.artlist += '</ul>';
            article.tag_values['artlist-block'] += '</div><br class="clear">';
            article.tag_values.artlist_onepage += '</ul>';
        }


    };
};

module.exports = ArticleUtil;
