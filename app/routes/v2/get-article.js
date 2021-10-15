/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const tc = require('fast-type-check');
const { routeName, routePath, run, webUtil, utilHtml, util } = require('../../middleware/init')({ __filename, __dirname });

const Article = require('../../../lib/class/article');
const Category = require('../../../lib/class/category');

module.exports = async (req, res) => {
    const { hrstart, runId } = run(req);

    const art = new Article();
    const artFrontpage = new Article();
    const artFrontpageBanner = new Article();
    const artAds = new Article();
    const artAdsLower = new Article();
    const artAdsLowerUpper = new Article();
    const artBottom = new Article();

    const catFrontpage = new Category();
    const catFrontpageBanner = new Category();
    const catMenu = new Category();
    const catAds = new Category();
    const catAdsLower = new Category();
    const catAdsLowerUpper = new Category();
    const cat = new Category();
    const catBottom = new Category();

    let isFrontpage = true;
    let isDetailView = false;
    let isCategoryView = false;
    let previousArticle;
    let nextArticle;
    let category;
    let frontpage;
    let contentCatlist;

    let limit = parseInt(req.query.limit || 10, 10);
    const page = parseInt(req.query.page, 10) || 1;
    const skip = parseInt((page - 1) * limit || 0, 10);

    const query = { status: 2 };
    const queryList = { status: 2 };
    const queryFrontpage = { status: 2 };
    let queryCategory = {};
    let queryAds = {};
    let queryAdsLower = {};
    let queryAdsLowerUpper = {};

    if (req.query.previewJwtToken) {
        const jwtData = util.decodeJwtToken(req.query.previewJwtToken, req.config);
        if (jwtData.readAccess) {
            // console.log('= = = = = > ', util.decodeJwtToken(req.query.previewJwtToken, req.config));
            delete query.status;
        }
    }
    // = = = = = >  { readAccess: 1, iat: 1570090308 }
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
                { url2: { $regex: new RegExp(req.params.category) } },
            ],
        };
        category = await cat.findOne(queryCategory);
        if (!category) {
            category = {
                id: 100000404,
                title: '404 - Not found',
                skipDefaultArtLink: 1,
                hideOnFrontpage: 1,
                hideTranslateLinks: 1,
                hideTopImage: 1,
                hidePrevNext: 1,
                hideArticleList: 1,
                hideMetaInfo: 1,
                hideMetaInfoDetail: 1,
                hideMetaInfoDetailAdvanced: 1,
                hideAuthorInfo: 1,
                hideFrontpageTitle: 1,
                hideFrontpageTeaser: 1,
                hideFrontpagePagination: 1,
                hideCategoryTopArticle: 1,
            };
        }
        limit = category.limit || limit;
        queryList.categoryId = category.id;
        query.categoryId = category.id;
        contentCatlist = await cat.find({ ...queryCategory, type: { $nin: [1, 2, 3, 4, 6, 7] } });
    } else {
        contentCatlist = await cat.find({
            type: { $nin: [1, 2, 3, 4, 6, 7] },
            hideOnFrontpage: { $ne: 1 },
        });
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
        if (page <= 1) {
            frontpagelist = await artFrontpage.find(queryFrontpage, {}, { limit });
        }
        if (tc.isArray(frontpagelist)) {
            for (let i = 0, l = frontpagelist.length; i < l; i += 1) {
                frontpagelist[i].isFrontpage = 1;
                frontpagelist[i].catRef = frontpage;

            }
        }
        if (isFrontpage && page <= 1) {
            limit = frontpage.limit >= 0 ? frontpage.limit : limit;
            if (frontpage.artlistCategory) {
                queryList.categoryId = frontpage.artlistCategory;
            }
        }
    }

    limit = parseInt(limit, 10);

    let article = await art.findOne(query);
    let artlist = [];
    if (category && category.id === 100000404) {
        article = {
            categoryId: 100000404,
            id: 100000404,
            title: '404 - Page not found',
            body: '<div class="display-1 text-muted text-center mb-4"><i class="fas fa-wrench"></i></div> <div class="text-center">Please use the menu to navigate or search for the content you are looking for.</div>',
        };
        artlist = [article];
        contentCatlist.push(category);
    } else if (limit > 0) {
        artlist = await art.find(queryList, {}, { limit, skip });
    }

    if (tc.isObject(article)) {
        article.catRef = contentCatlist.find(c => c.id === article.categoryId);
    }
    if (tc.isArray(artlist)) {
        artlist.forEach((a) => {
            a.catRef = contentCatlist.find(c => c.id === a.categoryId);
        });
    }
    if (!isFrontpage && !isDetailView && artlist.length === 1) {
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
        queryAdsLower = { type: 8 };
        queryAdsLowerUpper = { type: 23 };
    } else {
        queryAds = { type: 3 };
        queryAdsLower = { type: 4 };
        queryAdsLowerUpper = { type: 22 };
    }

    const frontpageBannercats = await catFrontpageBanner.find({ type: 24 });
    const artlistFrontpageBanner = await artFrontpageBanner.find({ status: 2, categoryId: { $in: frontpageBannercats.map(c => c.id) } });
    if (tc.isArray(artlistFrontpageBanner)) {
        artlistFrontpageBanner.forEach((a) => {
            a.catRef = frontpageBannercats.find(c => c.id === a.categoryId);
        });
    }
    if (isFrontpage && frontpagelist.length > 0) {
        artlist = frontpagelist.concat(artlist);
    }

    const artlistTotal = await art.count(queryList);

    if (tc.isObject(article)) {
        article.bodyRaw = `${article.body}`;
        article.body = utilHtml.replaceDataTags(article.body || '', article);
        article.body = utilHtml.replaceContentTags(article.body || '', article, req.config);
        utilHtml.runPlugins(article);
    }
    
    const adcats = await catAds.find(queryAds);
    const adlist = await artAds.find({ status: 2, categoryId: { $in: adcats.map(c => c.id) } });
    if (tc.isArray(adlist)) {
        adlist.forEach((a) => {
            a.catRef = adcats.find(c => c.id === a.categoryId);
        });
    }

    const adcatsLower = await catAdsLower.find(queryAdsLower);
    const adlistLower = await artAdsLower.find({ status: 2, categoryId: { $in: adcatsLower.map(c => c.id) }});
    if (tc.isArray(adlistLower)) {
        adlistLower.forEach((a) => {
            a.catRef = adcatsLower.find(c => c.id === a.categoryId);
        });
    }

    const adcatsLowerUpper = await catAdsLowerUpper.find(queryAdsLowerUpper);
    const adlistLowerUpper = await artAdsLowerUpper.find({ status: 2, categoryId: { $in: adcatsLowerUpper.map(c => c.id) }});
    if (tc.isArray(adlistLowerUpper)) {
        adlistLowerUpper.forEach((a) => {
            a.catRef = adcatsLowerUpper.find(c => c.id === a.categoryId);
        });
    }

    const artcatsBottom = await catBottom.find({ type: 7 });
    const artlistBottom = await artBottom.find({ status: 2, categoryId: { $in: artcatsBottom.map(c => c.id) }});
    if (tc.isArray(artlistBottom)) {
        artlistBottom.forEach((a) => {
            a.catRef = artcatsBottom.find(c => c.id === a.categoryId);
        });
    }

    article.metaDescription = util.getShortText(`${article.ingress || ''} ${article.bodyRaw || ''}`);
    article.words = util.getWords(article).join(',');

    const template = (req.params.id || req.params.filename) ? '/bootstrap4/blog_v2.html' : '/bootstrap4/index_v2.html';

    const language = req.cookies.language;
    const disableCookies = req.cookies.disableCookies === 'yes';

    return webUtil.sendResultResponse(req, res, {
        status: (category && category.id === 100000404) ? 404 : 200,
        article: util.useLanguage(article, language),
        previousArticle: util.useLanguage(previousArticle, language),
        nextArticle: util.useLanguage(nextArticle, language),
        frontpagelist: util.useLanguage(frontpagelist, language),
        artlist: util.useLanguage(artlist, language),
        artlistTotal,
        artlistBottom: util.useLanguage(artlistBottom, language),
        category: util.useLanguage(category, language),
        frontpage: util.useLanguage(frontpage, language),
        catlist: util.useLanguage(catlist, language),
        artlistFrontpageBanner: util.useLanguage(artlistFrontpageBanner, language),
        adlist,
        adlistLower,
        adlistLowerUpper,
        limit,
        page,
        skip,
        isDetailView,
        isCategoryView,
        isFrontpage,
        imageServer: req.config.blog.imageServer,
        imagePath: req.config.blog.imagePath,
        hasMoreLanguages: req.config.blog.hasMoreLanguages,
        originalUrl: req.originalUrl,
        language,
        disableCookies,
    }, { runId, routePath, routeName, hrstart, useTemplate: template });
};
