'use strict';

const CollectionModel = require('./mongoose/CollectionModel');

class Article extends CollectionModel {
    constructor() {
        super('article');
        this.searchFields = ['title', 'teaser', 'ingress', 'body'];
    }
}

module.exports = Article;
