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
            //         preg_match('/.*?v=(.+?)($|&)/i', $matches[2], $m);
            // https://www.youtube.com/watch?v=lJNu4k20sFE
            regexp: /[\s\t\n]+https*:\/\/(www\.)*vimeo\.com\/(.*?([^&\s]+)(&[^\s]+)*)/gi
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
    return '<div class="videoWrapper"><iframe width="560" height="349" src="https://player.vimeo.com/video/' + p3 + '" ' +
        'webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>';
};
// jscs:enable

module.exports = MyPlugin;
// <iframe src="https://player.vimeo.com/video/132249165" width="560" height="349" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
