'use strict';

const CollectionModel = require('./mongoose/CollectionModel');

class Iot extends CollectionModel {
    constructor(config) {
        super('iot', config);
        this.searchFields = ['title', 'alias', 'type', 'query'];
        this.searchFieldsNum = ['id'];
        this.defaultSort = { published: -1 };
    }
}

module.exports = Iot;
