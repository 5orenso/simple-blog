/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when     = require('when'),
    _        = require('underscore'),
    hostname = require('os').hostname();

function Logger(opt) {
    this.opts = opt || {};
}

Logger.prototype.log = function () {
    var level = 'info';
    if (_.isObject(this.opts) && _.isObject(this.opts.log)) {
        if (_.isString(this.opts.log.level)) {
            level = this.opts.log.level;
        }
    }
    if (arguments[0].match(/^(debug|info|notice|warning|error|crit|alert|emerg)$/)) {
        level = arguments[0];
        delete arguments[0];
    }
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
    var opts = this.opts;
    console.log(level, Logger.prototype.isoDate() + ' [' + (opts.workerId || '') + ']' + ': ' +
        msg.join(' -> '), meta);
    return true;
};

Logger.prototype.err = function () {
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
    var opts = this.opts;
    console.log('error', Logger.prototype.isoDate() + ' [' + (opts.workerId || '') + ']' + ': ' +
        msg.join(' -> '), meta);
    return true;
};

Logger.prototype.isoDate = function isoDate(date) {
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
        now.setUTCSeconds(date);
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
        pad(dd, 2) + 'T' +
        pad(hh, 2) + ':' +
        pad(mi, 2) + ':' +
        pad(ss, 2) + '.' +
        pad(ms, 3) +
        dif +
        pad(tzo / 60, 2) + ':' +
        pad(tzo % 60, 2);
};

Logger.prototype.set = function (key, value) {
    this.opts[key] = value;
    return true;
};

Logger.prototype.get = function (key) {
    return this.opts[key];
};

module.exports = Logger;
