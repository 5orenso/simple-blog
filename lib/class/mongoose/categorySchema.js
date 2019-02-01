'use strict';

const { asInteger, isInteger, isPositiveInteger } = require('../../utilities');
const mongoose = require('mongoose');
const sequenceSchema = require('./sequenceSchema');

const sequence = mongoose.model('sequence', sequenceSchema);
const collection = 'category';

const categorySchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        // set: asInteger,
        // validate: isPositiveInteger,
    },
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    parent: Number,
}, {
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate',
    },
    collection,
});

categorySchema.index({ id: 1, title: 1 });

categorySchema.pre('findOneAndUpdate', function(next) {
    sequence.findOneAndUpdate({ name: collection }, { $inc: { seq: 1 } }, { new: true, upsert: true })
        .then((seq) => {
            this._update.id = seq.seq;
            next();
        })
        .catch((error) => {
            if (error) {
                return next(error);
            }
        })
});

module.exports = categorySchema;
