/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const { routeName, routePath, run, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });

const Article = require('../../../lib/class/article');
const Category = require('../../../lib/class/category');

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    const art = new Article();
    const cat = new Category();

    let query = {
        status: 2,
        id: parseInt(req.params.id, 10),
    };
    if (!req.params.id && req.params.category) {
        query = {
            status: 2,
            category: req.params.category,
            filename: req.params.filename,
        };
    }
    const queryList = {
        status: 2,
    };
    if (req.params.category) {
        queryList.category = req.params.category;
    }

    const article = await art.findOne(query);
    const artlist = await art.find(queryList);
    const artlistTotal = artlist.length;

    const category = await cat.findOne({ title: req.params.category });
    const catlist = await cat.find();

    utilHtml.runPlugins(article);

    const template = (req.params.id || req.params.filename) ? '/bootstrap4/blog_v2.html' : '/bootstrap4/index_v2.html';

    webUtil.sendResultResponse(req, res, {
        article,
        artlist,
        artlistTotal,
        category,
        catlist,
    }, { runId, routePath, routeName, hrstart, useTemplate: template });
};
