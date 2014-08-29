/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when       = require('when'),
    _          = require('underscore'),
    fs         = require('fs'),
    marked     = require('marked'),
    renderer   = new marked.Renderer(),
    path       = require('path');

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

var Article = function (opt, mock_services) {
    var opts = opt || {};
    var logger = opts.logger;
    mock_services = mock_services || {};


    function populate_article_sections (data) {
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
                data_lines[i] = data_lines[i].replace(/(^:([a-zA-Z0\-]+)\s*)(.*)$/, replacer_sections);
                if (_.isString(article[mode]) && article[mode].length > 0) {
                    article[mode] += "\n" + data_lines[i];
                } else {
                    if (mode === 'img') {
                        if (!_.isArray(article[mode])) {
                            article[mode] = [];
                        }
                        article[mode].push(data_lines[i]);
                        mode = last_mode;
                    } else {
                        article[mode] = data_lines[i];
                    }
                }
            }
        }
        return article;
    }


    function build_table_of_contents (article, field) {
        function replacer_headlines(match, p1, p2, p3, p4, p5) {
            var toc_headline = '<a href="' + p4 + '">' + p5 + '</a>';
            var indent_level = p2;
            return '<span class="toc-indent-' + indent_level + '">&bull; ' + toc_headline + '</span>';
        }
        // Find all headlines and generate toc.
        var toc_array = article[field].match(/(<h([1-9]) class=\"toc-\2\">.+?<\/h\2>)/g);
        if (toc_array.length > 0) {
            article.tag_values.toc = '<div class="toc" id="toc">';
            for (var i in toc_array) {
                var headline = toc_array[i];
                console.log(headline);
                headline = headline.replace(/(<h([1-9]) class=\"toc-\2\"><a name="(.+?)" class="anchor" href="(#.+?)"><span class="header-link"><\/span><\/a>(.+?)<\/h\2>)/g, replacer_headlines);
                article.tag_values.toc += headline;
            }
            article.tag_values.toc += '</div>';
        }
    }


    function format_article_sections (article) {
        for (var field in article) {
            if (_.isString(article[field])) {
                if (field.match(/^(title)/)) {
                    // Remove trailing new lines.
                    article[field] = article[field].replace(/(\n|\r)+$/, '');
                } else if (field.match(/^(body)/)) {
                    // Parse markdown to html
                    article[field] = marked(article[field], { renderer: renderer });
                    build_table_of_contents(article, field);
                } else {
                    // Parse markdown to html
                    article[field] = marked(article[field]);
                }
            }
        }
    }


    function replace_tags_with_content (article) {
        function replacer_tags(match, p1, p2, p3) {
            return article.tag_values[p1];
        }
        // Insert tag into sections.
        // TODO: Do not replace tags inside code blocks.
        var fields = ['body', 'aside'];
        for (var i in fields) {
            var field = fields[i];
            if (_.isString(article[field])) {
                article[field] = article[field].replace(/\[:(toc|fact)\]/g, replacer_tags);
            }
        }
    }


    function load_article (filename, callback) {
        fs.readFile(path.normalize(filename), { encoding: 'utf8'}, function (err, data) {
            if (err) {
                logger.err(404, 'File not found: ' + filename);
                callback(err);
            }
            var article = populate_article_sections(data);
            format_article_sections(article);
            replace_tags_with_content(article);
            callback(err, article);
        });
    }


    return {
        article: function (filename) {
            return when.promise( function (resolve, reject) {
                load_article(filename, function (err, article) {
                    if (err) {
                        reject(err);
                    }
                    resolve(article);
                });
            });
        }

//        artlist: function () {
//
//            return when.promise( function (resolve, reject) {
//                var ms = (new Date).getTime();
//                resolve(logger.log('info', ms + ': ' + msg.join(' -> '), meta));
//            });
//        }

    };
};

module.exports = Article;
