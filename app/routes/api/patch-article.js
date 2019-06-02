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

    let query = {
        id: req.params.id,
    };

    let apiContent;
    if (query.id) {
        const updateArticle = webUtil.cleanObject(req.body, { nullIsUndefined: true });

        // We want to preserve the AI and file info resolved in the background:
        const currentArticle = await art.findOne(query, { img: 1 });
        if (currentArticle.img && Array.isArray(currentArticle.img)) {
            for (let i = 0, l = currentArticle.img.length; i < l; i += 1) {
                const currentImg = currentArticle.img[i];
                updateArticle.img[i] = {
                    ...currentImg,
                    ...updateArticle.img[i],
                };
            }
        }

        apiContent = await art.save(updateArticle);
        return utilHtml.renderApi(req, res, 202, apiContent);
    }
    utilHtml.renderApi(req, res, 404, {
        params: req.params,
        error: 'Article not found',
    });
};
