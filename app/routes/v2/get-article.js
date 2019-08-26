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
    const artFrontpage = new Article();
    const artAds = new Article();
    const artAdsLower = new Article();
    const catFrontpage = new Category();
    const catMenu = new Category();
    const catAds = new Category();
    const catAdsLower = new Category();
    const cat = new Category();

    let isFrontpage = true;
    let isDetailView = false;
    let isCategoryView = false;
    let previousArticle;
    let nextArticle;
    let category;
    let frontpage;

    let limit = parseInt(req.query.limit || 10, 10);

    const query = { status: 2 };
    const queryList = { status: 2 };
    const queryFrontpage = { status: 2 };
    let queryCategory = {};
    let queryAds = {};

    if (req.session.email) {
        delete query.status;
    }

    if (req.params.category) {
        isCategoryView = true;
        isFrontpage = false;
        queryCategory = {
            $or: [
                { title: req.params.category },
                { url: { $regex: new RegExp(req.params.category) } },
            ],
        };
        category = await cat.findOne(queryCategory);
        limit = category.limit || limit;
        queryList.categoryId = category.id;
        query.categoryId = category.id;
    } else {
        const contentCatlist = await cat.find({ type: { $nin: [1, 2, 3, 4, 6] } });
        queryList.categoryId = { $in: contentCatlist.map(c => c.id) };
    }

    const catlist = await catMenu.find({ menu: 1 });

    if (req.params.id) {
        isFrontpage = false;
        isDetailView = true;
        query.id = parseInt(req.params.id, 10);
    } else if (req.params.filename) {
        isFrontpage = false;
        isDetailView = true;
        query.filename = req.params.filename;
    }

    if (req.query.tag) {
        queryList.tags = req.query.tag;
    }

    let frontpagelist = [];
    frontpage = await catFrontpage.findOne({ type: 1 });
    if (tc.isObject(frontpage)) {
        queryFrontpage.categoryId = frontpage.id;
        frontpagelist = await artFrontpage.find(queryFrontpage, {}, { limit });
        if (tc.isArray(frontpagelist)) {
            for (let i = 0, l = frontpagelist.length; i < l; i += 1) {
                frontpagelist[i].isFrontpage = 1;
            }
        }
        if (isFrontpage) {
            limit = frontpage.limit || limit;
        }
    }

    const page = parseInt(req.query.page, 10);
    const skip = parseInt((page - 1) * limit || 0, 10);
    limit = parseInt(limit, 10);

    const article = await art.findOne(query);
    let artlist = await art.find(queryList, {}, { limit, skip });

    if (tc.isObject(article)) {
        article.catRef = catlist.find(c => c.id === article.categoryId);
    }
    if (tc.isArray(artlist)) {
        artlist.forEach((a) => {
            a.catRef = catlist.find(c => c.id === a.categoryId);
        });
    }
    if (!isDetailView && artlist.length === 1) {
        const myArt = artlist[0];
        return res.redirect(302,
            `/v2/${utilHtml.asLinkPart(myArt.category)}/${utilHtml.asLinkPart(myArt.title)}/${myArt.id}`);
    }

    if (isDetailView) {
        const currentIdx = artlist.findIndex(x => x.id === article.id);
        if (typeof artlist[currentIdx - 1] === 'object') {
            previousArticle = artlist[currentIdx - 1];
        }
        if (typeof artlist[currentIdx + 1] === 'object') {
            nextArticle = artlist[currentIdx + 1];
        }
        queryAds = { type: 2 };
    } else {
        queryAds = { type: 3 };
    }

    if (isFrontpage && frontpagelist.length > 0) {
        artlist = frontpagelist.concat(artlist);
    }

    const artlistTotal = await art.count(queryList);

    if (tc.isObject(article)) {
        article.body = utilHtml.replaceDataTags(article.body || '', article);
        utilHtml.runPlugins(article);
    }
    
    const adcats = await catAds.find(queryAds);
    const adlist = await artAds.find({ status: 2, categoryId: { $in: adcats.map(c => c.id) } });
    if (tc.isArray(adlist)) {
        adlist.forEach((a) => {
            a.catRef = adcats.find(c => c.id === a.categoryId);
        });
    }

    const adcatsLower = await catAdsLower.find({ type: 4 });
    const adlistLower = await artAdsLower.find({ status: 2, categoryId: { $in: adcatsLower.map(c => c.id) }});
    if (tc.isArray(adlistLower)) {
        adlistLower.forEach((a) => {
            a.catRef = adcatsLower.find(c => c.id === a.categoryId);
        });
    }
    const template = (req.params.id || req.params.filename) ? '/bootstrap4/blog_v2.html' : '/bootstrap4/index_v2.html';

    return webUtil.sendResultResponse(req, res, {
        article,
        previousArticle,
        nextArticle,
        frontpagelist,
        artlist,
        artlistTotal,
        category,
        frontpage,
        catlist,
        adlist,
        adlistLower,
        limit,
        page,
        skip,
        isDetailView,
        isCategoryView,
        isFrontpage,
    }, { runId, routePath, routeName, hrstart, useTemplate: template });
};
