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
        staticFilesPath: '/Users/sorenso/html/',
        textFilesPath: '/Users/sorenso/text-files/',
        //google_analytics: 'UA-xxxxxxxx-1',

        rewrites: [
            { url: '/photoalbum/view.*', target: '/web/?q=', code: 302, useUrl: true, regex: /^\/photoalbum\/view\/(.+?)$/, regexResult: "$1" },
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
    log: {
        level   : 'debug', // debug|info|notice|warning|error|crit|alert|emerg
        console : true
    },
    adapter: {
        mockServices: {
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
                            tagValues: { toc: '', fact: '', artlist: '' },
                            published: '2014-01-01',
                            title: 'Simple blog 2',
                            img: [ 'simple-blog.jpg' ],
                            body: 'This is content number 2.',
                            file: 'index',
                            filename: 'my-path-to-the-files/content/articles/simple-blog/simple-blog.md',
                            baseHref: '/simple-blog/'
                        };
                        return {
                            ping: function (opt, callback) {
                                callback(null, {status: 'ok'});
                            },
                            search: function (query) {
                                return when.promise(function (resolve, reject) {
                                    //console.log('elasticsearch for: ', query.body.query.match._all);
                                    if (query.body.query.match._all === 'one-hit') {
                                        //console.log('elasticsearch : ONE HIT');
                                        resolve({
                                            hits: {
                                                hits: [{
                                                    _source: article
                                                }]
                                            },
                                            query: query
                                        });
                                    } else if (query.body.query.match._all === 'no-hit') {
                                        //console.log('elasticsearch : NO HIT');
                                        resolve({
                                            hits: {
                                                hits: []
                                            },
                                            query: query
                                        });
                                    } else if (query.body.query.match._all === 'two-hit') {
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
                                    } else if (query.body.query.match._all === 'blow-up') {
                                        reject('search inside elasticsearch mock failed, because you asked it to do so :)');
                                    } else {
                                        resolve({
                                            hits: {
                                                hits: [{
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
            contentPath: __dirname + '/../test/content/articles/',
            photoPath: __dirname + '/../test/content/images/',
            maxArticles: 500,
        },
        postgresql: {
            username: '',
            password: '',
            server: '127.0.0.1',
            port: '5432',
            database: 'test',
            articleTable: 'article',
            categoryTable: 'category'
        },
        elasticsearch: {
            server: '127.0.0.1',
            port: 9200,
            index: 'twitter',
            type: 'tweet'
        }
    }
};