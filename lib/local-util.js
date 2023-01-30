/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014-2015 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const _ = require('underscore');

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
            start: process.hrtime(),
        };
    }
};

LocalUtil.prototype.timersGet = function timersGet() {
    return this.timers;
};

LocalUtil.prototype.timersReset = function timersReset() {
    this.timers = {};
};

LocalUtil.prototype.sortByKey = function sortByKey(array, key, noValue) {
    return array.sort((a, b) => {
        const x = a[key] || noValue;
        const y = b[key] || noValue;
        if ((x < y)) {
            return 1;
        } else if ((x > y)) {
            return -1;
        }
        return 0;
        // return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
};

LocalUtil.prototype.quoteUrl = function quoteUrl($url) {
    let url = $url;
    if (_.isString(url)) {
        url = url.replace(/(&)/g, '&amp;');
        url = url.replace(/\s/g, '%20');
        return url;
    }
    return '';
};

LocalUtil.prototype.safeString = function safeString($string) {
    let string = $string;
    if (typeof string === 'string') {
        string = $string.toLowerCase();
        string = string.replace(/[^a-z0-9æøå\s-]/g, ' ');
        string = string.trim();
    }
    return string;
};

LocalUtil.prototype.isoDate = function isoDate(date, dateOnly) {
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
        now.setUTCSeconds(date / 1000);
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
        pad(dd, 2)}${dateOnly ? '' :
        `T${
            pad(hh, 2)}:${
            pad(mi, 2)}:${
            pad(ss, 2)}.${
            pad(ms, 3)
        }${dif
        }${pad(tzo / 60, 2)}:${
            pad(tzo % 60, 2)}`}`;
};

LocalUtil.prototype.setCacheHeaders = function setCacheHeaders(request, response, next) {
    let cacheTime = 3600;
    if (request.originalUrl.match(/^\/pho\/.+?\.(jpg|png|gif)/i)) {
        cacheTime = 86400 * 30;
    }
    response.setHeader('Cache-Control', `public, max-age=${cacheTime}`);
    response.setHeader('Expires', new Date(Date.now() + (cacheTime * 1000)).toUTCString());
    response.setHeader('Last-Modified', new Date(Date.now() - (3600 * 1000)).toUTCString());
    // res.header('Access-Control-Allow-Origin', config.allowedDomains);
    // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

LocalUtil.prototype.setNoCacheHeaders = function setNoCacheHeaders(request, response, next) {
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    // response.setHeader('Pragma', 'no-cache');
    response.setHeader('Expires', 0);
    next();
};

module.exports = LocalUtil;
