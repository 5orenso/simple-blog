/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const commander = require('commander');
const Logger = require('../lib/logger');
const LocalUtil = require('../lib/local-util');
const Article = require('../lib/article');
const Category = require('../lib/category');
const Search = require('../lib/search');

const logger = new Logger({});

commander
    .option('-c, --config <file>', 'configuration file path', './config/config.js')
    .parse(process.argv);

// eslint-disable-next-line
const config = require(commander.config);
const lu = new LocalUtil({ config });

const articlePath = '/'; // articleUtil.getArticlePathRelative('');

// Load from function
const article = new Article({
    logger,
    // filename: '',
    // articlePath: articlePath,
    domain: config.blog.domain,
    protocol: config.blog.protocol,
    maxArticlesInArtlist: 5000,
    config,
});

const category = new Category({
    logger,
    config,
});

const search = new Search({
    logger,
    config,
});

lu.timersReset();
lu.timer('routes/sitemap->request');

Promise.all([category.list('/'), article.list(articlePath)])
    .then((contentLists) => {
        lu.timer('routes/sitemap->load_category_and_article_lists');
        Promise.all([
            article.sitemap(contentLists[0], contentLists[1]),
            search.indexArtlist(contentLists[1], true),
        ])
            .then(results => results)
            .catch(err => console.error(err));
    })
    .then(() => {
        console.log('done...');
        lu.timer('routes/sitemap->elasticsearch');
        lu.timer('routes/sitemap->request');
        // lu.sendUdp({timers: lu.timersGet()});
        setTimeout(() => {
            process.exit(1);
        }, 5000);
    })
    .catch(() => {
        lu.timer('routes/sitemap->request');
        lu.timer('routes/sitemap->load_category_and_article_lists');
        // lu.sendUdp({timers: lu.timersGet()});
        // res.status(404).send(tpl({blog: webRouter.config.blog, error: opt.error, article: opt.article}));
    });
