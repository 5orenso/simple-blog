'use strict';

const mongoose = require('mongoose');

const sequenceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    seq: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate',
    },
    collection: 'sequence',
});

sequenceSchema.index({ name: 1 });

module.exports = sequenceSchema;
