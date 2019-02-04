/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const { routeName, routePath, run, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });
const Article = require('../../../lib/class/article');

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    const art = new Article();

    let query = {
        id: req.params.id,
    };
    if (!req.params.id && req.query.category) {
        query = {
            category: req.query.category,
        };
    }

    let apiContent;
    if (query.id) {
        apiContent = await art.findOne(query);
    } else {
        apiContent = await art.find(query);

    }

    utilHtml.renderApi(req, res, 200, apiContent);
};
