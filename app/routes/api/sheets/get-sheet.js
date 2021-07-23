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

const { routeName, routePath, run, webUtil, utilHtml, util } = require('../../../middleware/init')({ __filename, __dirname });

const Article = require('../../../../lib/class/article');
const Category = require('../../../../lib/class/category');

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
                <div class='row p-1'>
                    ${row.RaceComment ? `<div class="alert alert-warning" role="alert">${row.RaceComment}</div>` : ''}
                </div>
            </div>
            ${completed >= 99 ? `<span class='position-absolute' style='top: 10px; right: 0px;'><i class="fas fa-flag-checkered text-success"></i></span>` : ''}
            ${row.RaceStatus === 'DNF' || row.RaceStatus === 'DNS' ? `<span class='position-absolute' style='top: 10px; right: 0px;'>${row.RaceStatus} <i class="fas fa-times text-danger"></i></span>` : ''}            
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

    const infoText100km = `<div class="alert alert-success" role="alert">
        Resultatlisten er endelig. 
    </div>`;
    const infoText150km = `<div class="alert alert-success" role="alert">
        Resultatlisten er endelig. 
    </div>`;
    const infoText300km = `<div class="alert alert-success" role="alert">
        Resultatlisten er endelig. 
    </div>`;

    const bodyHtml = `
        <h5>${sheet100km.title}</h5>
        ${infoText100km}
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
        ${infoText150km}
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
        ${infoText300km}
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
