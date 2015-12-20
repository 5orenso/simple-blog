/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var when     = require('when'),
    winston  = require('winston'),
    syslog   = require('winston-syslog').Syslog, // jshint ignore:line
    _        = require('underscore'),
    hostname = require('os').hostname();

winston.add(winston.transports.Syslog, {
    facility: 'UDPlogger',
    appName: 'UDPlogger',
    localhost: hostname
});
//host: '127.0.0.1', // The host running syslogd, defaults to localhost.
//port: 514,         // The port on the host that syslog is running on, defaults to syslogd's default port.
//protocol: 'udp4',  // The network protocol to log over (e.g. tcp4, udp4, etc).
// pid: PID of the process that log messages are coming from (Default process.pid).
// facility: Syslog facility to use (Default: local0).
// localhost: Host to indicate that log messages are coming from (Default: localhost).
// type: The type of the syslog protocol to use (Default: BSD).
// appName: The name of the application (Default: process.title).

winston.setLevels(winston.config.syslog.levels);

function Logger(opt) {
    this.opts = opt || {};
}

Logger.prototype.log = function () {
    var level = 'info';
    if (_.isObject(this.opts) && _.isObject(this.opts.log)) {
        if (_.isString(this.opts.log.level)) {
            level = this.opts.log.level;
        }
        if (!this.opts.log.console) {
            winston.remove(winston.transports.Console);
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
    return when.promise(function (resolve) {
        //console.log(level, Logger.prototype.isoDate() + ' [' + (opts.workerId || '') + ']' + ': ' +
        //msg.join(' -> '), meta);
        resolve(winston.log(level, Logger.prototype.isoDate() + ' [' + (opts.workerId || '') + ']' + ': ' +
            msg.join(' -> '), meta));
    });
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
    return when.promise(function (resolve) {
        resolve(winston.log('error', Logger.prototype.isoDate() + ' [' + (opts.workerId || '') + ']' + ': ' +
            msg.join(' -> '), meta));
        // TODO: Should handle errors.
    });
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
