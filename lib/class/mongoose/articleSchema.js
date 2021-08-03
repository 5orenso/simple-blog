'use strict';

const mongoose = require('mongoose');
const { asArray, asInteger, isPositiveInteger } = require('../../utilities');

const collection = 'article';

const articleSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        set: asInteger,
        validate: isPositiveInteger,
    },
    filename: String,
    author: String,
    published: {
        type: Date,
        default: Date.now,
        required: true,
    },
    status: {
        type: Number,
        default: 1,
    },
    sort: Number,
    category: String,
    categoryId: Number,
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
    teaser: String,
    youtube: String,
    vimeo: String,
    ingress: String,
    body: String,
    notes: String,
    url: String,

    widget: String,
    widgetList: String,

    background: String,
    forground: String,
    fontsizeH1: String,
    fontweightH1: String,
    fontsizeH3: String,
    fontweightH3: String,
    fontsizeH5: String,
    fontweightH5: String,

    img: [{
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
        title: String,
        url: String,
        text: String,
    }],
    youtubeVideos: [{
        title: String,
        text: String,
        url: String,
    }],
    links: [{
        title: String,
        text: String,
        url: String,
    }],
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

    'clock-class': String,
    'clock-style': String,
    'clock-countdownto': String,
    'clock-showDateOnly': String,
    'clock-showSeconds': String,
    'clock-showTimezone': String,
    'clock-showClockOnly': String,

    'booking-class': String,
    'booking-table-class': String,
    'booking-style': String,
    'booking-sheetId': String,

    'sheet-class': String,
    'sheet-table-class': String,
    'sheet-style': String,
    'sheet-sheetId': String,

    'poll-class': String,
    'poll-style': String,

    'gallery-class': String,
    'gallery-class-photo': String,
    'gallery-style': String,
    'gallery-start': Number,
    'gallery-end': Number,

    'weather-class': String,
    'weather-style': String,
    'weather-lat': String,
    'weather-lon': String,
    'weather-height': String,

    'rating-class': String,
    'rating-style': String,
    'rating-from': String,
    'rating-to': String,

    'related-class': String,
    'related-style': String,
    'related-tags': String,

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

module.exports = articleSchema;
