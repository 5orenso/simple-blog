/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const appPath = `${__dirname}/../`;
const _ = require('underscore');

function Search(options) {
    this.opts = options || {};
    this.logger = this.opts.logger;
    this.currentAdapter = 'elasticsearch';
    if (_.isObject(this.opts.config.searchAdapter) && _.isString(this.opts.config.searchAdapter.current)) {
        this.currentAdapter = this.opts.config.adapter.current;
    }
    // eslint-disable-next-line
    this.adapter = require(`${appPath}lib/adapter/${this.currentAdapter}`)({
        config: this.opts.config,
        logger: this.logger,
    });
}

Search.prototype.query = function query(inputQuery, filter) {
    const adapter = this.adapter;
    return new Promise((resolve, reject) => {
        adapter.query(inputQuery, filter)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                // eslint-disable-next-line
                reject({ error: err });
            });
    });
};

Search.prototype.index = function index(obj, closeConnection) {
    const adapter = this.adapter;
    return new Promise((resolve, reject) => {
        adapter.index(obj)
            .then((result) => {
                const myCloseConnection = closeConnection;
                if (myCloseConnection) {
                    adapter.close();
                }
                resolve(result);
            })
            .catch((err) => {
                // eslint-disable-next-line
                reject({ error: err });
            });
    });
};

Search.prototype.indexArtlist = function indexArtlist(artlist, closeConnection) {
    const adapter = this.adapter;
    return new Promise((resolve, reject) => {
        Promise.all(artlist.map(art => adapter.index(art)))
            .then((results) => {
                const myCloseConnection = closeConnection;
                if (myCloseConnection) {
                    adapter.close();
                }
                resolve(results);
            })
            .catch(err => reject(err));
    });
};

module.exports = Search;
