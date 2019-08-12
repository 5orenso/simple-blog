'use strict';

const mongoose = require('mongoose');

const collection = 'category';

const categorySchema = mongoose.Schema({
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
    url: {
        type: String,
        required: true,
    },
    type: Number,
    menu: Number,
    sort: Number,
    parent: Number,
    header: String,
    headerDetail: String,
    footer: String,
    footerDetail: String,
}, {
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate',
    },
    collection,
});

categorySchema.index({ id: 1, title: 1 });

module.exports = categorySchema;
