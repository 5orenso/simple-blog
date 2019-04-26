'use strict';

const CollectionModel = require('./mongoose/CollectionModel');

const GEO_ADDRESS_FIELDS = [
    'information', 'parking', 'water', 'nature_reserve', 'library', 'bus_stop', 'restaurant', 'sports', 'attraction',
    'hospital', 'monument', 'picnic_site', 'retail', 'swimming_pool', 'townhall', 'pharmacy', 'sports_centre',
    'hamlet', 'path', 'hill', 'ferry_terminal', 'cafe', 'pedestrian',
    'address29', 'road', 'house_number', 'neighbourhood', 'suburb',
    'postcode', 'city_district', 'city', 'village', 'town',
    'county', 'state', 'country',
];

class Image extends CollectionModel {
    constructor(config) {
        super('image', config);
        this.searchFields = ['title', 'body', 'name', 'src', 'geo.display_name'];
        GEO_ADDRESS_FIELDS.map(f => this.searchFields.push(`geo.address.${f}`));

        this.searchFieldsNum = ['id'];
        this.searchFieldsArray = [
            ['predictions', 'className', { probability: { $gt: 0.2 } }],
            ['predictionsCocoSsd', 'class'],
        ];
        this.defaultSort = { ['exif.dateTimeOriginal']: -1 };
    }
}

module.exports = Image;
