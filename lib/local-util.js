/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014-2015 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var _             = require('underscore'),
    dgram         = require('dgram'),
    client        = dgram.createSocket('udp4');

function LocalUtil(options) {
    this.opts = options || {};
    this.logger = this.opts.logger;
    this.timers = {};
}

LocalUtil.prototype.timer = function timer(name) {
    if (_.isObject(this.timers[name])) {
        this.timers[name].end = process.hrtime(this.timers[name].start);
        this.timers[name].total = this.timers[name].end[0] + (this.timers[name].end[1] / 1000000000);
    } else {
        this.timers[name] = {
            start: process.hrtime()
        };
    }
};

LocalUtil.prototype.timersGet = function timersGet() {
    return this.timers;
};

LocalUtil.prototype.timersReset = function timersReset() {
    this.timers = {};
};

LocalUtil.prototype.sendUdp = function sendUdp(msg, callback) {
    if (this.opts.config.hasOwnProperty('udp') && _.isObject(this.opts.config.udp)) {
        var textMsg;
        if (_.isObject(msg)) {
            msg.datadog = true;
            msg.prefix = this.opts.config.udp.prefix || 'unknown';
            msg.host = this.opts.config.udp.host || 'localhost';
            textMsg = JSON.stringify(msg);
        } else {
            textMsg = msg;
        }
        var message = new Buffer(JSON.stringify(textMsg));
        var logger = this.logger;
        try {
            client.send(message, 0, message.length, this.opts.config.udp.port, this.opts.config.udp.ip,
                function (err, bytes) {
                    if (err) {
                        logger.err('Error sending UDP: ', err);
                        if (_.isFunction(callback)) {
                            callback(err, null);
                        }
                    } else if (_.isFunction(callback)) {
                        callback(null, bytes);
                    }
                });
        } catch (err) {
            if (_.isFunction(callback)) {
                callback(err, null);
            }
            this.logger.err('Error sending UDP', err);
        }
    }
};

LocalUtil.prototype.sortByKey = function sortByKey(array, key, noValue) {
    return array.sort(function (a, b) {
        var x = a[key] || noValue;
        var y = b[key] || noValue;
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
};

LocalUtil.prototype.quoteUrl = function quoteUrl(url) {
    if (_.isString(url)) {
        url = url.replace(/(\&)/g, '&amp;');
        url = url.replace(/\s/g, '%20');
        return url;
    } else {
        return '';
    }
};

LocalUtil.prototype.safeString = function safeString(string) {
    if (typeof string === 'string') {
        string = string.toLowerCase();
        string = string.replace(/[^a-z0-9æøå\s\-]/g, ' ');
        string = string.trim();
    }
    return string;
};

LocalUtil.prototype.isoDate = function isoDate(date, dateOnly) {
    // http://en.wikipedia.org/wiki/ISO_8601
    function pad(number, length) {
        var r = String(number);
        if (r.length < length) {
            var diffLength = length - r.length;
            for (var i = 0; i < diffLength; i++) {
                r = '0' + r;
            }
        }
        return r;
    }

    var now;
    if (date) {
        now = new Date(0); // The 0 there is the key, which sets the date to the epoch
        now.setUTCSeconds(date / 1000);
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
        pad(dd, 2) + (dateOnly ? '' :
            'T' +
            pad(hh, 2) + ':' +
            pad(mi, 2) + ':' +
            pad(ss, 2) + '.' +
            pad(ms, 3) +
            dif +
            pad(tzo / 60, 2) + ':' +
            pad(tzo % 60, 2)
        );
};

LocalUtil.prototype.setCacheHeaders = function setCacheHeaders(request, response, next) {
    var cacheTime = 3600;
    response.setHeader('Cache-Control', 'public, max-age=' + cacheTime);
    response.setHeader('Expires', new Date(Date.now() + (cacheTime * 1000)).toUTCString());
    response.setHeader('Last-Modified', new Date(Date.now() - (3600 * 1000)).toUTCString());
    //res.header('Access-Control-Allow-Origin', config.allowedDomains);
    //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

LocalUtil.prototype.setNoCacheHeaders = function setNoCacheHeaders(request, response, next) {
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.setHeader('Pragma', 'no-cache');
    response.setHeader('Expires', 0);
    next();
};

module.exports = LocalUtil;
