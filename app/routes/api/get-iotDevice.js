/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const { run, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });
const IotDevice = require('../../../lib/class/iotDevice');

const fields = {
    id: 1,
    createdDate: 1,
    updatedDate: 1,
    image: 1,
    title: 1,
    chipId: 1,
    version: 1,
    name: 1,
    packageName: 1,
    deepSleep: 1,
    sleepPeriode: 1,
    publishInterval: 1,
    location: 1,
    description: 1,
    sensors: 1,
    wifiSsid: 1,
    mqttServer: 1,
    mqttPort: 1,
    mqttTopicOut: 1,
    mqttTopicIn: 1,
    events: 1,
};

module.exports = async (req, res) => {
    run(req);

    const iotDevice = new IotDevice();

    let query = { id: req.params.id };
    if (!req.params.id && req.query.chipId) {
        query = { chipId: req.query.chipId };
    }
    query = webUtil.cleanObject(query);
    const limit = parseInt(req.query.limit || 10, 10);
    const skip = parseInt(req.query.offset || 0, 10);

    let apiContent;
    let total;
    const data = {};
    if (query.id) {
        apiContent = await iotDevice.findOne(query, fields);
        data.iotDevice = apiContent;
    } else {
        apiContent = await iotDevice.find(query, fields, { limit, skip });
        data.iotDeviceList = apiContent;
        total = await iotDevice.count(query);
        data.total = total;
    }

    utilHtml.renderApi(req, res, 200, data);
};
