/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const tc = require('fast-type-check');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const { routeName, routePath, run, webUtil, utilHtml, util } = require('../../middleware/init')({ __filename, __dirname });

const Article = require('../../../lib/class/article');
const Category = require('../../../lib/class/category');

module.exports = async (req, res) => {
    const { hrstart, runId } = run(req);

    const art = new Article();
    const artAds = new Article();
    const artAdsLower = new Article();
    const artBottom = new Article();

    const catMenu = new Category();
    const catAds = new Category();
    const catAdsLower = new Category();
    const cat = new Category();
    const catBottom = new Category();

    let category;

    let limit = parseInt(req.query.limit || 10, 10);
    const page = parseInt(req.query.page, 10) || 1;
    const skip = parseInt((page - 1) * limit || 0, 10);

    const query = { status: 2 };
    const queryList = { status: 2 };
    let queryAds = {};
    let queryAdsLower = {};

    const contentCatlist = await cat.find({ type: { $nin: [1, 2, 3, 4, 6, 7] } });
    queryList.categoryId = { $in: contentCatlist.map(c => c.id) };

    const catlist = await catMenu.find({ menu: 1 });

    limit = parseInt(limit, 10);
    let artlist = [];
    if (limit > 0) {
        artlist = await art.find(queryList, {}, { limit, skip });
    }

    if (tc.isArray(artlist)) {
        artlist.forEach((a) => {
            a.catRef = contentCatlist.find(c => c.id === a.categoryId);
        });
    }

    queryAds = { type: 2 };
    queryAdsLower = { type: 8 };

    const artlistTotal = await art.count(queryList);

    const adcats = await catAds.find(queryAds);
    const adlist = await artAds.find({ status: 2, categoryId: { $in: adcats.map(c => c.id) } });
    if (tc.isArray(adlist)) {
        adlist.forEach((a) => {
            a.catRef = adcats.find(c => c.id === a.categoryId);
        });
    }

    const adcatsLower = await catAdsLower.find(queryAdsLower);
    const adlistLower = await artAdsLower.find({ status: 2, categoryId: { $in: adcatsLower.map(c => c.id) }});
    if (tc.isArray(adlistLower)) {
        adlistLower.forEach((a) => {
            a.catRef = adcatsLower.find(c => c.id === a.categoryId);
        });
    }

    const artcatsBottom = await catBottom.find({ type: 7 });
    const artlistBottom = await artBottom.find({ status: 2, categoryId: { $in: artcatsBottom.map(c => c.id) }});
    if (tc.isArray(artlistBottom)) {
        artlistBottom.forEach((a) => {
            a.catRef = artcatsBottom.find(c => c.id === a.categoryId);
        });
    }

    const template = '/bootstrap4/plain.html';

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    const googleSheetId = '14ti3QovGH6pD1YNdFEFcp6NF66odFO7DlzcKmPtEI6g';
    const { google } = req.config;
    // console.log({ google, googleSheetId })

    // Initialize the sheet - doc ID is the long id in the sheets URL
    const doc = new GoogleSpreadsheet(googleSheetId);

    // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
    await doc.useServiceAccountAuth(google);

    await doc.loadInfo(); // loads document properties and worksheets
    // console.log(doc.title);

    const sheet100km = doc.sheetsByIndex[1]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    const sheet150km = doc.sheetsByIndex[2]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    const sheet300km = doc.sheetsByIndex[3]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    // console.log(sheet100km.title);

    const rows100km = await sheet100km.getRows();
    const rows150km = await sheet150km.getRows();
    const rows300km = await sheet300km.getRows();

    const bodyHtml = `
        <h5>${sheet100km.title}</h5>
        <table class='table table-striped table-sm'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Navn</th>
                    <th>Team</th>
                </tr>
            </thead>
            <tbody>
                ${rows100km.map((row, idx) => {
                    return `<tr>
                        <td>${idx + 1}</td>
                        <td>${row.Name}</td>
                        <td>${row['Team name']}</td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>

        <h5>${sheet150km.title}</h5>
        <table class='table table-striped table-sm'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Navn</th>
                    <th>Team</th>
                </tr>
            </thead>
            <tbody>
                ${rows150km.map((row, idx) => {
                    return `<tr>
                        <td>${idx + 1}</td>
                        <td>${row.Name}</td>
                        <td>${row['Team name']}</td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>

        <h5>${sheet300km.title}</h5>
        <table class='table table-striped table-sm'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Navn</th>
                    <th>Team</th>
                </tr>
            </thead>
            <tbody>
                ${rows300km.map((row, idx) => {
                    return `<tr>
                        <td>${idx + 1}</td>
                        <td>${row.Name}</td>
                        <td>${row['Team name']}</td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>
    `;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

    return webUtil.sendResultResponse(req, res, {
        article: {
            title: doc.title,
            body: bodyHtml,
        },
        artlist,
        artlistTotal,
        artlistBottom,
        category,
        catlist,
        adlist,
        adlistLower,
        limit,
        page,
        skip,
        isDetailView: true,
        isCategoryView: false,
        isFrontpage: false,
    }, {
        runId,
        routePath,
        routeName,
        hrstart,
        useTemplate: template,
        cacheTime: 60,
    });
};
