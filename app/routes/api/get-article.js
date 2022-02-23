/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const { run, webUtil, utilHtml, util } = require('../../middleware/init')({ __filename, __dirname });
const Article = require('../../../lib/class/article');

const fields = {
    id: 1,
    status: 1,
    published: 1,
    updatedDate: 1,
    author: 1,
    sort: 1,
    category: 1,
    categoryId: 1,

    title: 1,
    teaser: 1,
    ingress: 1,
    body: 1,

    titleEn: 1,
    teaserEn: 1,
    ingressEn: 1,
    bodyEn: 1,

    notes: 1,
    url: 1,
    img: 1,
    youtubeVideos: 1,
    links: 1,
    tags: 1,
    youtube: 1,
    imageObject: 1,
    video: 1,
    aggregateRating: 1,
    nutrition: 1,
    relevantWords: 1,
    classifiedWords: 1,
    widget: 1,
    widgetList: 1,

    background: 1,
    forground: 1,
    fontsizeH1: 1,
    fontweightH1: 1,
    fontsizeH3: 1,
    fontweightH3: 1,
    fontsizeH5: 1,
    fontweightH5: 1,

    classNames: 1,
    cssStyles: 1,

    'clock-class': 1,
    'clock-style': 1,
    'clock-countdownto': 1,
    'clock-showDateOnly': 1,
    'clock-showSeconds': 1,
    'clock-showTimezone': 1,
    'clock-showClockOnly': 1,

    'booking-class': 1,
    'booking-table-class': 1,
    'booking-style': 1,
    'booking-sheetId': 1,

    'form-class': 1,
    'form-table-class': 1,
    'form-style': 1,
    'form-sheetId': 1,

    'sheet-class': 1,
    'sheet-table-class': 1,
    'sheet-style': 1,
    'sheet-sheetId': 1,
    'sheet-showDocTitle': 1,
    'sheet-limit': 1,
    'sheet-showSearch': 1,

    'poll-class': 1,
    'poll-style': 1,

    'gallery-nav-class': 1,
    'gallery-nav-back': 1,
    'gallery-nav-forward': 1,
    'gallery-class': 1,
    'gallery-wrapper-class': 1,
    'gallery-wrapper-inner-class': 1,
    'gallery-class-photo': 1,
    'gallery-class-photo-img': 1,
    'gallery-skip-background-images': 1,
    'gallery-img-wrapper-class': 1,
    'gallery-style': 1,
    'gallery-start': 1,
    'gallery-end': 1,

    'weather-class': 1,
    'weather-style': 1,
    'weather-name': 1,
    'weather-altitude': 1,
    'weather-lat': 1,
    'weather-lon': 1,
    'weather-date': 1,

    'rating-class': 1,
    'rating-style': 1,
    'rating-from': 1,
    'rating-to': 1,

    'related-class': 1,
    'related-style': 1,
    'related-tags': 1,

    'cookies-class': 1,
    'cookies-style': 1,
};

module.exports = async (req, res) => {
    run(req);

    const art = new Article();

    let query = {};
    if (req.params.id) {
        query.id = parseInt(req.params.id, 10);
    } else if (req.params.category) {
        query.category = req.params.category;
    }

    query = webUtil.cleanObject(query);
    const limit = parseInt(req.query.limit || 10, 10);
    const skip = parseInt(req.query.offset || 0, 10);

    if (req.query.category) {
        query.category = req.query.category;
    }
    if (req.query.status) {
        query.status = req.query.status;
    }

    let apiContent;
    const data = {};
    if (req.query.query) {
        const { list, total } = await art.search(req.query.query, {}, { limit, skip, query });
        data.artlist = list;
        data.total = total;
    } else if (query.id) {
        apiContent = await art.findOne(query, fields);
        data.article = apiContent;
    } else {
        apiContent = await art.find(query, fields, { limit, skip });
        data.artlist = apiContent;
        const total = await art.count(query);
        data.total = total;
    }

    // Find relevant words.
    if (data.article) {
        data.article.relevantWords = [];
        const tokens = util.tokenizeAndStem(data.article.body);
        // console.log('---> tokens', tokens);
        const wordCount = util.termsCount(tokens, data.article.body);
        const words = Object.keys(wordCount);
        for (let i = 0, l = words.length; i < l; i += 1) {
            const word = words[i];
            // console.log('===> ', word, wordCount[word]);
            if (wordCount[word] >= 3 && word.length > 3) {
                data.article.relevantWords.push(word);
            }
        }
        // BayesClassifier:
        // if (data.article.body) {
        //     const artlistClassify = await art.find({}, { id: 1, title: 1, tags: 1, body: 1 }, { limit: 500 });
        //     data.article.classifiedWords = util.classifyArticle(artlistClassify, data.article);
        // }
    }

    data.jwtToken = util.makeJwtToken({ readAccess: 1 }, req.config);
    data.imageServer = req.config.blog.imageServer;
    data.imagePath = req.config.blog.imagePath;
    utilHtml.renderApi(req, res, 200, data);
};
