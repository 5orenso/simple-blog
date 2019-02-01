/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const { routeName, routePath, run, webUtil } = require('../../middleware/init')({ __filename, __dirname });

const Article = require('../../../lib/class/article');
const Category = require('../../../lib/class/category');

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    const art = new Article();
    const cat = new Category();

    let query = {
        id: req.params.id,
    };
    if (!req.params.id && req.params.category) {
        query = {
            category: req.params.category,
            filename: req.params.filename,
        };
    }

    const article = await art.findOne(query);
    const artlist = await art.find({ category: req.params.category });
    const catlist = await cat.find();

    webUtil.sendResultResponse(req, res, {
        article,
        artlist,
        catlist,
    }, { runId, routePath, routeName, hrstart, useTemplate: '/bootstrap4/blog_v2.html' });
};
