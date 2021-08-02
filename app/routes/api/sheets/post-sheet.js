/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const uuidv4 = require('uuid/v4');
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

    const signupSheet = doc.sheetsByIndex[1];

    const sheetRows = await signupSheet.getRows();

    const { email, course } = req.body;
    const existingRow = sheetRows.findIndex(row => (row.email === email && row.course === course));
    if (existingRow > -1) {
        const data = {
            title: doc.title,
            data: 'Allerede påmeldt!',
            status: 400,
            id: existingRow.id,
        };
        return utilHtml.renderApi(req, res, 400, data);
    }

    signupSheet.addRow({
        ...req.body,
        id: uuidv4(),
        created: new Date(),
        logincode: util.generateCode(),
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    const data = {
        title: doc.title,
        data: 'Row added',
        status: 202,
    };
    return utilHtml.renderApi(req, res, 202, data);
};
