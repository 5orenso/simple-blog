/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var opts;

function MyPlugin(opt) {
    opts = opt || {
            // https://www.strava.com/segments/1942901
            regexp: /https*:\/\/(www\.)*strava\.com(\/segments\/[^&\s]+)/gi
        };
}

MyPlugin.prototype.set = function set(key, value) {
    opts[key] = value;
    return true;
};

MyPlugin.prototype.get = function get(key) {
    return opts[key];
};

// jscs:disable
MyPlugin.prototype.replacer = function replacer(match, p1, p2, p3, p4) { // jshint ignore:line
    //console.log(p1, p2, p3, p4);
    return '<div class="videoWrapper"><iframe width="560" height="349" src="https://www.strava.com' + p2 + '/embed" ' +
        'webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>';
};
// jscs:enable

module.exports = MyPlugin;
// <iframe src="https://player.vimeo.com/video/132249165" width="560" height="349" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
