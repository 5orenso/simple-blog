'use strict';

const { asInteger, isInteger, isPositiveInteger } = require('../../utilities');
const mongoose = require('mongoose');
const sequenceSchema = require('./sequenceSchema');

const sequence = mongoose.model('sequence', sequenceSchema);
const collection = 'article';

const articleSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        // set: asInteger,
        // validate: isPositiveInteger,
    },
    filename: String,
    author: String,
    published: {
        type: Date,
        default: Date.now,
        required: true,
    },
    category: String,
    tags: [String],
    title: {
        type: String,
        required: true,
    },
    teaser: String,
    youtube: String,
    vimeo: String,
    ingress: String,
    body: String,

    img: [String],
    imgText: [String],
    imageObject: {
        author: String,
        name: String,
        description: String,
        keywords: [String],
        contentUrl: String,
        published: Date,
        loc: {
            type: { type: String },
            coordinates: [Number],
        },
        camera: String,
        lens: String,
        shutter: String,
        focal: String,
        aperture: String,
        iso: String,
    },

    titleParts: [String],
    teaserParts: [String],
    imgParts: [String],
    imgTextParts: [String],
    bodyParts: [String],
    colParts: [String],

    // images: [mongoose.Mixed],

    loc: {
        type: String,
        coordinates: [Number],
    },
    likes: [{
        body: String,
        date: Date,
    }],
    comments: [{
        body: String,
        date: Date,
    }],
}, {
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate',
    },
    collection,
});

articleSchema.index({ id: 1, publishDate: 1 });

// articleSchema.pre('findOneAndUpdate', function(next) {
//     sequence.findOneAndUpdate({ name: collection }, { $inc: { seq: 1 } }, { new: true, upsert: true })
//         .then((seq) => {
//             this._update.id = seq.seq;
//             next();
//         })
//         .catch((error) => {
//             if (error) {
//                 return next(error);
//             }
//         })
// });

module.exports = articleSchema;
