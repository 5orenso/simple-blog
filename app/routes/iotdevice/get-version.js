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
        device = await iotDevice.findOne({ chipId });
        if (!tc.isObject(device)) {
            const version = req.query.v ? parseInt(req.query.v, 10) : 0;
            const name = req.query.name;
            const packageName = req.query.package;
            const deepSleep = req.query.ds ? parseInt(req.query.ds, 10) : 0;
            const bme280 = req.query.bme280 ? parseInt(req.query.bme280, 10) : 0;
            const dallasTemp = req.query.dallas ? parseInt(req.query.dallas, 10) : 0;
            const flame = req.query.flame ? parseInt(req.query.flame, 10) : 0;
            const light = req.query.light ? parseInt(req.query.light, 10) : 0;
            const gasMq2 = req.query.mq2 ? parseInt(req.query.mq2, 10) : 0;
            const gasMq3 = req.query.mq3 ? parseInt(req.query.mq3, 10) : 0;
            const moisture = req.query.moisture ? parseInt(req.query.moisture, 10) : 0;
            const motion = req.query.motion ? parseInt(req.query.motion, 10) : 0;
            const co2 = req.query.co2 ? parseInt(req.query.co2, 10) : 0;
            const dsm501a = req.query.dsm501a ? parseInt(req.query.dsm501a, 10) : 0;
            const publishInterval = req.query.pi ? parseInt(req.query.pi, 10) : 0;
            const sleepPeriode = req.query.sp ? parseInt(req.query.sp, 10) : 0;
            const wifiSsid = req.query.wifi;
            const mqttServer = req.query.mqs;
            const mqttPort = req.query.mqp ? parseInt(req.query.mqp, 10) : 0;
            const mqttTopicOut = req.query.mqout;
            const mqttTopicIn = req.query.mqin;

            device = await iotDevice.save({
                chipId,
                version,
                name,
                packageName,
                deepSleep,
                sensors: {
                    bme280,
                    dallasTemp,
                    flame,
                    light,
                    gasMq2,
                    gasMq3,
                    moisture,
                    motion,
                    co2,
                    dsm501a,
                },
                publishInterval,
                sleepPeriode,
                wifiSsid,
                mqttServer,
                mqttPort,
                mqttTopicOut,
                mqttTopicIn,
            });
        }
        res.set('Content-Type', 'text/plain');
        res.send(`${device.version}`);
    } else {
        res.sendStatus(400).end();
    }
};
