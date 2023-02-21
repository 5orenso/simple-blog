/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const uuidv4 = require('uuid/v4');
const { run, webUtil, utilHtml, localUtil } = require('../../middleware/init')({ __filename, __dirname });
const Article = require('../../../lib/class/article');

module.exports = async (req, res) => {
    run(req);

    const art = new Article();
    const artId = parseInt(req.params.id, 10);
    const query = { id: artId };

    let apiContent;
    if (query.id) {

        // We want to preserve the AI and file info resolved in the background:
        const currentArticle = await art.findOne(query, { id: 1, clicks: 1 });
        const updateArticle = {
            id: currentArticle.id,
        };
        if (!currentArticle.clicks) {
            updateArticle.clicks = 1;
        } else {
            updateArticle.clicks = { $inc: 1 };
        }
        apiContent = await art.save(updateArticle);
        return utilHtml.renderApi(req, res, 202, apiContent);
    }
    return utilHtml.renderApi(req, res, 404, {
        params: req.params,
        error: 'Article not found',
    });
};
