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
    content_path  = path.normalize(app_path + 'content/articles/'),
    logger        = require(app_path + 'lib/logger')();

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

        getArticlePathRelative: function (complete_filename) {
            //    console.log('getArticlePathRelative', complete_filename);
            var re = new RegExp(content_path);
            var relative_path = complete_filename.replace(re, '');
            // Remove filename
            relative_path = relative_path.replace(/(\/*[^\/]+$)/, '');
            //    console.log('relative_path: ', relative_path);
            return relative_path ? '/' + relative_path : '';
        },

        getUrlFromRequest: function (req) {
            var article_filename = req.url.replace(/\//, '');
            article_filename = decodeURIComponent(article_filename);
            article_filename = article_filename.replace(/\.html/, '');
            return article_filename;
        },

        getMarkdownFilename: function (article_filename) {
            var markdown_filename = path.normalize(content_path + article_filename + '.md');
            //    markdown_filename = markdown_filename.replace(/\/.md$/, '/index.md');
            return markdown_filename;
        }

    };

};

module.exports = ArticleUtil;
