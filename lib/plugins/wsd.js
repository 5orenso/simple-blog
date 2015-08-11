/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var _    = require('underscore'),
    opts;

function MyPlugin(opt, mockServices) {
    opts = opt || {
        regexp: /```wsd\s+([\s\S]+?)```/g
    };
    mockServices = mockServices || {};
}

MyPlugin.prototype.set = function set(key, value) {
    opts[key] = value;
    return true;
};

MyPlugin.prototype.get = function get(key) {
    return opts[key];
};

MyPlugin.prototype.replacer = function replacer(match, p1) {
    return '<img src="/pho/wsd/?data=' + encodeURIComponent(p1) + '">';
};

module.exports = MyPlugin;
