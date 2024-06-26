'use strict';

const { routeName, routePath, run, webUtil, utilHtml, tc } = require('../middleware/init')({ __filename, __dirname });

const jwt = require('jsonwebtoken');
const Mail = require('../../lib/mail');

const emailSender = 'simple-blog@litt.no';

module.exports = async (req, res) => {
    const hrstart = process.hrtime();
    webUtil.printIfDev(`Route: ${routePath}/${routeName}`, req.query, req.param);

    // if (req.useragent.isBot) {
    //     return res.redirect(`/v2/`);
    // }
    // if (!req.useragent.isMobile && !req.useragent.isDesktop) {
    //     return res.redirect(`/v2/`);
    // }
    if (req.headers['cloudfront-viewer-country'] === 'NO') {
        // Good to go!
    } else if (req.headers['cloudfront-is-desktop-viewer'] === 'false'
        && req.headers['cloudfront-is-mobile-viewer'] === 'false'
        && req.headers['cloudfront-is-smarttv-viewer'] === 'false'
        && req.headers['cloudfront-is-tablet-viewer'] === 'false') {
        return res.redirect(`/v2/`);
    }

    // Request header:
    // ${JSON.stringify(req.headers, null, 4)}
    // {
    // "host": "femundlopet.no:1100",
    // "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    // "accept-encoding": "gzip, deflate, br",
    // "accept-language": "en-GB,en;q=0.5",
    // "cloudfront-forwarded-proto": "https",
    // "cloudfront-is-desktop-viewer": "true",
    // "cloudfront-is-mobile-viewer": "false",
    // "cloudfront-is-smarttv-viewer": "false",
    // "cloudfront-is-tablet-viewer": "false",
    // "cloudfront-viewer-country": "NO",
    // "cookie": "PHPSESSID=kqglc1pvqp4hqic5kvpptr1siv; _ga=GA1.1.195418726.1628583887; _ga_6DHN8B6D0J=GS1.1.1633191924.23.0.1633191925.0; catAccCookies=1; disableCookies=null; language=no; session=DeHCAPnNQpv5ihT4o9vadQ.jL9t8pPVg9D5dB8imbHV4wABrmK2wmZ_5TV20jy9qWkZBJphs32r35Jqlx0B7vb01OdtBqIxbS7picn-NmgmNxZDqJBeIv4bhTEQjafKFI6F2aEPl4kLCWrw6rm7f4xWYtlAp53haJSG0W6vIWHvbA.1632316283686.2592000000.w4afeNZT_G0Zn7jQM0Ru3f7ItIFtBZPmspKRYgngIvo",
    // "referer": "https://femundlopet.no/v2/",
    // "sec-fetch-dest": "document",
    // "sec-fetch-mode": "navigate",
    // "sec-fetch-site": "same-origin",
    // "sec-fetch-user": "?1",
    // "upgrade-insecure-requests": "1",
    // "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:92.0) Gecko/20100101 Firefox/92.0",
    // "via": "2.0 84e4cca7594b188d1fc78926770ee142.cloudfront.net (CloudFront)",
    // "x-amz-cf-id": "AKR9tdgX9YBIEtqarmDVeceS1KDgROp3kcuhEkiNF3I4CNfzMTexWA==",
    // "x-forwarded-for": "46.212.86.188, 70.132.45.166",
    // "x-forwarded-port": "1100",
    // "x-forwarded-proto": "http",
    // "connection": "keep-alive"
    // }

    const currentEmail = req.body.email;
    let isAdmin = false;
    if (tc.isString(req.config.blog.email)) {
        isAdmin = req.config.blog.email === currentEmail;
    } else if (tc.isArray(req.config.blog.email)) {
        isAdmin = req.config.blog.email.includes(currentEmail);
    }
    let isExpert = false;
    if (tc.isArray(req.config.blog.experts)) {
        isExpert = req.config.blog.experts.includes(currentEmail);
    }
    if (currentEmail && !isAdmin && !isExpert) {
        return utilHtml.renderApi(req, res, 403, {
            status: 403,
            title: 'Email not allowed',
            body: `Email ${currentEmail} is not allowed to access this site.`,
        });
    }

    const generateJwt = account => jwt.sign({ email: account.email }, req.config.jwt.secret);
    let email;
    if (tc.isString(req.body.email)) {
        email = req.body.email;
    } else if (tc.isArray(req.config.blog.email)) {
        email = req.config.blog.email[0];
    } else if (tc.isString(req.config.blog.email)) {
        email = req.config.blog.email;
    }
    const token = generateJwt({ email });

    const mail = new Mail(req.config);
    if (isExpert) {
        await mail.sendEmail({
            to: currentEmail,
            from: emailSender,
            subject: `${req.config.blog.domain}: Magic link 🎩 `,
            body: `Hi ${req.config.blog.email} 🤠,

Domain: ${req.config.blog.domain}

As requested the Simple-Blog server has sent you a magic link 🎩 to be able to login as expert.
<a href="${req.config.blog.protocol}://${req.config.blog.admindomain || req.config.blog.domain}/verify-magic-link?token=${encodeURIComponent(token)}">
Click this link to magically login to your blog 👌</a>

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
    } else {
        // Admin with or without email:
        await mail.sendEmail({
            to: isAdmin ? currentEmail : req.config.blog.email,
            from: emailSender,
            subject: `${req.config.blog.domain}: Magic link 🎩 `,
            body: `Hi ${req.config.blog.email} 🤠,

Domain: ${req.config.blog.domain}

As requested the Simple-Blog server has sent you a magic link 🎩 to be able to login to your blog admin.
<a href="${req.config.blog.protocol}://${req.config.blog.admindomain || req.config.blog.domain}/verify-magic-link?token=${encodeURIComponent(token)}">
Click this link to magically login to your blog 👌</a>

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
    }

    utilHtml.renderApi(req, res, 200, {
        status: 200,
        title: 'Magic link sent to your email',
        teaser: 'Swooosj!',
        body: `Go check your email and click the link inside the email to login to your blog.

        No username and password required.
        `,
    });
};
