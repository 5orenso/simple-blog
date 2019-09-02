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
            const version = req.query.version ? parseInt(req.query.version, 10) : 0;
            const name = req.query.name;
            const packageName = req.query.package;
            const deepSleep = req.query.deepSleep ? parseInt(req.query.deepSleep, 10) : 0;
            const bme280 = req.query.bme280 ? parseInt(req.query.bme280, 10) : 0;
            const dallasTemp = req.query.dallasTemp ? parseInt(req.query.dallas, 10) : 0;
            const flame = req.query.flame ? parseInt(req.query.flame, 10) : 0;
            const light = req.query.light ? parseInt(req.query.light, 10) : 0;
            const gasMq2 = req.query.gasMq2 ? parseInt(req.query.mq2, 10) : 0;
            const gasMq3 = req.query.gasMq3 ? parseInt(req.query.mq3, 10) : 0;
            const motion = req.query.motion ? parseInt(req.query.motion, 10) : 0;
            const co2 = req.query.co2 ? parseInt(req.query.co2, 10) : 0;
            const dsm501a = req.query.dsm501a ? parseInt(req.query.dsm501a, 10) : 0;
            const publishInterval = req.query.publishInterval ? parseInt(req.query.publishInterval, 10) : 0;
            const sleepPeriode = req.query.sleepPeriode ? parseInt(req.query.sleepPeriode, 10) : 0;
            const wifiSsid = req.query.wifiSsid;
            const mqttServer = req.query.mqttServer;
            const mqttPort = req.query.mqttPort ? parseInt(req.query.mqttPort, 10) : 0;
            const mqttTopicOut = req.query.mqttTopicOut;
            const mqttTopicIn = req.query.mqttTopicIn;

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
