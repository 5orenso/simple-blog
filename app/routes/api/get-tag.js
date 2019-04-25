/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const { routeName, routePath, run, webUtil, utilHtml, util } = require('../../middleware/init')({ __filename, __dirname });
const Tag = require('../../../lib/class/tag');
const Article = require('../../../lib/class/article');

const fields = {
    id: 1,
    createdDate: 1,
    title: 1,
    count: 1,
};

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    const tag = new Tag();
    const art = new Article();

    let query = {
        id: req.params.id,
    };
    if (!req.params.id && req.query.title) {
        query = {
            title: req.query.title,
        };
    }
    if (req.query.titleNin) {
        query = {
            title: { $nin: req.query.titleNin.split(',') },
        };
    }
    query = webUtil.cleanObject(query);
    const limit = parseInt(req.query.limit || 10, 10);
    const skip = parseInt(req.query.offset || 0, 10);

    let apiContent;
    let total;
    let data = {};
    if (req.query.query) {
        const { list, total } = await tag.search(req.query.query, {}, { limit, skip, query });
        data.taglist = list;
        data.total = total;
    } else if (query.id) {
        data.tag = await tag.findOne(query, fields);
        data.tag.count = await art.count({ tags: data.tag.title });
    } else {
        data.taglist = await tag.find(query, fields, { limit, skip });
        total = await tag.count(query);
        data.total = total;
    }

    if (data.taglist) {
        const tagCounts = await art.aggregate([
            {
                $unwind: "$tags"
            },
            {
                $group: {
                    _id: "$tags",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    tag: "$_id",
                    count: "$count"
                }
            }
        ]);
        const tagRef = util.toRef(tagCounts, 'tag');

        for (let i = 0, l = data.taglist.length; i < l; i += 1) {
            const t = data.taglist[i];
            t.count = tagRef[t.title].count;
            console.log(t);
        }
    }

    utilHtml.renderApi(req, res, 200, data);
};
