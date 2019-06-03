/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const { routeName, routePath, run, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });
const Category = require('../../../lib/class/category');

const fields = {
    id: 1,
    createdDate: 1,
    updatedDate: 1,
    title: 1,
    url: 1,
    header: 1,
    headerDetail: 1,
    footer: 1,
    footerDetail: 1,
};

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    const cat = new Category();

    let query = {
        id: req.params.id,
    };
    if (!req.params.id && req.query.category) {
        query = {
            title: req.query.category,
        };
    }
    query = webUtil.cleanObject(query);
    const limit = parseInt(req.query.limit || 10, 10);
    const skip = parseInt(req.query.offset || 0, 10);

    let apiContent;
    let total;
    let data = {};
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
