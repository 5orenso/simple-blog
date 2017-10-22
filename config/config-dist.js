module.exports = {
    version: 1,
    jwt: {
        secret: 'This is the JWT secret',
    },
    sendgrid: {
        apiKey: 'Your Sendgrid API key which should be kept secret.',
    },
    blog: {
        title: 'Simple Blog Server',
        description: 'Her skriver jeg hovedsaklig på norsk om det ikke skulle være noe helt spesielt. Jeg skriver om det jeg bruker tiden min på, som er tur, foto, hundekjøring, hacking, fikling og mye annet.',
        disqus: 'sorenso',
        slogun: '',
        protocol: 'http',
        domain: 'www.litt.no',
        tags: '',
        copyright: 'Copyright 2014-2016 Sorenso, litt.no',
        email: 'sorenso@gmail.com',
        searchResults: 'Blog posts related to ',
        showListOnIndex: 1,
        social: {
            twitter: '',
            facebook: '',
            googleplus: '',
            pintrest: '',
            instagram: ''
        },
        socialUser: {
            twitter: 'sorenso',
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
                imageLarge: '/pho/profile/fish_oistein.jpg?w=150',
                nameFull: 'Øistein Sørensen',
                name: '<a href="https://twitter.com/sorenso">Sorenso</a>',
                description: 'Hacking, foto, fiske, jakt, sykling og skikjøring. Og mange andre ting jeg har altfor lite tid til :P',
                facebook: 'https://facebook.com/sorenso',
                twitter: 'https://twitter.com/sorenso',
                // google_plus: 'https://instagram.com/sorenso',
                linkedin: 'https://www.linkedin.com/in/sorenso/',
                instagram: 'https://instagram.com/sorenso',
            },
            sorenso: {
                image: '/pho/profile/fish_oistein.jpg?w=50',
                imageLarge: '/pho/profile/fish_oistein.jpg?w=150',
                nameFull: 'Øistein Sørensen',
                name: '<a href="https://twitter.com/sorenso">Sorenso</a>',
                description: 'Hacking, foto, fiske, jakt, sykling og skikjøring. Og mange andre ting jeg har altfor lite tid til :P',
                facebook: 'https://facebook.com/sorenso',
                twitter: 'https://twitter.com/sorenso',
                // google_plus: 'https://instagram.com/sorenso',
                linkedin: 'https://www.linkedin.com/in/sorenso/',
                instagram: 'https://instagram.com/sorenso',
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
        // blog: 'template/current/blog.html',
        blog: 'template/kotha/single-page.html',
        // index: 'template/current/blog.html'
        index: 'template/kotha/index.html'
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
        elasticsearch: {
            //server: '172.30.0.227',
            server: '127.0.0.1',
            port: 9200,
            index: 'litt.no',
            type: 'article',
            multiMatchType: 'best_fields',
            multiMatchTieBreaker: 0.3
        }
    },
    udp: {
        ip: '127.0.0.1',
        port: 9990,
        prefix: 'simpleblog.dev',
        host: 'litt.no'
    }
};
