/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const { routeName, routePath, run, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });
const Tag = require('../../../lib/class/tag');

const fields = {
    id: 1,
    createdDate: 1,
    title: 1,
};

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    const tag = new Tag();

    let query = {
        id: req.params.id,
    };
    if (!req.params.id && req.query.title) {
        query = {
            title: req.query.title,
        };
    }
    if (req.query.titleNin) {
        query = {
            title: { $nin: req.query.titleNin.split(',') },
        };
    }
    query = webUtil.cleanObject(query);
    const limit = parseInt(req.query.limit || 10, 10);
    const skip = parseInt(req.query.offset || 0, 10);

    let apiContent;
    let total;
    let data = {};
    if (req.query.query) {
        const { list, total } = await tag.search(req.query.query, {}, { limit, skip, query });
        data.taglist = list;
        data.total = total;
    } else if (query.id) {
        apiContent = await tag.findOne(query, fields);
        data.tag = apiContent;
    } else {
        apiContent = await tag.find(query, fields, { limit, skip });
        data.taglist = apiContent;
        total = await tag.count(query);
        data.total = total;
    }

    utilHtml.renderApi(req, res, 200, data);
};
