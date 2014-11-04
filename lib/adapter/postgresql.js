/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when          = require('when'),
    _             = require('underscore'),
    path          = require('path'),
    pg            = require('pg'),
    util          = require('util'),
    app_path      = __dirname + '/../../',
    article_util  = require(app_path + 'lib/article-util')(),
    local_util    = require(app_path + 'lib/local-util')();


var Postgresql = function (options, mock_services) {
    var opts = options || {};
    var logger = opts.logger;
    mock_services = mock_services || {};

    var config = {};
    if (_.isObject(opts.config) && _.isObject(opts.config.adapter)) {
        config = opts.config.adapter.postgresql;
    }
    pg = mock_services.pg || pg;


    function get_column_names (table_name) {
        return when.promise(function (resolve, reject) {
            var conString = 'postgres://' + config.username + ':' + config.password + '@' +
                config.server + ':' + config.port + '/' + config.database;
            pg.connect(conString, function (err, client, done) {
                if (err) {
                    return reject(err);
                }
                client.query(util.format("select column_name, data_type, character_maximum_length, is_nullable from information_schema.columns WHERE table_name = '%s' ORDER BY column_name", table_name), function (err, result) {
                    done();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.rows);
                    }
                });
            });
        });
    }


    function query (sql, values) {
        return when.promise(function (resolve, reject) {
            var conString = 'postgres://' + config.username + ':' + config.password + '@' +
                config.server + ':' + config.port + '/' + config.database;
            pg.connect(conString, function (err, client, done) {
                if (err) {
                    reject(err);
                }
                // TODO: Replace all parameters inside sql with key-value from values.
                client.query(util.format(sql), function (err, result) {
                    done();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.rows);
                    }
                });
            });
        });
    }

    function safe_str (val) {
        val.replace(/[\0\n\r\b\t\\\'\"\x1a]/g, function (s) {
            switch (s) {
            case "\0":
                return "\\0";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\b":
                return "\\b";
            case "\t":
                return "\\t";
            case "\x1a":
                return "\\Z";
            default:
                return "\\" + s;
            }
        });

        return val;
    }

    function build_sql (sql, values) {
        var secure_sql = sql.replace(/\{\{(.+?)\}\}/g, function(main_string, match) {
            // TODO: Is this safe enough?
            var key = safe_str(match.trim());
            return values[key];
        });
//        console.log(secure_sql);
        return secure_sql;
    }


    var article = {
        tag_values: {
            toc: '',
            artlist: '',
            menu: '',
        },
        tag: [],
    };

    function parseImg (string, match, match2, match3) {
//        console.log('match3: ', '"' + match3 + '"');
        var text = '[]';
        if (_.isString(match3) && match3.length > 2) {
            text = '[' + match3 + ']';
        }
        var img = 'wipbilder/' + parseInt(match/100,10) + '/' + match + '.' + match2 + text;
        return img;
    }

    function load_article (opt) {
        return when.promise(function (resolve, reject) {
//            console.log('load_article->opt.request_url: ', opt.request_url);

            var file = article_util.getArticleFilename(opt.request_url);
            article.file = file;
//            console.log('load_article->file: ', article.file);
            article.base_href = article_util.getArticlePathRelative(opt.request_url, config.content_path);
            var urlname = article.base_href.replace(/^\//, '');
            urlname = urlname.replace(/\/$/, '');

            var sql = 'SELECT id,title,ingress,body,photos(id) AS photos FROM wip_article ' +
                'WHERE customer_id=554 ' +
                (file === 'index' ? '' : ' AND urlname = \'' + safe_str(file) + '\' ') +
                '  AND status=1 ' +
                '  AND category_urlname = \'' + safe_str(urlname) + '\' ' +
                'ORDER BY publish_date DESC ' +
                'LIMIT 1 -- {{ file }} ' ;
            sql = build_sql(sql, {file: article.file, base_href: article.base_href});
//            console.log(sql);
            when(query(sql))
                .then(function (result) {
                    _.extend(article, result[0]);
                    article.filename = article.id;
                    if (_.isString(article.photos)) {
                        article.img = article.photos.split(';;');
                        for (var i in article.img) {
                            if (article.img[i]) {
                                var img = article.img[i];
                                article.img_text = [];
                                img = img.replace(/^.+id=(\d+)\.(\w+)\[(.*?)\]/, parseImg);

                                var text = img.replace(/^.+\[(.*?)\]$/, "$1");
                                img = img.replace(/\[(.*?)\]$/, '');
                                article.img[i] = img;
                                article.img_text[i] = text;

                            }
                        }
                    }
                    resolve(article);
                })
                .catch(function (err) {
                    reject({ status: 404, article: article, error: err });
                });
        });
    }


    function list_articles (relative_path) {
        return when.promise(function (resolve, reject) {
            logger.log('load_article_list->relative_path: ', relative_path);
//            console.log('load_article_list->relative_path: ', relative_path);

//            id                          | integer                     | not null default nextval(('"wip_article_id_seq"'::text)::regclass)
//            wip_id                      | character varying(20)       | not null
//            create_date                 | timestamp with time zone    | not null default now()
//            publish_date                | timestamp with time zone    | not null default now()
//            expiry_date                 | timestamp with time zone    | not null default (now() + '10 years'::interval)
//            keywords                    | character varying(1000)     |
//            status                      | integer                     | not null
//            category                    | integer                     | not null
//            title                       | character varying(255)      | not null
//            lead_title                  | character varying(255)      |
//            ingress                     | text                        |
//            body                        | text                        |
//            byline                      | character varying(255)      |
//            teaser_title                | character varying(255)      |
//            teaser_ingress              | text                        |
//            publish_date2               | timestamp with time zone    |
//            expiry_date2                | timestamp with time zone    |
//            teaser_image                | character varying(255)      |
//            teaser_image_byline         | character varying(255)      |
//            parent                      | integer                     |
//            fname                       | character varying(20)       |
//            lname                       | character varying(20)       |
//            email                       | character varying(100)      |
//            referer_old                 | character varying(15)       |
//            postalcode                  | character varying(10)       |
//            postalplace                 | character varying(100)      |
//            country                     | character(2)                | default 'NO'::bpchar
//            url                         | character varying(255)      |
//            phone                       | character varying(20)       |
//            cellphone                   | character varying(20)       |
//            fax                         | character varying(20)       |
//            address1                    | character varying(100)      |
//            address2                    | character varying(100)      |
//            price                       | numeric(9,2)                |
//            qty                         | integer                     |



            var urlname = relative_path.replace(/^\//, '');
            urlname = urlname.replace(/\/$/, '');
            var artlist = [];
            var sql = 'SELECT id, lead_title, title, byline, ingress, body, urlname AS file, ' +
                '             photos(id) AS photos, category_urlname AS base_href, ' +
                '             teaser_title, teaser_ingress, url, ' +
                '             create_date, publish_date, expiry_date, keywords ' +
                ' FROM wip_article ' +
                'WHERE customer_id=554 ' +
                '  AND category_urlname = \'' + safe_str(urlname) + '\' ' +
                '  AND status=1 ' +
                'ORDER BY publish_date DESC ' +
                'LIMIT 20 -- ' + relative_path +
                ' {{ path }}';
//            console.log(sql);

            when(query(sql))
                .then(function (result) {
                    for (var i in result) {
                        if (result[i]) {
                            var art = {
                                base_href: relative_path,
                                filename: result[i].id
                            };
                            result[i].base_href = relative_path;
//                            result[i].base_href = relative_path;
                            if (_.isString(result[i].photos)) {
                                result[i].img = result[i].photos.split(';;');
                                result[i].img_text = [];
                                for (var j in result[i].img) {
                                    if (result[i].img[j]) {
                                        var img = result[i].img[j];
                                        img = img.replace(/^.+id=(\d+)\.(\w+)\[(.*?)\]/, parseImg);

                                        var text = img.replace(/^.+\[(.*)\]$/, "$1");
                                        img = img.replace(/\[(.*)\]$/, '');
                                        result[i].img[j] = img;
                                        result[i].img_text[j] = text;
                                    }
                                }
                            }
                            artlist.push(_.extend(art, result[i]));
                        }
                    }
                    resolve(artlist);
                })
                .catch(function (err) {
                    resolve([]);
                });
        });
    }


    function list_categories (relative_path) {
        return when.promise(function (resolve, reject) {
            logger.log('load_article_list->relative_path: ', relative_path);
            var catlist = [];
            var sql = 'SELECT id,title,urlname AS name, description FROM wip_category ' +
                'WHERE customer=554 ' +
                '  AND visible=true ' +
                'ORDER BY urlname ASC ' +
                'LIMIT 100 -- ' + relative_path +
                ' {{ path }}';
//            console.log(sql);

            when(query(sql))
                .then(function (result) {
                    for (var i in result) {
                        if (result[i]) {
                            var cat = {
                                type: 'directory'
                            };
                            catlist.push(_.extend(cat, result[i]));
                        }
                    }
//                    console.log('catlist: ', catlist);
                    resolve(catlist);
                })
                .catch(function (err) {
                    console.log('error: ', err);
                    resolve([]);
                });
        });
    }


    return {
        load: function (opt) {
            return when.promise(function (resolve, reject) {
                when(load_article(opt))
                    .done(resolve, reject);
            });
        },

        list_articles: function (relative_path) {
            return when.promise(function (resolve, reject) {
                when(list_articles(relative_path))
                    .done(function (artlist) {
                        resolve(artlist);
                    }, reject);
            });
        },

        list_categories: function (relative_path) {
            return when.promise(function (resolve, reject) {
                when(list_categories(relative_path))
                    .done(resolve, reject);
//                resolve({});
            });
        },
//
        list_images: function (article) {
            return when.promise(function (resolve, reject) {
//                when(load_article_images(article))
//                    .done(resolve, reject);
                resolve(article);
            });
        },

        get_column_names : get_column_names,


    };
};

module.exports = Postgresql;