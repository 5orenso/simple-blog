'use strict';

const CollectionModel = require('./mongoose/CollectionModel');

class Article extends CollectionModel {
    constructor(config) {
        super('article', config);
        this.searchFields = ['title', 'teaser', 'ingress', 'body'];
    }
}

module.exports = Article;
