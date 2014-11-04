/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when          = require('when'),
    _             = require('underscore'),
    path          = require('path'),
    dgram         = require('dgram'),
    client        = dgram.createSocket("udp4"),
    app_path      = __dirname + '/../';



var LocalUtil = function (options, mock_services) {
    var opts = options || {};
    var logger = opts.logger;
    mock_services = mock_services || {};
    var timers = {};

    return {
        timer: function (name) {
            if (_.isObject(timers[name])) {
                timers[name].end = process.hrtime(timers[name].start);
                timers[name].total = timers[name].end[0] + (timers[name].end[1] / 1000000000);
            } else {
                timers[name] = {
                    start: process.hrtime()
                };
            }
        },

        timers_get: function () {
            return timers;
        },

        timers_reset: function () {
            timers = {};
        },

        send_udp: function (msg) {
            if (opts.config.hasOwnProperty('udp') && _.isObject(opts.config.udp)) {
                var text_msg;
                if (_.isObject(msg)) {
                    msg.datadog = true;
                    msg.prefix = opts.config.udp.prefix || 'simpleblog';
                    msg.host = opts.config.udp.host || 'localhost';
                    text_msg = JSON.stringify(msg);
                } else {
                    text_msg = msg;
                }
                var message = new Buffer(JSON.stringify(text_msg));
                try {
                    client.send(message, 0, message.length, opts.config.udp.port, opts.config.udp.ip, function (err, bytes) {
                        if (err) {
                            logger.err('Error sending UDP: ', err);
                        }
                    });
                } catch (err) {
                    logger.err('Error sending UDP', err);
                }
            }
        },

        sortByKey: function sortByKey(array, key, noValue) {
            return array.sort(function(a, b) {
                var x = a[key] || noValue;
                var y = b[key] || noValue;
                return ((x < y) ? 1 : ((x > y) ? -1 : 0));
            });
        },

        quote_url: function quote_url (url) {
            if (_.isString(url)) {
                url = url.replace(/(\&)/g, '&amp;');
                url = url.replace(/\s/g, '%20');
                return url;
            } else {
                return '';
            }
        },

        iso_date: function (date, date_only) {
            // http://en.wikipedia.org/wiki/ISO_8601
            function pad (number, length) {
                var r = String(number);
                if (r.length < length) {
                    var diff_length = length - r.length;
                    for (var i = 0; i < diff_length; i++) {
                        r = '0' + r;
                    }
                }
                return r;
            }

            var now;
            if (date) {
                now = new Date(0); // The 0 there is the key, which sets the date to the epoch
                now.setUTCSeconds(date/1000);
            } else {
                now = new Date();
            }
            var mm = now.getMonth() + 1;
            var dd = now.getDate();
            var yy = now.getFullYear();
            var hh = now.getHours();
            var mi = now.getMinutes();
            var ss = now.getSeconds();
            var ms = now.getMilliseconds();
            var tzo = -now.getTimezoneOffset(),
                dif = tzo >= 0 ? '+' : '-';

            return pad(yy, 4) + '-' +
                pad(mm, 2) + '-' +
                pad(dd, 2) + (date_only ? '' :
                    'T' +
                    pad(hh, 2) + ':' +
                    pad(mi, 2) + ':' +
                    pad(ss, 2) + '.' +
                    pad(ms, 3) +
                    dif +
                    pad(tzo / 60, 2) + ':' +
                    pad(tzo % 60, 2)
                );
        }

    };
};

module.exports = LocalUtil;
