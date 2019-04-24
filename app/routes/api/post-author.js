/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const { routeName, routePath, run, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });
const Author = require('../../../lib/class/author');

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    const author = new Author();

    let apiContent;
    const data = webUtil.cleanObject(req.body, { nullIsUndefined: true });

    apiContent = await author.save(data);
    return utilHtml.renderApi(req, res, 201, apiContent);
};
