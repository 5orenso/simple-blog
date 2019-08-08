/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const { run, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });
const Iot = require('../../../lib/class/iot');

const fields = {
    id: 1,
    createdDate: 1,
    updatedDate: 1,
    title: 1,
    alias: 1,
    type: 1,
    esQuery: 1,
};

module.exports = async (req, res) => {
    run(req);
    const iot = new Iot();

    let query = { id: req.params.id };
    if (!req.params.id && req.query.iot) {
        query = { title: req.query.iot };
    }
    query = webUtil.cleanObject(query);
    const limit = parseInt(req.query.limit || 10, 10);
    const skip = parseInt(req.query.offset || 0, 10);

    let apiContent;
    let total;
    const data = {};
    if (query.id) {
        apiContent = await iot.findOne(query, fields);
        data.iot = apiContent;
    } else {
        apiContent = await iot.find(query, fields, { limit, skip });
        data.iotlist = apiContent;
        total = await iot.count(query);
        data.total = total;
    }

    utilHtml.renderApi(req, res, 200, data);
};
