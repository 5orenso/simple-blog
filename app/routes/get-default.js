/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const _ = require('underscore');
const path = require('path');
const swig = require('../../lib/swig');
const Category = require('../../lib/category');
const Article = require('../../lib/article');
const ArticleUtil = require('../../lib/article-util');
const webUtil = require('../../lib/web-util');
const Logger = require('../../lib/logger');

const articleUtil = new ArticleUtil();
const logger = new Logger();

const appPath = `${__dirname}/../../`;
const templatePath = path.normalize(`${appPath}template/current/`);
const photoPath = path.normalize(`${appPath}content/images/`);

module.exports = (req, res) => {
    // Check for redirect
    let requestUrl = articleUtil.getUrlFromRequest(req);
    if (_.isObject(req.config.blog) && _.isArray(req.config.blog.rewrites)) {
        for (let i = 0, l = req.config.blog.rewrites.length; i < l; i += 1) {
            if (req.config.blog.rewrites[i]) {
                const rewrite = req.config.blog.rewrites[i];
                if (requestUrl.match(rewrite.url)) {
                    // console.log('Rewriting...', rewrite);
                    let target = rewrite.target;
                    if (rewrite.useUrl && rewrite.regex) {
                        requestUrl = requestUrl.replace(rewrite.regex, rewrite.regexResult);
                        target += requestUrl;
                    }
                    return res.redirect(rewrite.code, target);
                }
            }
        }
    }

    if (req.config.blog.version === 2) {
        return res.redirect(`/v2${req.originalUrl}`);
    }

    const article = new Article({
        logger,
        photoPath,
        config: req.config,
    });
    const category = new Category({
        logger,
        config: req.config,
    });

    // Resolve filename
    const inputQuery = req.query;
    let footerFileContent;

    // Load content based on filename
    const articleAllPath = articleUtil.getArticlePathRelative('/');
    const articlePath = articleUtil.getArticlePathRelative(requestUrl);

    const absoluteContentPath = path.normalize(req.config.adapter.markdown.contentPath + articlePath);
    const footerFilePromise = webUtil.loadFile(`${absoluteContentPath}_footer.html`)
        .then((result) => {
            footerFileContent = result;
        })
        .catch((err) => {
            console.error('NOT FOUND', err);
            return undefined;
        });

    if (typeof req.session === 'object' && req.session.iat) {
        const now = parseInt((new Date()).getTime() / 1000, 10);
        req.session.age = now - req.session.iat;
    }
    // Check for cached file
    // If not cached compile file and store it.
    // TODO: How do we bypass the cache?
    const file = articleUtil.getArticleFilename(requestUrl);
    let template = templatePath + (file === 'index' ? 'index.html' : 'blog.html');

    if (_.isObject(req.config.template)) {
        template = appPath + (file === 'index' ? req.config.template.index : req.config.template.blog);
    }
    // var template = 'blog.html';
    const tpl = swig.compileFile(template);
    let headerArticle;

    Promise.all([
        category.list('/'),
        article.list(articlePath),
        article.list(articleAllPath),
        article.load({
            requestUrl: `${articlePath}_header${file === 'index' ? '' : '_detail'}.md`,
            catlist: [],
            artlist: [],
            artlistAll: [],
        }).catch(err => console.error(err)),
        footerFilePromise,
    ])
        .then((contentLists) => {
            headerArticle = contentLists[3];
            return article.load({
                requestUrl,
                catlist: contentLists[0],
                artlist: contentLists[1],
                artlistall: contentLists[2],
            });
        })
        .then(($resultArticle) => {
            const resultArticle = $resultArticle;
            for (let i = 0, l = resultArticle.artlist.length; i < l; i += 1) {
                const art = resultArticle.artlist[i];
                if (resultArticle.file === art.file) {
                    resultArticle.next = resultArticle.artlist[i - 1];
                    resultArticle.previous = resultArticle.artlist[i + 1];
                }
            }
            resultArticle.artlistTotal = resultArticle.artlist.length;
            let htmlContent = tpl({
                file: {
                    name: file,
                    path: articlePath,
                },
                header: headerArticle,
                blog: req.config.blog,
                article: resultArticle,
                query: inputQuery,
                session: req.session,
            });

            if (footerFileContent) {
                htmlContent = htmlContent.replace(/\[\[FOOTER\]\]/, footerFileContent);
            }

            res.send(htmlContent);
        })
        .catch((opt) => {
            res.status(404).send(tpl({
                header: headerArticle,
                blog: req.config.blog,
                error: opt.error,
                article: opt.article,
                query: inputQuery,
            }));
        });
};
