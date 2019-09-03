/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const { run, webUtil, utilHtml, tc } = require('../../middleware/init')({ __filename, __dirname });
const IotDevice = require('../../../lib/class/iotDevice');
const s3 = require('../../../lib/aws/s3');

module.exports = async (req, res) => {
    run(req);
    res.setHeader('Cache-Control', 'no-cache, no-store');

    const iotDevice = new IotDevice();
    let device;

    if (req.params.chipId) {
        const chipId = parseInt(req.params.chipId, 10);
        device = await iotDevice.findOne({ chipId });
        if (device.packageName && device.name && device.version) {
            const filename = `/esp8266/fota/${device.packageName}/firmware-${device.name}-${device.version}.bin`;
            const toFile = `/tmp/firmware-${device.name}-${device.version}.bin`;
            await s3.download('litt.no-esp8266-fota', filename, toFile);
            res.download(toFile);
            // return res.redirect(302, `/esp8266/fota/${device.packageName}/firmware-${device.name}-${device.version}.bin`);
        }
    }
    res.status(400).end();
};
