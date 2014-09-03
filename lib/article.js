/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when         = require('when'),
    _            = require('underscore'),
    fs           = require('fs'),
    marked       = require('marked'),
    renderer     = new marked.Renderer(),
    path         = require('path'),
    walk         = require('walk');


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
                data_lines[i] = data_lines[i].replace(/(^:([a-zA-Z0\-]+)\s*)(.*)$/, replacer_sections);
                if (_.isString(article[mode]) && article[mode].length > 0) {
                    article[mode] += "\n" + data_lines[i];
                } else {
                    if (mode.match(/^(img|tag)$/)) {
                        // Push all values into an array.
                        if (!_.isArray(article[mode])) {
                            article[mode] = [];
                        }
                        article[mode].push(data_lines[i]);
                        // Switch back to the previous mode.
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
        var toc_array = article[field].match(/(<h([1-9]) class=\"toc-\2\">.+?<\/h\2>)/g) || [];
        if (toc_array.length > 0) {
            article.tag_values.toc = '<div class="toc" id="toc">';
            for (var i in toc_array) {
                var headline = toc_array[i];
//                console.log(headline);
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
            logger.log('replace_tags_with_content->replacer_tags->p1: ' + p1);
//            logger.log('replace_tags_with_content->replacer_tags->p2: ' + p2);
            return article.tag_values[p1];
        }
        // Insert tag into sections.
        // TODO: Do not replace tags inside code blocks.
        var fields = ['body', 'aside'];
        for (var i in fields) {
            var field = fields[i];
            if (_.isString(article[field])) {
                article[field] = article[field].replace(/\[:([a-z\-0-9]+)(\s[a-z\-0-9]+)*?\]/g, replacer_tags);
            }
        }
    }


    function format_catlist (article, catlist) {
        if (!_.isObject(article.tag_values)) {
            article.tag_values = {};
        }
        article.catlist = catlist;
        article.tag_values.menu = '<ul class="catlist">';
        for (var i in catlist) {
            var dir = catlist[i];
            article.tag_values.menu += '<li><a href="/' + dir.name + '/">' + dir.name + '</a></li>';
        }
        article.tag_values.menu += '</ul>';
    }

    function format_artlist (article, artlist) {
        if (!_.isObject(article.tag_values)) {
            article.tag_values = {};
        }
        article.artlist = artlist;
        article.tag_values.artlist = '<ul class="artlist">';
        article.tag_values['artlist-block'] = '<div class="artlist">';
        for (var i in artlist) {
            var art = artlist[i];
//            console.log(art);
            article.tag_values.artlist += '<li><a href="' + art.base_href + art.file + '">' + art.title + '</a></li>';
            article.tag_values['artlist-block'] += '<div class="artlist-art">' +
                (_.isArray(art.img) ? '<div class="artlist-image" style="background-image: url(\'/photos/' + art.img[0] + '\');"></div>' : '') +
                '<h3><a href="' + art.base_href + art.file + '">' + art.title + '</a></h3>' +
                '</div>';
        }
        article.tag_values.artlist += '</ul>';
        article.tag_values['artlist-block'] += '</div><br class="clear">';
    }

    function check_if_article_exists (filename, artlist) {
        console.log('Check', filename, artlist);
        function article_exists (el, index, array) {
            return el.filename === filename;
        }
        if (_.isArray(artlist) && artlist.length > 0) {
            if (!artlist.some(article_exists)) {
                return artlist[0].filename;
            }
        }
        return filename;
    }

    function load_article (opt, callback) {
        if (!opt.filename.match(/\.md$/)) {
            opt.filename += '.md';
        }
        var filename = check_if_article_exists(opt.filename, opt.artlist);
//        console.log('opt: ', opt);
        logger.log('load_article->filename: ', filename);

        fs.readFile(path.normalize(filename), { encoding: 'utf8'}, function (err, data) {
            var article = populate_article_sections(data);
            article.file = opt.file;
            article.filename = filename;
            article.base_href = opt.base_href;
            if (err) {
                logger.err(404, 'File not found: ' + filename);
                callback('404: Not found.', article);
            }
//            console.log(article);
            callback(err, article);
        });
    }


    function load_catlist (root, callback) {
        logger.log('load_cateogries->root: ', root);
        var walker  = walk.walk(root, { followLinks: true });
        var catlist = [];
        walker.on("directories", function (root, dirStatsArray, next) {
            for (var i in dirStatsArray) {
                var dir = dirStatsArray[i];
                if (dir.name.match(/^[^\.]/)) {
                    catlist.push(dir);
                }
            }
            next();
        });
        walker.on('end', function () {
            callback(null, catlist);
        });
        walker.on('error', function (err, entry, stat) {
            callback(err);
        });
    }

    function srt (desc,key) {
        return function(a,b){
            return desc ? ~~(key ? a[key]<b[key] : a < b)
                : ~~(key ? a[key] > b[key] : a > b);
        };
    }

    function load_artlist (content_root, relative_path, callback) {
        logger.log('load_artlist->content_root: ', content_root);
        logger.log('load_artlist->relative_path: ', relative_path);
        var walker  = walk.walk(content_root, { followLinks: true });
        var files = [];
        walker.on("file", function (root, stat, next) {
            if (stat.name.match(/^[^\._]/)) {
//                console.log(root, stat);
                var re = new RegExp(content_root,"g");
                root = root.replace(re,'');
                stat.name = stat.name.replace(/\.md$/, '');
                stat.filename = path.normalize(root + '/' + stat.name);
                stat.base_href = relative_path;
                files.push(stat);
            }
            next();
        });
        walker.on('end', function() {
            var array = [];
//            console.log(files);
            files.sort(srt(true, 'mtime'));
//            console.log(files);

            for (var i in files) {
                var file = files[i].filename,
                    base_href = files[i].base_href;
//                console.log('====>', file);
//                console.log(file.relative_path);
                array.push( when.promise(function (resolve, reject) {
                    load_article({
                        filename: content_root + file,
                        file: file,
                        base_href: base_href
                    }, function(err, article) {
//                        console.log('--->', article.title);
                        resolve(article);
                    });
                }));
            }
            when.all(array)
                .then(function(artlist) {
                    callback(null, artlist);
                });
        });
        walker.on('error', function (err, entry, stat) {
            callback(err);
        });
    }


    return {
        article: function (opt) {
            return when.promise(function (resolve, reject) {
                load_article({
                    filename: opts.filename,
                    catlist: opt.catlist,
                    artlist: opt.artlist
                }, function (err, article) {
                    if (err) { reject({ error: err, article: article }); }
                    format_catlist(article, opt.catlist);
                    format_artlist(article, opt.artlist);
                    format_article_sections(article);
                    replace_tags_with_content(article);
                    resolve(article);
                });
            });
        },

        artlist: function (opt) {
            return when.promise( function (resolve, reject) {
                var content_path = path.normalize(opts.content_path + opts.article_path);
                load_artlist(content_path, opts.article_path, function (err, artlist) {
                    if (err) { reject({ error: err }); }
                    resolve({
                        artlist: artlist,
                        catlist: opt.catlist,
                        content_path: content_path
                    });
                });
            });
        },

        catlist: function () {
            return when.promise( function (resolve, reject) {
                var content_path = opts.content_path;
                load_catlist(content_path, function (err, catlist) {
                    if (err) { reject({ error: err }); }
                    resolve({
                        catlist: catlist
                    });
                });
            });
        }

    };
};

module.exports = Article;
