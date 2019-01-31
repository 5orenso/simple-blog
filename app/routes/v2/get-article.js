/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const routeName = __filename.slice(__dirname.length + 1, -3);
const routePath = __dirname.replace(/.+\/routes/, '');
const webUtil = require('../../../lib/web-util');
const Article = require('../../../lib/class/article');

module.exports = async (req, res) => {
    const hrstart = process.hrtime();
    webUtil.printIfDev(`Route: ${routePath}/${routeName}`, req.query, req.param);
    const article = new Article();

    let query = {
        id: req.params.id,
    };
    if (!req.params.id && req.params.filename) {
        query = {
            category: req.params.category,
            filename: req.params.filename,
        };
    }

    const myArticle = await article.findOne(query)
    const artlist = await article.find({ category: req.params.category });

    webUtil.sendResultResponse(req, res, {
        article: myArticle,
        artlist,
    }, {
        hrstart,
        routePath,
        routeName,
        useTemplatePath: true,
        useTemplate: '/bootstrap4/blog_v2.html',
    });
};
