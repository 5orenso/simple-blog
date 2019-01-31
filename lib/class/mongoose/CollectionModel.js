'use strict';

const mongoose = require('./index');
const util = require('../../utilities');

class CollectionModel {
    constructor(modelName) {
        this.modelName = modelName;
        this.Model = mongoose[modelName];
        this.searchFields = ['id', 'title'];

        if (!this.Model) {
            throw new Error(`Model ${this.modelName} not found`);
        }
    }

    find(query, fields, options = {}) {
        return this.Model.find(query, fields, options)
            .sort(options.sort || '-id')
            .limit(options.limit || 100);
    }

    findOne(query, fields, options) {
        // console.log(query);
        return this.Model.findOne(query, fields, options);
    }

    search(searchTerm, fields, options) {
        return this.find(util.makeSearchObject(searchTerm, this.searchFields), fields, options);
    }

    save(dataObject) {
        if (dataObject instanceof this.Model) {
            return dataObject.save();
        }

        const opts = {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        };
        return this.Model.findOneAndUpdate({ id: dataObject.id }, dataObject, opts);
    }

    delete(query) {
        return this.Model.deleteOne(query);
    }

}

module.exports = CollectionModel;
