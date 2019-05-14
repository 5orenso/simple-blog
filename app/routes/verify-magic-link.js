'use strict';

const routeName = __filename.slice(__dirname.length + 1, -3);
const routePath = __dirname.replace(/.+\/routes/, '');
const webUtil = require('../../lib/web-util');

module.exports = (req, res) => {
    const hrstart = process.hrtime();
    webUtil.printIfDev(`Route: ${routePath}/${routeName}`, req.query, req.param);

    req.session.email = req.user.email;
    req.session.iat = req.user.iat;

    webUtil.sendResultResponse(req, res, {
        article: {
            title: 'Magic link verified',
            teaser: 'Abra Kadabra!',
            body: 'You are now logged in and able to do cools stuff inside your blog.\n'
                + '<a href="/admin/">Jump to the admin page</a> to get started.',
        },
        blog: req.config.blog,
    }, {
        hrstart,
        routePath,
        routeName,
        useTemplatePath: true,
        useTemplate: '/bootstrap4/blog.html',
    });
};
