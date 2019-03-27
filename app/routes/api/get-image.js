/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const { routeName, routePath, run, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });
const Image = require('../../../lib/class/image');

const fields = {
    id: 1,
    status: 1,
    tags: 1,
    title: 1,
    body: 1,
    src: 1,
    encoding: 1,
    ext: 1,
    mimetype: 1,
    name: 1,
    newFilename: 1,
    stats: 1,
    exif: 1,
    features: 1,
    predictions: 1,
    predictionsCocoSsd: 1,
};

// db.getCollection('image').find({ predictions: { $elemMatch: { className: 'alp', probability: { $gt: 0.5 } } } })

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    const img = new Image();

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
    if (req.query.query.trim()) {
        const { list, total } = await img.search(req.query.query, {}, { limit, skip, query });
        data.imglist = list;
        data.total = total;
    } else if (query.id) {
        apiContent = await img.findOne(query, fields);
        data.image = apiContent;
    } else {
        apiContent = await img.find(query, fields, { limit, skip });
        data.imglist = apiContent;
        total = await img.count(query);
        data.total = total;
    }

    utilHtml.renderApi(req, res, 200, data);
};
