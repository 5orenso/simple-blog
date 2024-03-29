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
    const { email, course } = req.body;

    // Initialize the sheet - doc ID is the long id in the sheets URL
    const doc = new GoogleSpreadsheet(googleSheetId);

    // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
    await doc.useServiceAccountAuth(google);

    await doc.loadInfo(); // loads document properties and worksheets
    // console.log(doc.title);

    const courseSheet = doc.sheetsByIndex[0];
    const courseRows = await courseSheet.getRows();

    const courseRow = courseRows.find(row => (row.id === course));

    const signupSheet = doc.sheetsByIndex[2];

    const {
        cellphone, firstname, lastname, address, postalcode, postalplace,
        childname, childbirth,
    } = req.body;

    const { emailSender, emailSignature } = req.config.blog;
    const mail = new Mail(req.config);

//     const mailObject = {
//         to: email,
//         from: emailSender,
//         subject: `Log for påmelding: ${doc.title}`,
//         body: `<div style='font-size: 17px;'>Hei ${firstname},

// <strong>Foreløpig input:</strong>
// ${courseRow.name}
// ${courseRow.description}
// ${courseRow.address}
// ${courseRow.postalcode} ${courseRow.postalplace}

// <span style='font-weight: lighter; color: #808080;'>Fra:</span> ${courseRow['date from']}
// <span style='font-weight: lighter; color: #808080;'>Til:</span> ${courseRow['date to']}

// <strong>Påmeldingsinformasjon:</strong>
// <span style='font-weight: lighter; color: #808080;'>E-post:</span> ${email}
// <span style='font-weight: lighter; color: #808080;'>Mobil:</span> ${cellphone}
// <span style='font-weight: lighter; color: #808080;'>Navn:</span> ${firstname} ${lastname}
// <span style='font-weight: lighter; color: #808080;'>Barnets navn:</span> ${childname}
// <span style='font-weight: lighter; color: #808080;'>Barnets fødselsdato:</span> ${childbirth}
// <span style='font-weight: lighter; color: #808080;'>Adresse:</span> ${address}
// <span style='font-weight: lighter; color: #808080;'>Sted:</span> ${postalcode} ${postalplace}

// ${emailSignature}

// </div>`.replace(/\n/g, '<br/>'),
//     };
//     // await mail.sendEmail(mailObject);

//     // mailObject.to = req.config.blog.emailSender;
//     // await mail.sendEmail(mailObject);

//     mailObject.to = 'sorenso@gmail.com';
//     await mail.sendEmail(mailObject);

    try {
        signupSheet.addRow({
            ...req.body,
            id: uuidv4(),
            created: new Date(),
            logincode: util.generateCode(),
        });
    } catch (err) {
        const errorMailObject = {
            to: 'sorenso@gmail.com',
            from: emailSender,
            subject: `Feil i lagring av log ${req.config.blog.emailSender}`,
            body: `ERROR!

<xmp>${err}</xmp>

`.replace(/\n/g, '<br/>'),
        };
        await mail.sendEmail(errorMailObject);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    const data = {
        title: doc.title,
        data: 'Row added',
        status: 202,
    };
    return utilHtml.renderApi(req, res, 202, data);
};
