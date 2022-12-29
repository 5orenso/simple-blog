'use strict';

const mongoose = require('mongoose');

const collection = 'event';

const eventSchema = mongoose.Schema({
    id: {
        api: true,
        type: Number,
        required: true,
        unique: true,
    },
    uuidv4: {
        api: true,
        apiDoc: 'Unique ID for sharing.',
        type: String,
    },
    offline: {
        type: Number,
        required: false,
        default: 0,
    },
    time: {
        api: true,
        type: Number,
        required: true,
    },
    count: {
        api: true,
        type: Number,
        required: true,
    },
    to: {
        api: true,
        type: Number,
        required: false,
    },
    group: {
        api: true,
        type: String,
        required: false,
    },
    type: {
        api: true,
        type: String,
        required: false,
    },
    from: {
        api: true,
        type: Number,
        required: false,
    },
    fromName: {
        api: true,
        type: String,
        required: false,
    },
    message: {
        api: true,
        type: mongoose.Mixed,
        required: true,
    },
}, {
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate',
    },
    collection,
});

eventSchema.index({
    uuidv4: 1,
}, {
    sparse: true,
    background: true,
});

eventSchema.index({
    time: 1,
}, {
    sparse: true,
    background: true,
});

eventSchema.index({
    id: 1,
    createdDate: 1,
    to: 1,
    group: 1,
}, {
    sparse: true,
    background: true,
});

module.exports = eventSchema;
