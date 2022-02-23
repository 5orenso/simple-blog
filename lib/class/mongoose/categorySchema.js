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
    titleEn: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    url2: String,
    image: String,
    type: Number,
    hideTitle: Boolean,
    limit: Number,
    menu: Number,
    skipDefaultArtLink: Number,
    hideOnFrontpage: Number,
    hideTranslateLinks: Number,
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
    hideCategoryTopArticle: Number,
    hideLanguage: Number,
    showBottomArticleList: Number,
    artlistSkipLinkTarget: Number,
    artlistCategory: Number,
    sort: Number,
    parent: Number,
    header: String,
    headerDetail: String,
    footer: String,
    footerDetail: String,
    dropdown: String,
    dropdownEn: String,
    colorMenu: String,
    menuCss: String,
    logoCss: String,
    artlistCss: String,

    artlistImageCss: String,

    artlistColClass: String,
    artlistRowClass: String,
    artlistContainerClass: String,
    artlistImageClass: String,
    artlistTitleClass: String,
    artlistTeaserClass: String,

    artlistImageSize: String,

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
    footerCol1: String,
    footerCol2: String,
    footerCol3: String,
    footerCol1En: String,
    footerCol2En: String,
    footerCol3En: String,
}, {
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate',
    },
    collection,
});

categorySchema.index({ id: 1, title: 1 });

module.exports = categorySchema;
