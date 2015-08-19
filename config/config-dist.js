module.exports = {
    version: 1,
    blog: {
        title: 'Simple Blog Server',
        slogun: '',
        protocol: 'http',
        domain: 'www.litt.no',

        tags: '',
        copyright: 'Copyright 2014-2015 Sorenso, litt.no',
        email: 'sorenso@gmail.com',

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
        topImage: false, // Don't use image[0] as top image on site. Use topImage instead.
        simpleHeader: false, // Use simple header instead of top panorama
        //googleAnalytics: 'UA-xxxxxxxx-1',
        //googleTagManager: 'GTM-xxxxxx',
        //googleSiteVerification: ''
        author: {
            fallback: {
                image: '/pho/profile/fish_oistein.jpg?w=50',
                name: '<a href="https://twitter.com/sorenso">Sorenso</a>'
            },
            sorenso: {
                image: '/pho/profile/fish_oistein.jpg?w=50',
                name: '<a href="https://twitter.com/sorenso">Sorenso</a>',
            }
        },
        menu: [
            { name: 'iPad', url: 'ipad' },
            { name: 'iPhone', url: 'iphone' },
            { name: 'Mac', url: 'mac' }
        ],
        rewrites: [
            { url: '/wip4/.*', target: '/search/?q=', code: 302, useUrl: true, regex: /^\/wip4\/(.+?)\/.+?$/, regexResult: "$1" },
            { url: '/photoalbum/view.*', target: '/images/pix.gif', code: 302 },
            { url: '/tools/.*', target: '/', code: 302 }
        ]
    },
    app: {
        port: 8080
    },
    template: {
        blog: 'template/current/blog.html',
        index: 'template/current/blog.html'
    },
    log: {
        level   : 'info', // debug|info|notice|warning|error|crit|alert|emerg
        console : true
    },
    adapter: {
        current: 'markdown',
        //search_adapter: 'elasticsearch',
        markdown: {
            contentPath: __dirname + '/../content/articles/',
            photoPath: __dirname + '/../content/images/',
            maxArticles: 500,
        },
        postgresql: {
            username: '',
            password: '',
            server: '127.0.0.1',
            port: '5432',
            database: 'nils',
            articleTable: 'article',
            categoryTable: 'category',
        },
        elasticsearch: {
            //server: '172.30.0.227',
            server: '54.154.55.126',
            port: 9200,
            index: 'twitter',
            type: 'tweet'
        }
    },
    udp: {
        ip: '127.0.0.1',
        port: 9990,
        prefix: 'simpleblog.dev',
        host: 'litt.no'
    }
};