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
        static_files_path: '/Users/sorenso/html/',
        text_files_path: '/Users/sorenso/text-files/',
        top_image: false, // Don't use image[0] as top image on site. Use top_image instead.
        simple_header: false, // Use simple header instead of top panorama
        //google_analytics: 'UA-xxxxxxxx-1',
        //google_tag_manager: 'GTM-xxxxxx',
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
            { url: '/wip4/.*', target: '/search/?q=', code: 302, use_url: true, regex: /^\/wip4\/(.+?)\/.+?$/, regex_result: "$1" },
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
            content_path: __dirname + '/../content/articles/',
            photo_path: __dirname + '/../content/images/',
            max_articles: 500,
        },
        postgresql: {
            username: '',
            password: '',
            server: '127.0.0.1',
            port: '5432',
            database: 'nils',
            article_table: 'article',
            category_table: 'category',
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