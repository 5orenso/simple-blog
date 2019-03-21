/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const { routeName, routePath, run, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });
const Article = require('../../../lib/class/article');

const fields = {
    id: 1,
    status: 1,
    published: 1,
    author: 1,
    category: 1,
    title: 1,
    teaser: 1,
    body: 1,
    img: 1,
    tags: 1,
    youtube: 1,
    imageObject: 1,
    video: 1,
    aggregateRating: 1,
    nutrition: 1,
};

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    const art = new Article();

    let query = {};
    if (req.params.id) {
        query.id = parseInt(req.params.id, 10);
    } else if (req.params.category) {
        query.category = req.params.category;
    }

    query = webUtil.cleanObject(query);
    const limit = parseInt(req.query.limit || 10, 10);
    const skip = parseInt(req.query.offset || 0, 10);

    let apiContent;
    let total;
    let data = {};
    if (req.query.query) {
        const { list, total } = await art.search(req.query.query, {}, { limit, skip, query });
        data.artlist = list;
        data.total = total;
    } else if (query.id) {
        apiContent = await art.findOne(query, fields);
        data.article = apiContent;
    } else {
        apiContent = await art.find(query, fields, { limit, skip });
        data.artlist = apiContent;
        total = await art.count(query);
        data.total = total;
    }

    utilHtml.renderApi(req, res, 200, data);
};