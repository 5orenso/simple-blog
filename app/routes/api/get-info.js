/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const { routeName, routePath, run, webUtil, utilHtml, util, tc } = require('../../middleware/init')({ __filename, __dirname });

function getToken(request) {
    if (request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Bearer') {
        return request.headers.authorization.split(' ')[1];
    } else if (request.query && request.query.token) {
        return request.query.token;
    }
    return null;
}

module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);

    let currentEmail;

    if (req.session && req.session.email) {
        currentEmail = req.session.email;
    } else {
        const jwtToken = getToken(req);
        const decodedToken = util.decodeJwtToken(jwtToken, req.config);
        if (decodedToken && decodedToken.email) {
            currentEmail = decodedToken.email;
        }
    }

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

    const data = {
        status: 200,
        data: {
            isAdmin,
            isExpert,
            currentEmail,
        },
    };

    utilHtml.renderApi(req, res, 200, data);
};
