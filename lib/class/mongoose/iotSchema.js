'use strict';

const mongoose = require('mongoose');

const collection = 'iot';

const iotSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        // set: asInteger,
        // validate: isPositiveInteger,
    },
    title: {
        type: String,
        required: true,
    },
    alias: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    esQuery: {
        type: String,
        required: true,
    },
}, {
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate',
    },
    collection,
});

iotSchema.index({ id: 1, title: 1 });

module.exports = iotSchema;
