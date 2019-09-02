/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const { routeName, routePath, run, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });
const IotDevice = require('../../../lib/class/iotDevice');

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    const iotDevice = new IotDevice();

    let apiContent;
    const data = webUtil.cleanObject(req.body, { nullIsUndefined: true });

    apiContent = await iotDevice.save(data);
    return utilHtml.renderApi(req, res, 202, apiContent);
};
