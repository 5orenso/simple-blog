'use strict';

const CollectionModel = require('./mongoose/CollectionModel');

class Category extends CollectionModel {
    constructor(config) {
        super('category', config);
        this.searchFields = ['title'];
    }
}

module.exports = Category;
