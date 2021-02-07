/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const tc = require('fast-type-check');
const strftime = require('strftime');

const { GoogleSpreadsheet } = require('google-spreadsheet');

const { routeName, routePath, run, webUtil, utilHtml, util } = require('../../middleware/init')({ __filename, __dirname });

const Article = require('../../../lib/class/article');
const Category = require('../../../lib/class/category');

function resultRow(row, idx, distance, rowsDbResults) {
    const runDistance = row.Distance || 0;
    const completed = Math.ceil(runDistance / distance * 100);
    let stages = [];
    if (row.Team) {
        stages = rowsDbResults.filter(e => e.email === row['Email Address'] && e.team === row.Team && e['duration sec'] > 0);

    } else {
        stages = rowsDbResults.filter(e => e.email === row['Email Address'] && e['duration sec'] > 0);
    }
    let outEpoch;
    return `<tr>
        <td>${idx + 1}</td>
        <td style='line-height: 1em;'>
            ${row.Name}<br />
            <small class='text-muted'>
                ${row['Team name']}
                (${row['Number of dogs in this race'] || 'n/a'} <i class="fas fa-dog"></i>)<br />
                <span class='font-weight-lighter'>${row['Sports club']}</span>
            </small>
        </td>
        <td style='line-height: 0.8em;' class='position-relative'>
            <div class='container-fluid'>
                <div class='row row-cols-4 border rounded-lg p-1' style='width: ${completed > 100 ? 100 : (completed < 25 ? 25 : completed)}%;'>
                    ${stages.map((stage, stageNum) => {
                        // email - team
                        // email
                        // team
                        // timestamp
                        // distanceKm
                        // elevation
                        // duration sec
                        // speed avg
                        // loadindex
                        // rest
                        // Duration HH:MI:SS
                        // Calc avg speed
                        // Rest HH:MI:SS
                        const stageDistance = Math.ceil(stage.distanceKm / distance * 100);
                        const outTime = strftime('%b %e kl.%H:%M', new Date(stage.timestamp));
                        const currentEpoch = Math.floor(new Date(stage.timestamp).getTime() / 1000);
                        const restTime = currentEpoch - outEpoch - stage['duration sec'];

                        var inDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        inDate.setUTCSeconds(currentEpoch + parseInt(stage['duration sec'], 10));
                        const inTime = strftime('%b %e kl.%H:%M', inDate);
                        const restTimeHuman = util.secReadable(restTime);
                        let restTimeText = '';
                        if (restTime > 0) {
                            restTimeText = `<i style='width: 20px;' class="fas fa-moon"></i> sjekkpunkt: ${util.pad(restTimeHuman.hours)}:${util.pad(restTimeHuman.minutes)}:${util.pad(restTimeHuman.seconds)}<br />`;
                        }
                        let restTimeTrackText = '';
                        if (stage.rest > 0) {
                            const restTimeTrackHuman = util.secReadable(stage.rest);
                            restTimeTrackText = `<i style='width: 20px;' class="fas fa-moon"></i> sporet: ${util.pad(restTimeTrackHuman.hours)}:${util.pad(restTimeTrackHuman.minutes)}:${util.pad(restTimeTrackHuman.seconds)}<br />`;
                        }
                        outEpoch = currentEpoch;
                        return `<div class='col pr-1 mx-1 mb-1 py-2 bg-success text-white text-right rounded-lg'>
                            <span class='position-absolute' style='top: 3px; left: 3px;'>${stageNum + 1}</span>
                            <small>
                                <small>
                                    <nobr><i style='width: 20px;' class="fas fa-sign-out-alt"></i> ${outTime}</nobr><br />
                                    <nobr><i style='width: 20px;' class="fas fa-sign-in-alt"></i> ${inTime}</nobr><br />
                                    ${restTimeText}
                                    ${restTimeTrackText}
                                    <i style='width: 20px;' class="fas fa-road"></i> ${util.format(stage.distanceKm, 1) || 'n/a'} <span class='font-weight-lighter'>km</span><br />
                                    <i style='width: 20px;' class="fas fa-mountain"></i> ${util.format(stage.elevation, 0) || 'n/a'} <span class='font-weight-lighter'>m</span><br />
                                    <i style='width: 20px;' class="fas fa-tachometer-alt"></i> ${util.format(stage['Calc avg speed'], 1) || 'n/a'} <span class='font-weight-lighter'>km/t</span><br />
                                    <i style='width: 20px;' class="fas fa-clock"></i> ${stage['Duration HH:MI:SS'] || 'n/a'}</span><br />
                                </small>
                            </small>
                        </div>`;
                    }).join('')}
                </div>
            </div>
            ${completed >= 99 ? `<span class='position-absolute' style='top: 10px; right: 0px;'><i class="fas fa-flag-checkered"></i></span>` : ''}
        </td>
        <td style='line-height: 0.8em;'>
            <small>
                <span class='text-muted font-weight-lighter float-left d-inline-block text-truncate w-50'>
                    <i style='width: 20px;' class="fas fa-road"></i> Distanse:</span><span class='float-right d-block w-50 text-right'> ${row.Distance || 'n/a'} <span class='text-muted font-weight-lighter'>km</span>
                </span><br />
                <div class="progress mb-1" style="height: 3px;">
                    <div class="progress-bar ${completed >= 100 ? 'bg-success' : ''}" role="progressbar" style="width: ${completed}%" aria-valuenow="${completed}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <span class='text-muted font-weight-lighter float-left d-inline-block text-truncate w-50'>
                    <i style='width: 20px;' class="fas fa-mountain"></i> Høydemeter:</span><span class='float-right d-block w-50 text-right'> ${row.Ascend || 'n/a'} <span class='text-muted font-weight-lighter'>m</span>
                </span><br />
                <span class='text-muted font-weight-lighter float-left d-inline-block text-truncate w-50'>
                    <i style='width: 20px;' class="fas fa-tachometer-alt"></i> Snittfart:</span> <span class='float-right d-block w-50 text-right'>${row.AvgSpeed || 'n/a'}  <span class='text-muted font-weight-lighter'>km/t</span>
                </span><br />
                <span class='text-muted font-weight-lighter float-left d-inline-block text-truncate w-50'>
                    <i style='width: 20px;' class="fas fa-clock"></i> Kjøretid:</span> <span class='float-right d-block w-50 text-right'>${row.RaceTime || 'n/a'}</span>
                </span><br />
                <span class='text-muted font-weight-lighter float-left d-inline-block text-truncate w-50'>
                    <i style='width: 20px;' class="fas fa-moon"></i> sporet:</span> <span class='float-right d-block w-50 text-right'>${row.RestTrack || 'n/a'}</span>
                </span><br />
            </small>
        </td>
    </tr>`;
}

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

    let limit = parseInt(req.query.limit || 50, 10);
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
    const dbResults = doc.sheetsByIndex[4]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    // console.log(sheet100km.title);

    const rows100km = await sheet100km.getRows();
    const rows150km = await sheet150km.getRows();
    const rows300km = await sheet300km.getRows();
    const rowsDbResultsRaw = await dbResults.getRows();
    const rowsDbResults = rowsDbResultsRaw.sort((a, b) => {
        return (a.timestamp > b.timestamp) ? 1 : -1;
    });

    const infoText = `<div class="alert alert-warning" role="alert">
        Resultatlisten er nå sortert etter rangering. Men vi venter inn flere spann, så den er ikke endelig ennå.
    </div>
    <div class="alert alert-danger" role="alert">
        Vi utvider fristen for innsending av filer til utpå kvelden. Det er noen som har dårlig dekning og har et stykke å kjøre før de kan laste opp dataene.
    </div>
    `;

    const bodyHtml = `
        <h5>${sheet100km.title}</h5>
        ${infoText}
        <table class='table table-striped table-sm'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Navn</th>
                    <th class='w-50'>Etapper</th>
                    <th class='w-25'>Resultat</th>
                </tr>
            </thead>
            <tbody>
                ${rows100km.map((row, idx) => resultRow(row, idx, 100, rowsDbResults)).join('')}
            </tbody>
        </table>

        <h5>${sheet150km.title}</h5>
        ${infoText}
        <table class='table table-striped table-sm'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Navn</th>
                    <th class='w-50'>Etapper</th>
                    <th class='w-25'>Resultat</th>
                </tr>
            </thead>
            <tbody>
                ${rows150km.map((row, idx) => resultRow(row, idx, 150, rowsDbResults)).join('')}
            </tbody>
        </table>

        <h5>${sheet300km.title}</h5>
        ${infoText}
        <table class='table table-striped table-sm'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Navn</th>
                    <th class='w-50'>Etapper</th>
                    <th class='w-25'>Resultat</th>
                </tr>
            </thead>
            <tbody>
                ${rows300km.map((row, idx) => resultRow(row, idx, 300, rowsDbResults)).join('')}
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
        cacheTime: 300,
    });
};
