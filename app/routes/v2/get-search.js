/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const { routeName, routePath, run, webUtil, util } = require('../../middleware/init')({ __filename, __dirname });

const Article = require('../../../lib/class/article');
const Category = require('../../../lib/class/category');

module.exports = async (req, res) => {
    const { hrstart, runId } = run(req);

    const art = new Article();
    const cat = new Category();
    const catMenu = new Category();

    const query = { status: 2 };
    if (req.params.category) {
        query.category = req.params.category;
    }
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit || 10, 10);
    const skip = parseInt((page - 1) * limit || 0, 10);

    const contentCatlist = await cat.find({ type: { $nin: [2, 3] } });
    query.categoryId = { $in: contentCatlist.map(c => c.id) };

    // const article = await art.findOne(query);
    const { list, total } = await art.search(req.query.q, {}, { limit, skip, query });
    const artlist = list;
    const artlistTotal = total;

    const category = await cat.findOne({ title: req.params.category });
    const catlist = await catMenu.find({ menu: 1 });

    const template = (req.params.id || req.params.filename) ? '/bootstrap4/blog_v2.html' : '/bootstrap4/index_v2.html';

    const language = req.cookies.language;

    webUtil.sendResultResponse(req, res, {
        artlist: util.useLanguage(artlist, language),
        artlistTotal,
        category: util.useLanguage(category, language),
        catlist: util.useLanguage(catlist, language),
        limit,
        page,
        skip,
        imageServer: req.config.blog.imageServer,
        imagePath: req.config.blog.imagePath,
    }, { runId, routePath, routeName, hrstart, useTemplate: template });
};
