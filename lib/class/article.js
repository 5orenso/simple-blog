'use strict';

const CollectionModel = require('./mongoose/CollectionModel');

class Article extends CollectionModel {
    constructor(config) {
        super('article', config);
        this.searchFields = ['title', 'teaser', 'ingress', 'body', 'category', 'url'];
        this.searchFieldsNum = ['id'];
        this.defaultSort = { sort: -1, published: -1 };
    }
}

module.exports = Article;
