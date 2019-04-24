/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const { routeName, routePath, run, webUtil, utilHtml, util } = require('../../middleware/init')({ __filename, __dirname });
const Tag = require('../../../lib/class/tag');

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    const tag = new Tag();

    let apiContent;
    const data = webUtil.cleanObject(req.body, { nullIsUndefined: true });

    if (typeof req.body.tags === 'object' && Array.isArray(req.body.tags)) {
        apiContent = [];
        const tags = req.body.tags;
        const tagList = await tag.find({
            title: { $in : tags },
        });
        const tagRef = util.toRef(tagList, 'title');
        for (let i = 0, l = tags.length; i < l; i += 1) {
            const t = tags[i];
            if (!tagRef[t]) {
                apiContent.push(await tag.save({ title: t }));
            }
        }
    } else {
        const tagObj = await tag.findOne({
            title: req.body.title,
        });
        if (tagObj.id) {
            data.id = tagObj.id;
        }
        apiContent = await tag.save(data);
    }

    return utilHtml.renderApi(req, res, 201, apiContent);
};
