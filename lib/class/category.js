'use strict';

const CollectionModel = require('./mongoose/CollectionModel');

class Category extends CollectionModel {
    constructor() {
        super('category');
        this.searchFields = ['title'];
    }
}

module.exports = Category;
