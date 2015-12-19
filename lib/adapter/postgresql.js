/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when          = require('when'),
    _             = require('underscore'),
    pg            = require('pg'),
    util          = require('util'),
    appPath       = __dirname + '/../../',
    ArticleUtil   = require(appPath + 'lib/article-util'),
    articleUtil   = new ArticleUtil();

var Postgresql = function (options) {
    var opts = options || {};
    var logger = opts.logger;

    var config = {};
    if (_.isObject(opts.config) && _.isObject(opts.config.adapter) && _.isObject(opts.config.adapter.postgresql)) {
        config = opts.config.adapter.postgresql;
    }
    if (!config.server || !config.port || !config.database) {
        throw new Error('Missing config.adapter.elasticsearch.server and/or config.adapter.elasticsearch.port while ' +
            'trying to init "' + __filename + '" module!');
    }

    function getColumnNames(tableName) {
        return when.promise(function (resolve, reject) {
            var conString = 'postgres://' + config.username + ':' + config.password + '@' +
                config.server + ':' + config.port + '/' + config.database;
            pg.connect(conString, function (err, client, done) {
                if (err) {
                    return reject(err);
                }
                client.query(util.format('select columnName, dataType, characterMaximumLength, is_nullable from ' +
                    'information_schema.columns WHERE tableName = \'%s\' ORDER BY columnName',
                    tableName), function (err, result) {
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

    function query(sql) {
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

    function safeStr(val) {
        // jscs:disable
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
        // jscs:enable

        return val;
    }

    function buildSql(sql, values) {
        var secureSql = sql.replace(/\{\{(.+?)\}\}/g, function (mainString, match) {
            // TODO: Is this safe enough?
            var key = safeStr(match.trim());
            return values[key];
        });
//        console.log(secureSql);
        return secureSql;
    }

    var article = {
        tagValues: {
            toc: '',
            artlist: '',
            menu: ''
        },
        tag: []
    };

    function parseImg(string, match, match2, match3) {
//        console.log('match3: ', '"' + match3 + '"');
        var text = '[]';
        if (_.isString(match3) && match3.length > 2) {
            text = '[' + match3 + ']';
        }
        var img = 'wipbilder/' + parseInt(match / 100, 10) + '/' + match + '.' + match2 + text;
        return img;
    }

    function loadArticle(opt) {
        return when.promise(function (resolve, reject) {
//            console.log('loadArticle->opt.requestUrl: ', opt.requestUrl);

            var file = articleUtil.getArticleFilename(opt.requestUrl);
            article.file = file;
//            console.log('loadArticle->file: ', article.file);
            article.baseHref = articleUtil.getArticlePathRelative(opt.requestUrl, config.contentPath);
            var urlname = article.baseHref.replace(/^\//, '');
            urlname = urlname.replace(/\/$/, '');

            var sql = 'SELECT id,title,ingress,body,photos(id) AS photos FROM wip_article ' +
                'WHERE customer_id=554 ' +
                (file === 'index' ? '' : ' AND urlname = \'' + safeStr(file) + '\' ') +
                '  AND status=1 ' +
                '  AND category_urlname = \'' + safeStr(urlname) + '\' ' +
                'ORDER BY publish_date DESC ' +
                'LIMIT 1 -- {{ file }} ' ;
            sql = buildSql(sql, {file: article.file, baseHref: article.baseHref});
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
                                article.imgText = [];
                                img = img.replace(/^.+id=(\d+)\.(\w+)\[(.*?)\]/, parseImg);
                                // jscs:disable
                                var text = img.replace(/^.+\[(.*?)\]$/, "$1");
                                // jscs:enable
                                img = img.replace(/\[(.*?)\]$/, '');
                                article.img[i] = img;
                                article.imgText[i] = text;

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

    function listArticles(relativePath) {
        return when.promise(function (resolve) {
            logger.log('load_article_list->relativePath: ', relativePath);
            // jscs:disable
//            console.log('load_article_list->relativePath: ', relativePath);
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
            // jscs:enable
            var urlname = relativePath.replace(/^\//, '');
            urlname = urlname.replace(/\/$/, '');
            var artlist = [];
            var sql = 'SELECT id, lead_title, title, byline, ingress, body, urlname AS file, ' +
                '             photos(id) AS photos, category_urlname AS baseHref, ' +
                '             teaser_title, teaser_ingress, url, ' +
                '             create_date, publish_date, expiry_date, keywords ' +
                ' FROM wip_article ' +
                'WHERE customer_id=554 ' +
                '  AND category_urlname = \'' + safeStr(urlname) + '\' ' +
                '  AND status=1 ' +
                'ORDER BY publish_date DESC ' +
                'LIMIT 20 -- ' + relativePath +
                ' {{ path }}';
//            console.log(sql);

            when(query(sql))
                .then(function (result) {
                    for (var i in result) {
                        if (result[i]) {
                            var art = {
                                baseHref: relativePath,
                                filename: result[i].id
                            };
                            result[i].baseHref = relativePath;
//                            result[i].baseHref = relativePath;
                            if (_.isString(result[i].photos)) {
                                result[i].img = result[i].photos.split(';;');
                                result[i].imgText = [];
                                for (var j in result[i].img) {
                                    if (result[i].img[j]) {
                                        var img = result[i].img[j];
                                        img = img.replace(/^.+id=(\d+)\.(\w+)\[(.*?)\]/, parseImg);
                                        // jscs:disable
                                        var text = img.replace(/^.+\[(.*)\]$/, "$1");
                                        // jscs:enable
                                        img = img.replace(/\[(.*)\]$/, '');
                                        result[i].img[j] = img;
                                        result[i].imgText[j] = text;
                                    }
                                }
                            }
                            artlist.push(_.extend(art, result[i]));
                        }
                    }
                    resolve(artlist);
                })
                .catch(function () {
                    resolve([]);
                });
        });
    }

    function listCategories(relativePath) {
        return when.promise(function (resolve) {
            logger.log('load_article_list->relativePath: ', relativePath);
            var catlist = [];
            var sql = 'SELECT id,title,urlname AS name, description FROM wip_category ' +
                'WHERE customer=554 ' +
                '  AND visible=true ' +
                'ORDER BY urlname ASC ' +
                'LIMIT 100 -- ' + relativePath +
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
                when(loadArticle(opt))
                    .done(resolve, reject);
            });
        },

        listArticles: function (relativePath) {
            return when.promise(function (resolve, reject) {
                when(listArticles(relativePath))
                    .done(function (artlist) {
                        resolve(artlist);
                    }, reject);
            });
        },

        listCategories: function (relativePath) {
            return when.promise(function (resolve, reject) {
                when(listCategories(relativePath))
                    .done(resolve, reject);
//                resolve({});
            });
        },
//
        listImages: function (article) {
            // This should be fixed.
            return when.promise(function (resolve) {
//                when(load_article_images(article))
//                    .done(resolve, reject);
                resolve(article);
            });
        },

        getColumnNames: getColumnNames

    };
};

module.exports = Postgresql;
