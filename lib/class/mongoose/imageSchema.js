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
    createdDate: Date,
    body: String,
    src: String,
    encoding: String,
    ext: String,
    mimetype: String,
    name: String,
    newFilename: String,
    s3Link: String,
    s3ThumbLink: String,
    s3XSmallLink: String,
    s3SmallLink: String,
    s3MediumLink: String,
    s3LargeLink: String,
    s3XLargeLink: String,
    s3XXLargeLink: String,
    s33XLargeLink: String,
    s34XLargeLink: String,
    bytes: Number,
    dimensions: Object,
    stats: Object,
    color: Object,
    palette: Object,
    hsv: Object,
    hsvPalette: Object,
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
