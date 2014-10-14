/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when          = require('when'),
    _             = require('underscore'),
    marked        = require('marked'),
    renderer      = new marked.Renderer(),
    path          = require('path'),
    app_path      = __dirname + '/../',
    content_path  = path.normalize(app_path + 'content/articles/');

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


        getArticlePathRelative: function getArticlePathRelative (complete_filename) {
            //    console.log('getArticlePathRelative', complete_filename);
            var re = new RegExp(content_path);
            var relative_path = complete_filename.replace(re, '');
            // Remove filename
            relative_path = relative_path.replace(/(\/*[^\/]+$)/, '');
            //    console.log('relative_path: ', relative_path);
            return relative_path ? '/' + relative_path : '';
        },


        getUrlFromRequest: function getUrlFromRequest (req) {
            var article_filename = req.url.replace(/\//, '');
            article_filename = decodeURIComponent(article_filename);
            article_filename = article_filename.replace(/\.html/, '');
            return article_filename;
        },


        getMarkdownFilename: function getMarkdownFilename (article_filename) {
            if (!article_filename || article_filename.match(/\/$/)) {
                article_filename += 'index';
            }
            var markdown_filename = path.normalize(content_path + article_filename + '.md');
            return markdown_filename;
        },


        populate_article_sections: function populate_article_sections (data) {
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
                        if (mode.match(/^(img|img2|img3|img4|img5|img6|img7|img8|img9|tag)$/)) {
                            // Push all values into an array.
                            if (!_.isArray(article[mode])) {
                                article[mode] = [];
                            }
                            article[mode].push(data_line);
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


        build_table_of_contents: function build_table_of_contents (article, field) {
            function replacer_headlines(match, p1, p2, p3, p4, p5) {
                var toc_headline = '<a href="' + p4 + '">' + p5 + '</a>';
                var indent_level = p2;
                return '<span class="toc-indent-' + indent_level + '">&bull; ' + toc_headline + '</span>';
            }
            // Find all headlines and generate toc.
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
        },


        format_article_sections: function format_article_sections (article) {
            for (var field in article) {
                if (_.isString(article[field])) {
                    if (field.match(/^(title)/)) {
                        // Remove trailing new lines.
                        article[field] = article[field].replace(/(\n|\r)+$/, '');
                    } else if (field.match(/^(body)/)) {
                        // Parse markdown to html
                        article[field] = this.replaceMarked(article[field]);
                        this.build_table_of_contents(article, field);
                    } else {
                        // Parse markdown to html
                        article[field] = this.replaceMarked(article[field]);
                    }
                }
            }
        },



        replace_tags_with_content: function replace_tags_with_content (article) {
            function replacer_tags(match, p1, p2, p3) {
                if (logger) {
                    logger.log('replace_tags_with_content->replacer_tags->p1: ' + p1);
                }
                return article.tag_values[p1];
            }
            // Insert tag into sections.
            // TODO: Do not replace tags inside code blocks.
            var fields = ['body', 'aside'];
            for (var i in fields) {
                if (fields[i]) {
                    var field = fields[i];
                    for(var j = 0; j < 10; j++){
                        var replace_field = field;
                        if (j > 0) {
                            replace_field = field + j;
                        }
                        if (_.isString(article[replace_field])) {
                            article[replace_field] = article[replace_field].replace(/\[:([a-z\-0-9]+)(\s[a-z\-0-9]+)*?\]/g, replacer_tags);
                        }
                    }
                }
            }
        },


        format_artlist: function format_artlist (article, artlist) {
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
                        //            console.log(art);
                        article.tag_values.artlist += '<li><a href="' + path.normalize(art.base_href + art.file) + '">' + art.title + '</a></li>';
                        article.tag_values['artlist-block'] += '<div class="artlist-art">' +
                            '<div class="artlist-image" style="' +  (_.isArray(art.img) ? 'background-image: url(\'/pho/' + art.img[0] + '?w=500\');' : '' ) +
                            '"><a href="' + path.normalize(art.base_href + art.file) + '"><img src="/images/pix.gif" style="height:100%; width:100%;"></a></div>' +
                            '<h3><a href="' + art.base_href + art.file + '">' + art.title + '</a></h3>' +
                            '</div>';
                        article.tag_values.artlist_onepage += '<li><a href="#' + art.file + '">' + art.title + '</a></li>';
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
