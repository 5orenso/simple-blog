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

    const sheets = [];
    for (let i = 0, l = doc.sheetsByIndex.length; i < l; i += 1) {
        const sheet = doc.sheetsByIndex[i];

        const sheetRows = await sheet.getRows();
        await sheet.loadCells();

        const sheetHeaders = sheet.headerValues;

        const headersMeta = {};
        sheetHeaders.forEach((col, colIdx) => {
            const cell = sheet.getCell(0, colIdx);
            headersMeta[col] = {
                value: cell.value, // This is the full value in the cell.
                valueType: cell.valueType, // The type of the value, using google's terminology. One of boolValue, stringValue, numberValue, errorValue
                formattedValue: cell.formattedValue, // The value in the cell with formatting rules applied. Ex: value is 123.456, formattedValue is $123.46
                formula: cell.formula, // The formula in the cell (if there is one)
                formulaError: cell.formulaError, // An error with some details if the formula is invalid
                note: cell.note, // The note attached to the cell
                hyperlink: cell.hyperlink, // url - URL of the cell's link if it has a=HYPERLINK formula
                effectiveFormat: cell.effectiveFormat,
            };
        });

        const rows = sheetRows.map((row, rowIdx) => {
            const data = { idx: rowIdx };
            sheetHeaders.forEach((col) => {
                data[col] = row[col];
            });
            return data;
        });

        const meta = sheetRows.map((row, rowIdx) => {
            const data = { idx: rowIdx };
            sheetHeaders.forEach((col, colIdx) => {
                const cell = sheet.getCell(rowIdx + 1, colIdx);
                data[col] = {
                    value: cell.value, // This is the full value in the cell.
                    valueType: cell.valueType, // The type of the value, using google's terminology. One of boolValue, stringValue, numberValue, errorValue
                    formattedValue: cell.formattedValue, // The value in the cell with formatting rules applied. Ex: value is 123.456, formattedValue is $123.46
                    formula: cell.formula, // The formula in the cell (if there is one)
                    formulaError: cell.formulaError, // An error with some details if the formula is invalid
                    note: cell.note, // The note attached to the cell
                    hyperlink: cell.hyperlink, // url - URL of the cell's link if it has a=HYPERLINK formula
                    effectiveFormat: cell.effectiveFormat,
                };
            });
            return data;
        });

        sheets.push({
            title: sheet.title,
            headers: sheetHeaders,
            headersMeta,
            rows,
            meta,
        });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    const data = {
        title: doc.title,
        sheets,
    };
    return utilHtml.renderApi(req, res, 200, data);
};
