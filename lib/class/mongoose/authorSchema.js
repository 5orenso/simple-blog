'use strict';

const { asInteger, isInteger, isPositiveInteger } = require('../../utilities');
const mongoose = require('mongoose');
const sequenceSchema = require('./sequenceSchema');

const sequence = mongoose.model('sequence', sequenceSchema);
const collection = 'author';

const authorSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        // set: asInteger,
        // validate: isPositiveInteger,
    },
    name: {
        type: String,
        required: true,
    },
    firstname: String,
    lastname: String,
    email: String,
    image: String,
}, {
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate',
    },
    collection,
});

authorSchema.index({ id: 1, name: 1, email: 1 });

module.exports = authorSchema;
