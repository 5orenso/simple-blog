'use strict';

const mongoose = require('mongoose');
const articleSchema = require('./articleSchema');
const categorySchema = require('./categorySchema');
const util = require('../../utilities');

module.exports = {
    init(config) {
        return mongoose.connect(config.mongo.url, { useNewUrlParser: true})
            .then((result) => {
                console.log(`Mongoose connected to MongoDB: ${config.mongo.url}`);
                return result;
            })
            .catch((err) => {
                console.error('Mongoose could not connect to MongoDB', err);
                return Promise.reject(err);
            });
    },
    close() {
        mongoose.connection.close();
    },

    // Models:
    article: mongoose.model('article', articleSchema),
    category: mongoose.model('category', categorySchema),

    // Mongoose it self
    mongoose,
};
