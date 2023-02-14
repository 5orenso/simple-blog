/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const { routeName, routePath, run, webUtil, utilHtml, tc } = require('../../middleware/init')({ __filename, __dirname });
const Article = require('../../../lib/class/article');
const Mail = require('../../../lib/mail');

const emailSender = 'simple-blog@litt.no';

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    const art = new Article();

    const data = webUtil.cleanObject(req.body, { nullIsUndefined: true });
    data.status = 1;
    const apiContent = await art.save(data);

    const mail = new Mail(req.config);
    let email;
    if (tc.isArray(req.config.blog.email)) {
        email = req.config.blog.email[0];
    } else if (tc.isString(req.config.blog.email)) {
        email = req.config.blog.email;
    }
    const emailSendResult = await mail.sendEmail({
        to: email,
        from: emailSender,
        subject: `${req.config.blog.domain}: New question in Livecenter `,
        body: `Hi ${req.config.blog.email} 🤠,

Domain: ${req.config.blog.domain}

You have a new question in your Livecenter:

From: ${data.teaser}
E-post: ${data.author}
Question:
${data.ingress}

<hr />
<span style='color: #808080'>
isMobile: ${req.useragent.isMobile}
isDesktop: ${req.useragent.isDesktop}
isBot: ${req.useragent.isBot}
browser: ${req.useragent.browser}
version: ${req.useragent.version}
os: ${req.useragent.os}
platform: ${req.useragent.platform}
source: ${req.useragent.source}
</span>
<hr />

Best regard,
The Simple-Blog server

<i style="color: #c0c0c0;">
Request header:
${JSON.stringify(req.headers, null, 4)}
</i>
`.replace(/\n/g, '<br>'),
    });

    console.log('emailSendResult', emailSendResult);
    return utilHtml.renderApi(req, res, 201, apiContent);
};
