/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const { routeName, routePath, run, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });
const Author = require('../../../lib/class/author');

const fields = {
    id: 1,
    createdDate: 1,
    updatedDate: 1,
    name: 1,
    firstname: 1,
    lastname: 1,
    email: 1,
    image: 1,
};

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    const author = new Author();

    let query = {
        id: req.params.id,
    };
    if (!req.params.id && req.query.author) {
        query = {
            title: req.query.author,
        };
    }
    query = webUtil.cleanObject(query);
    const limit = parseInt(req.query.limit || 10, 10);
    const skip = parseInt(req.query.offset || 0, 10);

    let apiContent;
    let total;
    let data = {};
    if (query.id) {
        apiContent = await author.findOne(query, fields);
        data.author = apiContent;
    } else {
        apiContent = await author.find(query, fields, { limit, skip });
        data.authorlist = apiContent;
        total = await author.count(query);
        data.total = total;
    }

    utilHtml.renderApi(req, res, 200, data);
};
