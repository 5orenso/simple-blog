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
    image: String,
    type: Number,
    hideTitle: Boolean,
    limit: Number,
    menu: Number,
    hideTopImage: Number,
    hidePrevNext: Number,
    hideArticleList: Number,
    hideMetaInfo: Number,
    hideMetaInfoDetail: Number,
    hideMetaInfoDetailAdvanced: Number,
    hideAuthorInfo: Number,
    hideFrontpageTitle: Number,
    hideFrontpageTeaser: Number,
    hideFrontpagePagination: Number,
    showBottomArticleList: Number,
    artlistCategory: Number,
    sort: Number,
    parent: Number,
    header: String,
    headerDetail: String,
    footer: String,
    footerDetail: String,
    dropdown: String,
    colorMenu: String,
    colorJumbotron: String,
    colorMain: String,
    colorBottom: String,
    bgColorMenu: String,
    bgColorJumbotron: String,
    bgColorMain: String,
    bgColorBottom: String,
    bgImageMain: String,
    bgImageMenu: String,
    bgImageBottom: String,
}, {
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate',
    },
    collection,
});

categorySchema.index({ id: 1, title: 1 });

module.exports = categorySchema;
