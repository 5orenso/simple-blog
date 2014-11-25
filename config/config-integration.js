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
        //google_analytics: 'UA-xxxxxxxx-1'
    },
    app: {
        port: 8080
    },
    template: {
        blog: 'test/template/blog.html',
        index: 'test/template/blog.html'
    },

    adapter: {
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
        }
    }
};