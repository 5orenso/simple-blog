'use strict';

const mongoose = require('./index');
const util = require('../../utilities');

class CollectionModel {
    constructor(modelName) {
        this.modelName = modelName;
        this.Model = mongoose[modelName];

        if (!this.Model) {
            throw new Error(`Model ${this.modelName} not found`);
        }

        this.searchFields = ['id'];

        this.document = {};
        this.documentList = {};

        this.dataObject = {};
        this.dataObjectList = [];
    }

    get(key) {
        return this.dataObject[key];
    }

    set(key, value) {
        if (value) {
            this.dataObject[key] = value;
            this.document[key] = value;
            return true;
        }
        return false;
    }

    del(key) {
        delete this.dataObject[key];
        delete this.document[key];
    }

    getObject() {
        return this.dataObject;
    }

    getObjects() {
        return this.dataObjects;
    }

    find(query, fields, options = {}) {
        return this.Model.find(query, fields, options)
            .sort(options.sort || '-published')
            .limit(options.limit || 100)
            .then((documents) => {
                this.documentList = documents;
                for (let i = 0, l = documents.length; i < l; i += 1) {
                    const document = documents[i];
                    if (document !== null) {
                        const dataObject = document.toObject();
                        this.dataObjectList.push(dataObject);
                    }
                }
                return this.dataObjectList;
            })
            .catch((error) => {
                console.error(`${this.modelName}.find: ${JSON.stringify(query, null, 4)}: ${error}`);
            });
    }

    findOne(query, fields, options) {
        return this.Model.findOne(util.cleanObject(query), fields, options)
            .then((document) => {
                // console.log(`${this.modelName}.findOne(${JSON.stringify(query, null, 4)}).document: ${document}`);
                if (document === null) {
                    return false;
                }
                this.document = document;
                this.dataObject = document.toObject();
                return this.dataObject;
            })
            .catch((error) => {
                console.error(`${this.modelName}.findOne(${JSON.stringify(query, null, 4)}).error: ${error}`);
            });
    }

    search(searchTerm, fields, options) {
        return this.find(util.makeSearchObject(searchTerm, this.searchFields), fields, options);
    }

    save(dataObject) {
        // If no data input is given, assume we are going to save this.document
        if (typeof dataObject === 'undefined') {
            dataObject = this.document;
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
            .then((document) => {
                this.document = document;
                this.dataObject = document.toObject();
                return this.dataObject;
            });
    }

    delete(query) {
        return this.Model.deleteOne(query)
            .then((document) => {
                if (document.deletedCount === 1) {
                    return true;
                }
                return false;
            });
    }

}

module.exports = CollectionModel;
