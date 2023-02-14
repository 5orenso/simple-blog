/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2021 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const { routeName, routePath, run, webUtil, utilHtml, tc } = require('../../../middleware/init')({ __filename, __dirname });
const Mail = require('../../../../lib/mail');

const emailSender = 'post@themusher.no';

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    const mail = new Mail(req.config);

    // -  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Send emails one by one
    const to = tc.asArray(req.body.to.split(','));
    const from = tc.asString(req.body.from || emailSender);
    const subject = tc.asString(req.body.subject);
    const body = tc.asString(req.body.body);
    const bodyHtml = body.replace(/\n/g, '<br>');
    const emailPromises = [];

    for (let i = 0, l = to.length; i < l; i += 1) {
        const emailAddress = to[i];
        emailPromises.push(
            mail.sendEmail({
                to: emailAddress,
                from,
                subject,
                body: bodyHtml,
                bodyText: body,
            }),
        );
    }
    const emailResults = await Promise.all(emailPromises);
    // -  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    const response = {
        status: 200,
        message: `Emails sent`,
        data: emailResults,
    };
    return utilHtml.renderApi(req, res, 200, response);
};
