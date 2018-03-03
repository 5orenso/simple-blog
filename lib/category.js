/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const appPath = `${__dirname}/../`;
const _ = require('underscore');

function Category(options) {
    this.opts = options || {};
    const logger = this.opts.logger;

    let currentAdapter = 'markdown';
    if (_.isObject(this.opts.config.adapter) && _.isString(this.opts.config.adapter.current)) {
        currentAdapter = this.opts.config.adapter.current;
    }
    // eslint-disable-next-line
    this.adapter = require(`${appPath}lib/adapter/${currentAdapter}`)({
        config: this.opts.config,
        logger,
    });
}

Category.prototype.list = function list(rootCategoryPath) {
    const adapter = this.adapter;
    return new Promise((resolve, reject) => {
        adapter.listCategories(rootCategoryPath)
            .then((catlist) => {
                resolve(catlist);
            })
            .catch((err) => {
                // eslint-disable-next-line
                reject({ error: err });
            });
    });
};

module.exports = Category;
