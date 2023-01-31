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
    await resourceSheet.loadCells();
    const resourceSheetHeaders = resourceSheet.headerValues;
    const columnMetaData = resourceSheet._columnMetadata;
    const rowMetaData = resourceSheet._rowMetadata;
    const headersMeta = {};
    resourceSheetHeaders.forEach((col, colIdx) => {
        const cell = resourceSheet.getCell(0, colIdx);
        headersMeta[col] = {
            value: cell.value, // This is the full value in the cell.
            valueType: cell.valueType, // The type of the value, using google's terminology. One of boolValue, stringValue, numberValue, errorValue
            formattedValue: cell.formattedValue, // The value in the cell with formatting rules applied. Ex: value is 123.456, formattedValue is $123.46
            formula: cell.formula, // The formula in the cell (if there is one)
            formulaError: cell.formulaError, // An error with some details if the formula is invalid
            note: cell.note, // The note attached to the cell
            hyperlink: cell.hyperlink, // url - URL of the cell's link if it has a=HYPERLINK formula
            effectiveFormat: cell.effectiveFormat,
            userEnteredFormat: cell.userEnteredFormat,
            columnMeta: columnMetaData[colIdx],
        };
    });

    const visibleCourses = [];
    const rows = sheetRows.map((row, idx) => {
        const data = { idx };
        resourceSheetHeaders.forEach((col) => {
            data[col] = row[col];
        });
        if (data.visible) {
            visibleCourses.push(data.id);
        }
        return data;
    });

    const meta = sheetRows.map((row, rowIdx) => {
        const data = { idx: rowIdx };
        resourceSheetHeaders.forEach((col, colIdx) => {
            const cell = resourceSheet.getCell(rowIdx + 1, colIdx);
            // const isPartOfMerge = cell.isPartOfMerge();
            // const mergedRanges = isPartOfMerge ? cell.getMergedRanges() : null;
            data[col] = {
                props: rowMetaData[rowIdx],
                value: cell.value, // This is the full value in the cell.
                valueType: cell.valueType, // The type of the value, using google's terminology. One of boolValue, stringValue, numberValue, errorValue
                formattedValue: cell.formattedValue, // The value in the cell with formatting rules applied. Ex: value is 123.456, formattedValue is $123.46
                formula: cell.formula, // The formula in the cell (if there is one)
                formulaError: cell.formulaError, // An error with some details if the formula is invalid
                note: cell.note, // The note attached to the cell
                hyperlink: cell.hyperlink, // url - URL of the cell's link if it has a=HYPERLINK formula
                effectiveFormat: cell.effectiveFormat,
                userEnteredFormat: cell.userEnteredFormat,
                // isPartOfMerge,
                // mergedRanges,
            };
        });
        return data;
    });

    // fields = 'email,cellphone,firstname,lastname,childname,childbirth,address,postalplace',
    // // fields = 'email,cellphone,firstname,lastname,address,postalplace,team,club,country',
    // const publicVisibleFields = ['firstname', 'lastname', 'postalplace', 'team', 'club', 'country', 'course', 'created', 'startnumber'];
    // const participantsSheet = doc.sheetsByIndex[1];
    // const participantsSheetRows = await participantsSheet.getRows();
    // await participantsSheet.loadCells();
    // const participantsSheetHeaders = participantsSheet.headerValues.filter(e => publicVisibleFields.includes(e));
    // const participantsSheetHeadersAll = participantsSheet.headerValues;

    // const participantsRows = participantsSheetRows.map((row, idx) => {
    //     const data = { idx };
    //     participantsSheetHeaders.forEach((col) => {
    //         data[col] = row[col];
    //     });
    //     return data;
    // }).filter(e => visibleCourses.includes(e.course));

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    const data = {
        title: doc.title,
        headers: resourceSheetHeaders,
        rows,
        // participantsHeaders: participantsSheetHeaders,
        // participantsHeadersAll: participantsSheetHeadersAll,
        // participantsRows,
        visibleCourses,
        headersMeta,
        meta,
    };
    return utilHtml.renderApi(req, res, 200, data);
};
