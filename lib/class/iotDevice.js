'use strict';

const CollectionModel = require('./mongoose/CollectionModel');

class IotDevice extends CollectionModel {
    constructor(config) {
        super('iotDevice', config);
        this.searchFields = ['title', 'description'];
        this.searchFieldsNum = ['id', 'chipId', 'version'];
        this.defaultSort = { title: 1 };
    }
}

module.exports = IotDevice;
