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

module.exports = async (req, res) => {
    const { hrstart, runId } = run(req);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    const googleSheetId = req.params.sheetid; // '1A6hdvpg_Kz2mHbcaGA6-RmLvgwALB2bE3kKnPTFtPjE';
    const { google } = req.config;

    // Initialize the sheet - doc ID is the long id in the sheets URL
    const doc = new GoogleSpreadsheet(googleSheetId);

    // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
    await doc.useServiceAccountAuth(google);

    await doc.loadInfo(); // loads document properties and worksheets
    // console.log(doc.title);

    const resourceSheet = doc.sheetsByIndex[0];

    const sheetRows = await resourceSheet.getRows();
    const resourceSheetHeaders = resourceSheet.headerValues;

    const rows = sheetRows.map((row, idx) => {
        const data = { idx };
        resourceSheetHeaders.forEach((col) => {
            data[col] = row[col];
        });
        return data;
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    const data = {
        title: doc.title,
        headers: resourceSheetHeaders,
        rows,
    };
    return utilHtml.renderApi(req, res, 200, data);
};
