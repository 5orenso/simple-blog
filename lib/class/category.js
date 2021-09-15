'use strict';

const CollectionModel = require('./mongoose/CollectionModel');

class Category extends CollectionModel {
    constructor(config) {
        super('category', config);
        this.searchFields = ['title', 'titleEn'];
        this.defaultSort = { sort: -1, title: 1 };
    }
}

module.exports = Category;
