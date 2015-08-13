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
        staticFilesPath: '/Users/sorenso/html/',
        textFilesPath: '/Users/sorenso/text-files/'
    },
    app: {
        port: 8080
    },
    template: {
        blog: 'template/current/blog.html',
        index: 'template/current/blog.html'
    },
    adapter: {
        current: 'postgresql',
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
            database: 'nils',
            articleTable: 'wip_article',
            categoryTable: 'wip_category'
        }
    }
};