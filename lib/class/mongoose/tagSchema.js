'use strict';

const { asInteger, isInteger, isPositiveInteger } = require('../../utilities');
const mongoose = require('mongoose');
const sequenceSchema = require('./sequenceSchema');

const sequence = mongoose.model('sequence', sequenceSchema);
const collection = 'tag';

const tagSchema = mongoose.Schema({
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
}, {
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate',
    },
    collection,
});

tagSchema.index({ id: 1, title: 1 });

module.exports = tagSchema;
