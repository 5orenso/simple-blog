/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const { routeName, routePath, run, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });

const Article = require('../../../lib/class/article');
const Category = require('../../../lib/class/category');

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    const art = new Article();
    const cat = new Category();

console.log('session', req.session.email);

    let isDetailView = false;
    let isCategoryView = false;
    const query = {
        status: 2,
    };
    if (req.session.email) {
        delete query.status;
    }
    if (req.params.id) {
        isDetailView = true;
        query.id = parseInt(req.params.id, 10);
    } else if (req.params.filename) {
        isDetailView = true;
        query.filename = req.params.filename;
    } else if (req.params.category) {
        query.category = req.params.category;
    }

    const queryList = {
        status: 2,
    };
    const queryCategory = {};
    if (req.params.category) {
        isCategoryView = true;
        queryList.category = req.params.category;
        queryCategory.title = req.params.category;
    }

    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit || 10, 10);
    const skip = parseInt((page - 1) * limit || 0, 10);

    const article = await art.findOne(query);
    const artlist = await art.find(queryList, {}, { limit, skip });
    const artlistTotal = await art.count(queryList);

    const category = await cat.findOne(queryCategory);
    const catlist = await cat.find();

    utilHtml.runPlugins(article);

    const template = (req.params.id || req.params.filename) ? '/bootstrap4/blog_v2.html' : '/bootstrap4/index_v2.html';

    webUtil.sendResultResponse(req, res, {
        article,
        artlist,
        artlistTotal,
        category,
        catlist,
        limit,
        page,
        skip,
        isDetailView,
        isCategoryView,
    }, { runId, routePath, routeName, hrstart, useTemplate: template });
};
