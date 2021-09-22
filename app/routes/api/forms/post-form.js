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
const Mail = require('../../../../lib/mail');

const { GoogleSpreadsheet } = require('google-spreadsheet');

const { routeName, routePath, run, webUtil, utilHtml, util } = require('../../../middleware/init')({ __filename, __dirname });

module.exports = async (req, res) => {
    const { hrstart, runId } = run(req);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    const googleSheetId = req.params.sheetid; // '1A6hdvpg_Kz2mHbcaGA6-RmLvgwALB2bE3kKnPTFtPjE';
    const { google } = req.config;
    const { email } = req.body;

    // Initialize the sheet - doc ID is the long id in the sheets URL
    const doc = new GoogleSpreadsheet(googleSheetId);

    // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
    await doc.useServiceAccountAuth(google);

    await doc.loadInfo(); // loads document properties and worksheets
    // console.log(doc.title);

    const signupSheet = doc.sheetsByIndex[1];
    const sheetRows = await signupSheet.getRows();

    const existingRow = sheetRows.findIndex(row => (row.email === email));

    if (existingRow > -1) {
        const data = {
            title: doc.title,
            data: 'Allerede påmeldt!',
            status: 400,
            id: existingRow.id,
        };
        return utilHtml.renderApi(req, res, 400, data);
    }

    const {
        cellphone, phone, firstname, lastname, address, zip, place,
    } = req.body;
    const { emailSender, emailSignature } = req.config.blog;
    const mail = new Mail(req.config);
    await mail.sendEmail({
        to: email,
        from: emailSender,
        subject: `Kvittering for påmelding: ${doc.title}`,
        body: `<div style='font-size: 17px;'>Hei ${firstname},

<strong>Du er nå påmeldt: ${doc.title}!</strong>

<strong>Påmeldingsinformasjon:</strong>
<span style='font-weight: lighter; color: #808080;'>E-post:</span> ${email || ''}
<span style='font-weight: lighter; color: #808080;'>Mobil:</span> ${cellphone || phone || ''}
<span style='font-weight: lighter; color: #808080;'>Navn:</span> ${firstname || ''} ${lastname || ''}

${emailSignature || ''}

</div>`.replace(/\n/g, '<br/>'),
    });

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
