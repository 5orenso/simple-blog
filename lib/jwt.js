'use strict';

const jwt = require('express-jwt');

module.exports = (req, res, next) => {
    if (typeof req.config.jwt !== 'undefined') {
        const authenticated = jwt({
            secret: req.config.jwt.secret,
            credentialsRequired: false,
            getToken: (request) => {
                if (request.query) {
                    return request.query.token;
                }
                return null;
            },
        });
        authenticated(req, res, next);
    } else {
        next();
    }
};
