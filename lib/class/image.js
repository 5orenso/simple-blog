'use strict';

const CollectionModel = require('./mongoose/CollectionModel');

class Image extends CollectionModel {
    constructor(config) {
        super('image', config);
        this.searchFields = ['title', 'body', 'name', 'src',
            'geo.display_name',
            'geo.address.house_number', 'geo.address.neighbourhood',
            'geo.address.ferry_terminal', 'geo.address.city_district', 'geo.address.city',
            'geo.address.cafe', 'geo.address.pedestrian', 'geo.address.suburb', 'geo.address.address29',
            'geo.address.road', 'geo.address.suburb', 'geo.address.village', 'geo.address.town',
            'geo.address.county', 'geo.address.postcode', 'geo.address.country'];
        this.searchFieldsNum = ['id'];
        this.searchFieldsArray = [
            ['predictions', 'className', { probability: { $gt: 0.2 } }],
            ['predictionsCocoSsd', 'class'],
        ];
        this.defaultSort = { ['exif.dateTimeOriginal']: -1 };
    }
}

module.exports = Image;
