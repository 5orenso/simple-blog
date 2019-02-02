'use strict';

const mongoose = require('mongoose');
const articleSchema = require('./articleSchema');
const categorySchema = require('./categorySchema');
const sequenceSchema = require('./sequenceSchema');
const util = require('../../utilities');

const SCHEMAS = {
    article: articleSchema,
    category: categorySchema,
    sequence: sequenceSchema,
};
const GLOBAL_MODELS = {};

class MongooseHelper {
    constructor(config) {
        this.config = config;
        this.connections = {};
    }

    static async connectGlobal(config) {
        GLOBAL_MODELS['article'] = mongoose.model('article', SCHEMAS.article);
        GLOBAL_MODELS['category'] = mongoose.model('category', SCHEMAS.category);
        GLOBAL_MODELS['sequence'] = mongoose.model('sequence', SCHEMAS.sequence);
        try {
            const result = await mongoose.connect(config.mongo.url, { useNewUrlParser: true});
            console.log(`Global Mongoose connected to MongoDB: ${config.mongo.url}`);
            return result;
        } catch(err) {
            console.error('Global Mongoose could not connect to MongoDB', err);
            return Promise.reject(err);
        }
    }

    static getGlobalModel(modelName) {
        return GLOBAL_MODELS[modelName];
    }

    async closeAll() {
        await mongoose.connection.close();
    }

    async connectModel(modelName) {
        try {
            const connection = await mongoose.createConnection(this.config.mongo.url, { useNewUrlParser: true});
            this.connections[modelName] = connection;
            this[modelName] = connection.model(modelName, SCHEMAS[modelName]);
            // console.log(`\tC. modelName, this[modelName]: ${modelName}, ${this[modelName]}`);
            // console.log(mongoose.model(modelName, SCHEMAS[modelName]));
            return this[modelName];
        } catch(err) {
            console.error('\tMongoose could not connect to MongoDB', err);
            return Promise.reject(err);
        }
    }

    close(modelName) {
        this.connections[modelName].close();
    }
}
module.exports = MongooseHelper;
