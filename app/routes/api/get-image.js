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
    geo: 1,
    features: 1,
    predictions: 1,
    predictionsCocoSsd: 1,
    faceDetections: 1,
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

    // Fields to consider:
    const queryFieldsString = [
        'name',
        'newName',
        'exif.model',
        'exif.lensModel',
        'exif.exposureTime',
        'exif.photographicSensitivity',
        'geo.display_name',
    ];
    const queryFieldsNumber = [
        'exif.fNumber',
        'exif.focalLength',
    ];
    const queryFieldsArrayObject = [
        ['predictions.className', { probability: { $gte: 0.2 } }],
        ['predictionsCocoSsd.class', { score: { $gte: 0 } }],
        ['faceDetections.expressions.expression', { probability: { $gte: 0.6 } }],
    ];
    for (let i = 0, l = queryFieldsString.length; i < l; i += 1) {
        const field = queryFieldsString[i];
        if (req.query.hasOwnProperty(field)) {
            // TODO: Should santitize this field.
            query[field] = { $regex: req.query[field], $options: 'i' };
        }
    }
    for (let i = 0, l = queryFieldsNumber.length; i < l; i += 1) {
        const field = queryFieldsNumber[i];
        if (req.query.hasOwnProperty(field)) {
            // TODO: Should santitize this field.
            query[field] = parseFloat(req.query[field]);
        }
    }
    for (let i = 0, l = queryFieldsArrayObject.length; i < l; i += 1) {
        const arrayField = queryFieldsArrayObject[i];
        const field = arrayField[0];
        const fieldQuery = arrayField[1];
        if (req.query.hasOwnProperty(field)) {
            // TODO: Should santitize this field.
            const parts = field.split('.');
            const objKey = parts.pop();
            const arrayName = parts.join('.');
            query[arrayName] = { $elemMatch: { [objKey]: req.query[field], ...fieldQuery } };
        }
    }

    // console.log('====> query', query);

    query = webUtil.cleanObject(query);
    const limit = parseInt(req.query.limit || 10, 10);
    const skip = parseInt(req.query.offset || 0, 10);

    let apiContent;
    let total;
    let data = {};
    const searchQuery = (req.query.query || '').trim();
    if (searchQuery) {
        const { list, total } = await img.search(searchQuery, {}, { limit, skip, query });
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

    data.imageServer = req.config.blog.imageServer;
    data.imagePath = req.config.blog.imagePath;

    utilHtml.renderApi(req, res, 200, data);
};
