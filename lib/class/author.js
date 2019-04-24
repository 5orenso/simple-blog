'use strict';

const CollectionModel = require('./mongoose/CollectionModel');

class Author extends CollectionModel {
    constructor(config) {
        super('author', config);
        this.searchFields = ['name', 'email'];
    }
}

module.exports = Author;
