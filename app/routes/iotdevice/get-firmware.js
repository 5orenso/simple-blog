/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const { run, webUtil, utilHtml, tc } = require('../../middleware/init')({ __filename, __dirname });
const IotDevice = require('../../../lib/class/iotDevice');

module.exports = async (req, res) => {
    run(req);

    const iotDevice = new IotDevice();
    let device;

    if (req.params.chipId) {
        const chipId = parseInt(req.params.chipId, 10);
        device = await iotDevice.findOne({ chipId }, fields);
        if (device.packageName && device.name && device.version) {
            return res.redirect(302, `/esp8266/fota/${device.packageName}/firmware-${device.name}-${device.version}.bin`);
        }
    }
    res.status(400).end();
};
