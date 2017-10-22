/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

let opts;

function MyPlugin(opt) {
    opts = opt || {
        // https://www.strava.com/segments/1942901
        regexp: /[\s\t\n]+https*:\/\/(www\.)*strava\.com(\/segments\/[^&\s]+)/gi,
    };
}

MyPlugin.prototype.set = function set(key, value) {
    opts[key] = value;
    return true;
};

MyPlugin.prototype.get = function get(key) {
    return opts[key];
};

MyPlugin.prototype.replacer = function replacer(match, p1, p2) {
    // console.log(p1, p2, p3, p4);
    return `<div class="videoWrapper"><iframe width="560" height="349" src="https://www.strava.com${p2}/embed"
        webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>`;
};

module.exports = MyPlugin;
