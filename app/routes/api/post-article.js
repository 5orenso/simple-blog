/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const { routeName, routePath, run, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });
const Article = require('../../../lib/class/article');

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    const art = new Article();

    let apiContent;
    const data = webUtil.cleanObject(req.body, { nullIsUndefined: true });
console.log('data', data);

    apiContent = await art.save(data);
    return utilHtml.renderApi(req, res, 201, apiContent);
};
