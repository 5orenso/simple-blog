'use strict';

const CollectionModel = require('./mongoose/CollectionModel');

class Tag extends CollectionModel {
    constructor(config) {
        super('tag', config);
        this.searchFields = ['title'];
    }
}

module.exports = Tag;
