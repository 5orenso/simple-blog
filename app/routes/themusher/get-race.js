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
    const artLower = new Article();
    const artAds = new Article();
    const artAdsLower = new Article();
    const artBottom = new Article();

    const catMenu = new Category();
    const catAds = new Category();
    const catAdsLower = new Category();
    const cat = new Category();
    const catLower = new Category();
    const catBottom = new Category();

    let category;

    let limit = parseInt(req.query.limit || 10, 10);
    const page = parseInt(req.query.page, 10) || 1;
    const skip = parseInt((page - 1) * limit || 0, 10);

    const query = { status: 2 };
    const queryList = { status: 2 };
    const queryListLower = { status: 2 };
    let queryAds = {};
    let queryAdsLower = {};

    const contentCatlist = await cat.find({ type: 19 });
    queryList.categoryId = { $in: contentCatlist.map(c => c.id) };
    const contentCatlistLower = await catLower.find({ type: 18 });
    queryListLower.categoryId = { $in: contentCatlistLower.map(c => c.id) };

    const catlist = await catMenu.find({ menu: 1 });

    limit = parseInt(limit, 10);
    let artlist = [];
    let artlistLower = [];
    if (limit > 0) {
        artlist = await art.find(queryList, {}, { limit, skip });
        artlistLower = await artLower.find(queryListLower, {}, { limit, skip });
    }

    if (tc.isArray(artlist)) {
        artlist.forEach((a) => {
            a.catRef = contentCatlist.find(c => c.id === a.categoryId);
        });
    }
    if (tc.isArray(artlistLower)) {
        artlistLower.forEach((a) => {
            a.catRef = contentCatlistLower.find(c => c.id === a.categoryId);
        });
    }

    queryAds = { type: 20 };
    queryAdsLower = { type: 21 };

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
                    <th>Klubb</th>
                    <th>Starttid</th>
                    <th class='w-25'>Resultat</th>
                </tr>
            </thead>
            <tbody>
                ${rows100km.map((row, idx) => {
                    return `<tr>
                        <td>${idx + 1}</td>
                        <td>
                            ${row.Name}<br />
                            <small class='text-muted'>
                                ${row['Team name']}
                                (${row['Number of dogs in this race'] || 'n/a'} <i class="fas fa-dog"></i>)
                            </small>
                        </td>
                        <td>${row['Sports club']}</td>
                        <td>${row.Starttime || 'n/a'}</td>
                        <td style='line-height: 0.8em;'>
                            <small>
                                <span class='text-muted font-weight-lighter'><i class="fas fa-road"></i> Distanse:</span> ${row.Distance || 'n/a'}<br />
                                <span class='text-muted font-weight-lighter'><i class="fas fa-mountain"></i> Høydemeter:</span> ${row.Ascend || 'n/a'}<br />
                                <span class='text-muted font-weight-lighter'><i class="fas fa-tachometer-alt"></i> Snittfart:</span> ${row.AvgSpeed || 'n/a'}<br />
                                <span class='text-muted font-weight-lighter'><i class="fas fa-running"></i> Load index:</span> ${row.LoadIndex || 'n/a'}<br />
                            </small>
                        </td>
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
                    <th>Klubb</th>
                    <th>Starttid</th>
                    <th class='w-25'>Resultat</th>
                </tr>
            </thead>
            <tbody>
                ${rows150km.map((row, idx) => {
                    return `<tr>
                        <td>${idx + 1}</td>
                        <td>
                            ${row.Name}<br />
                            <small class='text-muted'>
                                ${row['Team name']}
                                (${row['Number of dogs in this race'] || 'n/a'} <i class="fas fa-dog"></i>)
                            </small>
                        </td>
                        <td>${row['Sports club']}</td>
                        <td>${row.Starttime || 'n/a'}</td>
                        <td style='line-height: 0.8em;'>
                            <small>
                                <span class='text-muted font-weight-lighter'><i class="fas fa-road"></i> Distanse:</span> ${row.Distance || 'n/a'}<br />
                                <span class='text-muted font-weight-lighter'><i class="fas fa-mountain"></i> Høydemeter:</span> ${row.Ascend || 'n/a'}<br />
                                <span class='text-muted font-weight-lighter'><i class="fas fa-tachometer-alt"></i> Snittfart:</span> ${row.AvgSpeed || 'n/a'}<br />
                                <span class='text-muted font-weight-lighter'><i class="fas fa-running"></i> Load index:</span> ${row.LoadIndex || 'n/a'}<br />
                            </small>
                        </td>
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
                    <th>Klubb</th>
                    <th>Starttid</th>
                    <th class='w-25'>Resultat</th>
                </tr>
            </thead>
            <tbody>
                ${rows300km.map((row, idx) => {
                    return `<tr>
                        <td>${idx + 1}</td>
                        <td>
                            ${row.Name}<br />
                            <small class='text-muted'>
                                ${row['Team name']}
                                (${row['Number of dogs in this race'] || 'n/a'} <i class="fas fa-dog"></i>)
                            </small>
                        </td>
                        <td>${row['Sports club']}</td>
                        <td>${row.Starttime || 'n/a'}</td>
                        <td style='line-height: 0.8em;'>
                            <small>
                                <span class='text-muted font-weight-lighter'><i class="fas fa-road"></i> Distanse:</span> ${row.Distance || 'n/a'}<br />
                                <span class='text-muted font-weight-lighter'><i class="fas fa-mountain"></i> Høydemeter:</span> ${row.Ascend || 'n/a'}<br />
                                <span class='text-muted font-weight-lighter'><i class="fas fa-tachometer-alt"></i> Snittfart:</span> ${row.AvgSpeed || 'n/a'}<br />
                                <span class='text-muted font-weight-lighter'><i class="fas fa-running"></i> Load index:</span> ${row.LoadIndex || 'n/a'}<br />
                            </small>
                        </td>
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
        artlistLower,
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
