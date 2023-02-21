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

    const data = req.body.elements;

    // data [
    //     {
    //       startTime: 1676988075108,
    //       elementId: 423,
    //       user: null,
    //       intersectionRatio: 0.10436835891381346,
    //       isIntersecting: true,
    //       time: 40641.44,
    //       endTime: 1676988075748,
    //       duration: 640
    //     },

    const promises = [];
    for (let i = 0; i < data.length; i += 1) {
        const el = data[i];
        const id = parseInt(el.elementId, 10);
        const query = {
            id,
        };
        const updateArticle = {
            $addToSet: { views: el },
        };
        const options = {
            upsert: false,
        };
        promises.push(art.rawUpdate(query, updateArticle, options));
    }
    const results = await Promise.all(promises);
    return utilHtml.renderApi(req, res, 202, results);
};
