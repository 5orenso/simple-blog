/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const { run, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });
const Category = require('../../../lib/class/category');

const fields = {
    id: 1,
    createdDate: 1,
    updatedDate: 1,
    title: 1,
    titleEn: 1,
    hideTitle: 1,
    subTitle: 1,
    image: 1,
    type: 1,
    menu: 1,
    limit: 1,
    skipDefaultArtLink: 1,
    useImageOneAsBackground: 1,
    startPageAtTop: 1,
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
    hideLanguage: 1,
    showBottomArticleList: 1,
    artlistSkipLinkTarget: 1,
    artlistCategory: 1,
    sort: 1,
    url: 1,
    header: 1,
    headerDetail: 1,
    footer: 1,
    footerDetail: 1,
    dropdown: 1,
    dropdownEn: 1,
    colorMenu: 1,
    menuCss: 1,
    logoCss: 1,
    artlistCss: 1,
    pageFont: 1,
    pageFontCss: 1,
    globalStyle: 1,
    detailContainerCss: 1,
    listStyle: 1,

    artlistImageCss: 1,

    artlistColClass: 1,
    artlistRowClass: 1,
    artlistContainerClass: 1,
    artlistImageClass: 1,
    artlistTitleClass: 1,
    artlistTeaserClass: 1,

    artlistImageSize: 1,

    colorJumbotron: 1,
    colorMain: 1,
    colorBottom: 1,
    bgColorMenu: 1,
    bgColorJumbotron: 1,
    bgColorMain: 1,
    bgColorBottom: 1,
    bgImageMain: 1,
    bgImageMenu: 1,
    bgImageBottom: 1,
    footerCol1: 1,
    footerCol2: 1,
    footerCol3: 1,
    footerCol1En: 1,
    footerCol2En: 1,
    footerCol3En: 1,
};

module.exports = async (req, res) => {
    run(req);

    const cat = new Category();

    let query = { id: req.params.id };
    if (!req.params.id && req.query.category) {
        query = { title: req.query.category };
    }
    query = webUtil.cleanObject(query);
    const limit = parseInt(req.query.limit || 10, 10);
    const skip = parseInt(req.query.offset || 0, 10);

    const inputFieldInts = ['menu'];
    const inputFields = ['category'];
    for (let i = 0, l = inputFieldInts.length; i < l; i += 1) {
        const field = inputFieldInts[i];
        if (req.query[field]) {
            query[field] = parseInt(req.query[field], 10);
        }
    }
    for (let i = 0, l = inputFields.length; i < l; i += 1) {
        const field = inputFields[i];
        if (req.query[field]) {
            query[field] = req.query[field];
        }
    }

    let apiContent;
    let total;
    const data = {};
    if (query.id) {
        apiContent = await cat.findOne(query, fields);
        data.category = apiContent;
    } else {
        apiContent = await cat.find(query, fields, { limit, skip });
        data.catlist = apiContent;
        total = await cat.count(query);
        data.total = total;
    }

    data.imageServer = req.config.blog.imageServer;
    data.imagePath = req.config.blog.imagePath;

    utilHtml.renderApi(req, res, 200, data);
};
