'use strict';

const CollectionModel = require('./mongoose/CollectionModel');

class Event extends CollectionModel {
    constructor(config) {
        super('event', config);
        this.searchFields = ['author', 'message'];
        this.searchFieldsNum = ['to', 'group', 'authorId'];
        this.defaultSort = { time: 1 };
    }

    commonFields = {
        id: 1,
        uuidv4: 1,
        offline: 1,
        time: 1,
        to: 1,
        group: 1,
        author: 1,
        authorId: 1,
        message: 1,
    };
}
module.exports = Event;
