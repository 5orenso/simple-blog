'use strict';

const mongoose = require('./index');
const util = require('../../utilities');

class CollectionModel {
    constructor(modelName) {
        this.modelName = modelName;
        this.Model = mongoose[modelName];
        this.searchFields = ['id', 'title'];

        this.doc = {};
        this.docList = {};

        this.data = {};
        this.dataList = [];

        if (!this.Model) {
            throw new Error(`Model ${this.modelName} not found`);
        }
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        if (value) {
            this.data[key] = value;
            this.doc[key] = value;
            return true;
        }
        return false;
    }

    del(key) {
        delete this.data[key];
        delete this.doc[key];
    }

    find(query, fields, options = {}) {
        return this.Model.find(query, fields, options)
            .sort(options.sort || '-published')
            .limit(options.limit || 100)
            .then((docs) => {
                this.docList = docs;
                for (let i = 0, l = docs.length; i < l; i += 1) {
                    const data = docs[i].toObject();
                    this.dataList.push(data);
                }
                return this.dataList;
            })
            .catch((error) => {
                console.error(`${this.modelName}.find: ${JSON.stringify(query, null, 4)}: ${error}`);
            });
    }

    findOne(query, fields, options) {
        return this.Model.findOne(util.cleanObject(query), fields, options)
            .then((doc) => {
                // console.log(`${this.modelName}.findOne(${JSON.stringify(query, null, 4)}).doc: ${doc}`);
                this.doc = doc;
                this.data = doc.toObject();
                return this.data;
            })
            .catch((error) => {
                console.error(`${this.modelName}.findOne(${JSON.stringify(query, null, 4)}).error: ${error}`);
            });
    }

    search(searchTerm, fields, options) {
        return this.find(util.makeSearchObject(searchTerm, this.searchFields), fields, options);
    }

    save(dataObject) {
        // If no data input is given, assume we are going to save this.doc
        if (typeof dataObject === 'undefined') {
            dataObject = this.doc;
        }
        // If we are saving the native mongoose object we can just call save()
        if (dataObject instanceof this.Model) {
            return dataObject.save();
        }
        // If dataObject is still empty, bail out
        if (typeof dataObject === 'undefined') {
            return Promise.reject('No data to save!');
        }

        const opts = {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        };
        return this.Model.findOneAndUpdate({ id: dataObject.id }, dataObject, opts)
            .then((doc) => {
                this.doc = doc;
                this.data = doc.toObject();
                return this.data;
            });
    }

    delete(query) {
        return this.Model.deleteOne(query)
            .then((doc) => {
                if (doc.deletedCount === 1) {
                    return true;
                }
                return false;
            });
    }

}

module.exports = CollectionModel;
