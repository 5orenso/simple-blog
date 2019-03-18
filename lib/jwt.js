'use strict';

const jwt = require('express-jwt');

module.exports = (req, res, next) => {
    if (typeof req.config.jwt !== 'undefined') {
        const authenticated = jwt({
            secret: req.config.jwt.secret,
            credentialsRequired: false,
            getToken: (request) => {
                if (request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Bearer') {
                    return request.headers.authorization.split(' ')[1];
                } else if (request.query && request.query.token) {
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
