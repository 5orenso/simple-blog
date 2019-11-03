'use strict';

const { asArray, asInteger, isArray, isInteger, isPositiveInteger } = require('../../utilities');
const mongoose = require('mongoose');
const sequenceSchema = require('./sequenceSchema');

const sequence = mongoose.model('sequence', sequenceSchema);
const collection = 'image';

const imageSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        set: asInteger,
        validate: isPositiveInteger,
    },
    tags: {
        type: [String],
        set: asArray,
        // validate: isArray,
        default: [],
    },
    title: {
        type: String,
        required: true,
    },
    body: String,
    src: String,
    encoding: String,
    ext: String,
    mimetype: String,
    name: String,
    newFilename: String,
    stats: Object,
    exif: Object,
    geo: Object,
    features: Object,
    predictions: Object,
    predictionsCocoSsd: Object,
    faceDetections: Object,
}, {
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate',
    },
    collection,
});

imageSchema.index({ id: 1, createdAt: 1 });

module.exports = imageSchema;
