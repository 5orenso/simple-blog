/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const _ = require('underscore');

function Logger(opt) {
    this.opts = opt || {};
}

Logger.prototype.log = function log(...rest) {
    let level = 'info';
    const $rest = rest;
    if (_.isObject(this.opts) && _.isObject(this.opts.log)) {
        if (_.isString(this.opts.log.level)) {
            level = this.opts.log.level;
        }
    }
    if ($rest[0].match(/^(debug|info|notice|warning|error|crit|alert|emerg)$/)) {
        level = $rest[0];
        delete $rest[0];
    }
    const msg = [];
    let meta = null;
    for (let i = 0, l = $rest.length; i < l; i += 1) {
        if (_.isString($rest[i]) || _.isNumber($rest[i])) {
            msg.push($rest[i]);
        } else if (_.isObject($rest[i]) && !meta) {
            meta = $rest[i];
        } else if (_.isObject($rest[i])) {
            msg.push(JSON.stringify($rest[i]));
        }
    }
    const opts = this.opts;
    console.log(level, `${Logger.prototype.isoDate()} [${opts.workerId || ''}]: ${
        msg.join(' -> ')}`, meta);
    return true;
};

Logger.prototype.err = function err(...rest) {
    const msg = [];
    let meta = null;
    for (let i = 0, l = rest.length; i < l; i += 1) {
        if (_.isString(rest[i]) || _.isNumber(rest[i])) {
            msg.push(rest[i]);
        } else if (_.isObject(rest[i]) && !meta) {
            meta = rest[i];
        } else if (_.isObject(rest[i])) {
            msg.push(JSON.stringify(rest[i]));
        }
    }
    const opts = this.opts;
    console.log('error', `${Logger.prototype.isoDate()} [${opts.workerId || ''}]: ${
        msg.join(' -> ')}`, meta);
    return true;
};

Logger.prototype.isoDate = function isoDate(date) {
    // http://en.wikipedia.org/wiki/ISO_8601
    function pad(number, length) {
        let r = String(number);
        if (r.length < length) {
            const diffLength = length - r.length;
            for (let i = 0, l = diffLength; i < l; i += 1) {
                r = `0${r}`;
            }
        }
        return r;
    }
    let now;
    if (date) {
        now = new Date(0); // The 0 there is the key, which sets the date to the epoch
        now.setUTCSeconds(date);
    } else {
        now = new Date();
    }
    const mm = now.getMonth() + 1;
    const dd = now.getDate();
    const yy = now.getFullYear();
    const hh = now.getHours();
    const mi = now.getMinutes();
    const ss = now.getSeconds();
    const ms = now.getMilliseconds();
    const tzo = -now.getTimezoneOffset();
    const dif = tzo >= 0 ? '+' : '-';
    return `${pad(yy, 4)}-${
        pad(mm, 2)}-${
        pad(dd, 2)}T${
        pad(hh, 2)}:${
        pad(mi, 2)}:${
        pad(ss, 2)}.${
        pad(ms, 3)
    }${dif
    }${pad(tzo / 60, 2)}:${
        pad(tzo % 60, 2)}`;
};

Logger.prototype.set = function set(key, value) {
    this.opts[key] = value;
    return true;
};

Logger.prototype.get = function get(key) {
    return this.opts[key];
};

module.exports = Logger;
