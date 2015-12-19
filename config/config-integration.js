module.exports = {
    version: 1,
    blog: {
        title: 'Simple Blog Server',
        slogun: '',
        protocol: 'http',
        domain: 'www.mydomain.no',
        disqus: 'Simple blog server',
        searchResults: 'blog posts related to ',
        social: {
            twitter: '',
            facebook: '',
            googleplus: '',
            pintrest: '',
            instagram: ''
        },
        staticFilesPath: '/Users/sorenso/html/',
        textFilesPath: '/Users/sorenso/text-files/',
        //googleAnalytics: 'UA-xxxxxxxx-1',
        //googleTagManager: 'GTM-xxxxxx',
        //googleSiteVerification: ''
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