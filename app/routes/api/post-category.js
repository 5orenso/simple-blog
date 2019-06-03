/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const { routeName, routePath, run, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });
const Category = require('../../../lib/class/category');

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    const cat = new Category();

    let apiContent;
    const data = webUtil.cleanObject(req.body, { nullIsUndefined: true });

    apiContent = await cat.save(data);
    return utilHtml.renderApi(req, res, 202, apiContent);
};
