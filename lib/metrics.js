/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 <C3><98>istein S<C3><B8>rensen
 * Licensed under the MIT license.
 */
'use strict';

var StatsD    = require('node-dogstatsd').StatsD,
    dogstatsd = new StatsD(),
    Hook      = require('./hook'),
    myHook    = new Hook(),
    opts;

function Metrics(opt) {
    opts = opt || {};
}

Metrics.prototype.set = function set(key, value) {
    opts[key] = value;
    return true;
};

Metrics.prototype.get = function get(key) {
    return opts[key];
};

Metrics.prototype.hook = function hook(func, name) {
    var startTime,
        endTime,
        funcName = name || func.name;
    func = myHook.add(func, function () {
        startTime = Metrics.prototype.start();
        return startTime;
    }, function () {
        endTime = Metrics.prototype.timing(funcName, startTime);
        return endTime;
    });
    return func;
};
Metrics.prototype.hookMeta = function hookMeta() {
    return myHook.meta();
};

Metrics.prototype.start = function start() {
    return (new Date()).getTime();
};

Metrics.prototype.timing = function timing(metricName, startTime) {
    var timeInMillisec = (new Date()).getTime() - startTime;
    if (opts.useDataDog === true) {
        dogstatsd.timing(metricName, timeInMillisec);
    }
    //console.log('metrics.js:', metricName, timeInMillisec, 'ms');
    return timeInMillisec;
};

Metrics.prototype.increment = function increment(metricName) {
    if (opts.useDataDog === true) {
        dogstatsd.increment(metricName);
        return true;
    }
};

module.exports = Metrics;
