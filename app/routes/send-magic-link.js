'use strict';

const routeName = __filename.slice(__dirname.length + 1, -3);
const routePath = __dirname.replace(/.+\/routes/, '');
const jwt = require('jsonwebtoken');
const webUtil = require('../../lib/web-util');
const Mail = require('../../lib/mail');

const emailSender = 'simple-blog@litt.no';

module.exports = (req, res) => {
    const hrstart = process.hrtime();
    webUtil.printIfDev(`Route: ${routePath}/${routeName}`, req.query, req.param);

    if (req.useragent.isBot) {
        return res.redirect(`/v2/`);
    }

    const generateJwt = account => jwt.sign({ email: account.email }, req.config.jwt.secret);
    const token = generateJwt({ email: req.config.blog.email });

    const mail = new Mail(req.config);
    mail.sendEmail({
        to: req.config.blog.email,
        from: emailSender,
        subject: 'Magic link 🎩',
        body: `Hi ${req.config.blog.email} 🤠,

As requested the Simple-Blog server has sent you a magic link 🎩 to be able to login to your blog admin.
<a href="${req.config.blog.protocol}://${req.config.blog.domain}/verify-magic-link?token=${encodeURIComponent(token)}">
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
    })
        .then(() => {
            webUtil.sendResultResponse(req, res, {
                article: {
                    title: 'Magic link sent to your email',
                    teaser: 'Swooosj!',
                    body: `Go check your email and click the link inside the email to login to your blog.

                    No username and password required.
                    `,
                },
                blog: req.config.blog,
            }, {
                hrstart,
                routePath,
                routeName,
                useTemplatePath: true,
                useTemplate: '/bootstrap4/blog.html',
            });
        });
};
