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

function bySortOrder(a, b) {
    if ((a.sort && !b.sort) || a.sort > b.sort) {
        return -1;
    } else if ((!a.sort && b.sort) || a.sort < b.sort) {
        return 1;
    }
    return 0;
}

module.exports = async (req, res) => {
    run(req);

    const art = new Article();
    const query = { id: req.params.id };

    let apiContent;
    if (query.id) {
        const updateArticle = webUtil.cleanObject(req.body, { nullIsUndefined: true });

        // We want to preserve the AI and file info resolved in the background:
        const currentArticle = await art.findOne(query, { id: 1, img: 1 });

        if (updateArticle.img) {
            if (currentArticle.img && Array.isArray(currentArticle.img)) {
                for (let i = 0, l = currentArticle.img.length; i < l; i += 1) {
                    const currentImg = currentArticle.img[i];
                    updateArticle.img[i] = {
                        ...currentImg,
                        ...updateArticle.img[i],
                    };
                    if (!updateArticle.img[i].uuidv4) {
                        updateArticle.img[i].uuidv4 = uuidv4();
                    }
                }

                updateArticle.img = updateArticle.img.sort(bySortOrder);
            }
        }
        updateArticle.id = parseInt(currentArticle.id, 10);

        apiContent = await art.save(updateArticle);
        return utilHtml.renderApi(req, res, 202, apiContent);
    }
    return utilHtml.renderApi(req, res, 404, {
        params: req.params,
        error: 'Article not found',
    });
};
