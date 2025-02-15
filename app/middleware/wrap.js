'use strict';

module.exports = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch((err) => {
            next(err);
        });
};
