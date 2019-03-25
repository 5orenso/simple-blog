'use strict';

const CollectionModel = require('./mongoose/CollectionModel');

class Image extends CollectionModel {
    constructor(config) {
        super('image', config);
        this.searchFields = ['title', 'body', 'name'];
        this.searchFieldsNum = ['id'];
        this.searchFieldsArray = [
            ['predictions', 'className', { probability: { $gt: 0.2 } }],
            ['predictionsCocoSsd', 'class'],
        ];
        this.defaultSort = { ['exif.dateTimeOriginal']: -1 };
    }
}

module.exports = Image;
