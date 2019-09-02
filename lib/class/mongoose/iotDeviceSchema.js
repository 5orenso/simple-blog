'use strict';

const mongoose = require('mongoose');

const collection = 'iotDevice';

const iotDeviceSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    chipId: {
        type: Number,
        required: true,
    },
    version: Number,
    name: String,
    packageName: String,
    deepSleep: Number,
    sleepPeriode: Number,
    publishInterval: Number,

    wifiSsid: String,
    mqttServer: String,
    mqttPort: Number,
    mqttTopicOut: String,
    mqttTopicIn: String,

    location: Object,
    description: Object,

    sensors: {
        bme280: Boolean,
        dallasTemp: Boolean,
        flame: Boolean,
        light: Boolean,
        gasMq2: Boolean,
        gasMq3: Boolean,
        motion: Boolean,
        co2: Boolean,
        dsm501a: Boolean,
    },
}, {
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate',
    },
    collection,
});

iotDeviceSchema.index({ id: 1, chipId: 1, title: 1 });

module.exports = iotDeviceSchema;
