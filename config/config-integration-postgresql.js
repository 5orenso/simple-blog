module.exports = {
    version: 1,
    blog: {
        title: 'Simple Blog Server',
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
        text_files_path: '/Users/sorenso/text-files/'
    },
    app: {
        port: 8080
    },

    adapter: {
        current: 'postgresql',
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
            database: 'nils',
            article_table: 'wip_article',
            category_table: 'wip_category'
        }
    }
};