module.exports = {
    version: 1,
    blog: {
        title: 'Simple Blog Server',
        slogun: '',
        protocol: 'http',
        domain: 'www.litt.no',
        disqus: 'Simple blog server',
        social: {
            twitter: '',
            facebook: '',
            googleplus: '',
            pintrest: '',
            instagram: ''
        },
        static_files_path: '/Users/sorenso/html/',
        text_files_path: '/Users/sorenso/text-files/',
        //google_analytics: 'UA-xxxxxxxx-1',

        rewrites: [
            { url: '/photoalbum/view.*', target: '/web/?q=', code: 302, use_url: true, regex: /^\/photoalbum\/view\/(.+?)$/, regex_result: "$1" },
            { url: '/tools/.*', target: '/web/', code: 302 }
        ]
    },
    app: {
        port: 8080
    },
    template: {
        blog: 'test/template/blog.html',
        index: 'test/template/blog.html'
    },

    adapter: {
        mock_services: {
            //adapter: {
            //    service: {
            //        functions
            //    }
            //}
            elasticsearch: {
                elasticsearch: {
                    Client: function () {
                        var when   = require('when');
                        var article = {
                            tag_values: { toc: '', fact: '', artlist: '' },
                            published: '2014-01-01',
                            title: 'Simple blog 2',
                            img: [ 'simple-blog.jpg' ],
                            body: 'This is content number 2.',
                            file: 'index',
                            filename: 'my-path-to-the-files/content/articles/simple-blog/simple-blog.md',
                            base_href: '/simple-blog/'
                        };
                        return {
                            ping: function (opt, callback) {
                                callback(null, {status: 'ok'});
                            },
                            search: function (query) {
                                return when.promise(function (resolve, reject) {
                                    if (query.body.query.match === 'one-hit') {
                                        resolve({
                                            hits: {
                                                hits: [{
                                                    _source: article
                                                }]
                                            },
                                            query: query
                                        });
                                    } else if (query.body.query.match === 'no-hit') {
                                        resolve({
                                            hits: {
                                                hits: []
                                            },
                                            query: query
                                        });
                                    } else if (query.body.query.match === 'two-hit') {
                                        resolve({
                                            hits: {
                                                hits: [{
                                                    _source: article
                                                }, {
                                                    _source: article
                                                }]
                                            },
                                            query: query
                                        });
                                    }
                                });
                            },
                            index: function (obj, callback) {
                                callback(null, {status: 'ok'});
                            }
                        };
                    }
                }
            }
        },
        current: 'markdown',
        markdown: {
            content_path: __dirname + '/../test/content/articles/',
            photo_path: __dirname + '/../test/content/images/',
            max_articles: 500,
        },
        postgresql: {
            username: '',
            password: '',
            server: '127.0.0.1',
            port: '5432',
            database: 'test',
            article_table: 'article',
            category_table: 'category'
        },
        elasticsearch: {
            server: '127.0.0.1',
            port: 9200,
            index: 'twitter',
            type: 'tweet'
        }
    }
};