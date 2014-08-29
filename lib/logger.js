/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when    = require('when'),
    winston = require('winston'),
    _       = require('underscore'),
    path    = __dirname + '/../';

var logger = null; // cached

var Logger = function (opt, mock_services) {
    var opts = opt || {};
    mock_services = mock_services || {};
    if (mock_services.logger) {
        logger = mock_services.logger;
    } else if (!logger) {
        logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)(),
                new (winston.transports.File)({ filename: 'somefile.log' })
            ]
        });
    }

    return {
        log: function () {
            var msg = [];
            var meta = null;
            for (var i = 0, l = arguments.length; i < l; i++) {
                if (_.isString(arguments[i]) || _.isNumber(arguments[i])) {
                    msg.push(arguments[i]);
                } else if (_.isObject(arguments[i]) && !meta) {
                    meta = arguments[i];
                } else if (_.isObject(arguments[i])) {
                    msg.push(JSON.stringify(arguments[i]));
                }
            }
            return when.promise( function (resolve, reject) {
                var ms = (new Date).getTime();
                resolve(logger.log('info', ms + ': ' + msg.join(' -> '), meta));
//                resolve(true);
                // TODO: Should handle errors.
            });
        },

        err: function (message) {
            return when.promise( function (resolve, reject) {
                logger.log('error', message);
                resolve(true);
                // TODO: Should handle errors.
            });
        }
    };
};

module.exports = Logger;


