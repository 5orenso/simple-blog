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
const Mail = require('../../../../lib/mail');

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

    const participantsSheet = doc.sheetsByIndex[1];
    const participantsSheetRows = await participantsSheet.getRows();
    await participantsSheet.loadCells();
    const participantsSheetHeaders = participantsSheet.headerValues;

    const field = req.body.field;
    const value = req.body.value || '';
    const body = req.body.body || '';
    const subject = req.body.subject || '';

    const emailRecipients = [];

    const participantsRows = participantsSheetRows.map((row, idx) => {
        const data = { idx };
        participantsSheetHeaders.forEach((col) => {
            data[col] = row[col] || '';
        });

        if (data[field] === value) {
            emailRecipients.push(data);
        }

        return data;
    });

    // console.log({ participantsRows });
    // console.log({ emailRecipients });

    const mail = new Mail(req.config);
    const { emailSender } = req.config.blog;

    emailRecipients.forEach(async (person) => {
        const personBody = utilHtml.replaceDataTags(body, person);
        const mailObject = {
            to: person.email,
            from: emailSender,
            subject,
            body: `<div style='font-size: 17px;'>${personBody}</div>`.replace(/\n/g, '<br/>'),
        };
        await mail.sendEmail(mailObject, { useHtmlTemplate: true });
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    const data = {
        message: `Sent email to `,
    };
    return utilHtml.renderApi(req, res, 200, data);
};
