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
    hideTitle: 1,
    image: 1,
    type: 1,
    menu: 1,
    limit: 1,
    hideTopImage: 1,
    hidePrevNext: 1,
    hideArticleList: 1,
    hideMetaInfo: 1,
    hideMetaInfoDetail: 1,
    hideMetaInfoDetailAdvanced: 1,
    hideAuthorInfo: 1,
    hideFrontpageTitle: 1,
    hideFrontpageTeaser: 1,
    showBottomArticleList: 1,
    artlistCategory: 1,
    sort: 1,
    url: 1,
    header: 1,
    headerDetail: 1,
    footer: 1,
    footerDetail: 1,
    dropdown: 1,
    colorMenu: 1,
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

    utilHtml.renderApi(req, res, 200, data);
};
