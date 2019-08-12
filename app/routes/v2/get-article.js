/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const tc = require('fast-type-check');
const { routeName, routePath, run, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });

const Article = require('../../../lib/class/article');
const Category = require('../../../lib/class/category');

module.exports = async (req, res) => {
    const { hrstart, runId } = run(req);

    const art = new Article();
    const artAds = new Article();
    const catMenu = new Category();
    const catAds = new Category();
    const cat = new Category();

    let isDetailView = false;
    let isCategoryView = false;
    let previousArticle;
    let nextArticle;
    let category;

    const query = { status: 2 };
    const queryList = { status: 2 };
    let queryCategory = {};

    if (req.session.email) {
        delete query.status;
    }

    if (req.params.category) {
        isCategoryView = true;
        queryCategory = {
            $or: [
                { title: req.params.category },
                { url: { $regex: new RegExp(req.params.category) } },
            ],
        };
        category = await cat.findOne(queryCategory);
        queryList.categoryId = category.id;
        query.categoryId = category.id;
    } else {
        const contentCatlist = await cat.find({ type: { $nin: [2, 3] } });
        queryList.categoryId = { $in: contentCatlist.map(c => c.id) };
    }

    const catlist = await catMenu.find({ menu: 1 });

    if (req.params.id) {
        isDetailView = true;
        query.id = parseInt(req.params.id, 10);
    } else if (req.params.filename) {
        isDetailView = true;
        query.filename = req.params.filename;
    }

    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit || 10, 10);
    const skip = parseInt((page - 1) * limit || 0, 10);

    if (req.query.tag) {
        queryList.tags = req.query.tag;
    }

    const article = await art.findOne(query);
    const artlist = await art.find(queryList, {}, { limit, skip });

    if (isDetailView) {
        const currentIdx = artlist.findIndex(x => x.id === article.id);
        if (typeof artlist[currentIdx - 1] === 'object') {
            previousArticle = artlist[currentIdx - 1];
        }
        if (typeof artlist[currentIdx + 1] === 'object') {
            nextArticle = artlist[currentIdx + 1];
        }
    }

    const artlistTotal = await art.count(queryList);

    if (tc.isObject(article)) {
        article.body = utilHtml.replaceDataTags(article.body || '', article);
        utilHtml.runPlugins(article);
    }

    const adcats = await catAds.find({ type: 2 });
    const adlist = await artAds.find({ categoryId: { $in: adcats.map(c => c.id) } });

    const template = (req.params.id || req.params.filename) ? '/bootstrap4/blog_v2.html' : '/bootstrap4/index_v2.html';

    webUtil.sendResultResponse(req, res, {
        article,
        previousArticle,
        nextArticle,
        artlist,
        artlistTotal,
        category,
        catlist,
        adlist,
        limit,
        page,
        skip,
        isDetailView,
        isCategoryView,
    }, { runId, routePath, routeName, hrstart, useTemplate: template });
};
