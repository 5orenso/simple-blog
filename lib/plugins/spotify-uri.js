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
            // spotify:user:jarlelk:playlist:1HjpdqHWIZCAsod0RBvjFX
            // spotify:track:0qRXZNsoVdU9xXJIFqQkCQ
            regexp: /[\s\t\n]+(spotify:[a-z0-9:]+)/gi
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
MyPlugin.prototype.replacer = function replacer(match, p1) { // jshint ignore:line
    //console.log(p1, p2);
    return '<div class="videoWrapper"><iframe width="560" height="349" src="https://embed.spotify.com/?uri=' + encodeURIComponent(p1) + '" ' +
        'webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>';
};
// jscs:enable

module.exports = MyPlugin;
