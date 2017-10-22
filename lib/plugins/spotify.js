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
        // https://open.spotify.com/user/jarlelk/playlist/1HjpdqHWIZCAsod0RBvjFX
        // https://open.spotify.com/track/0qRXZNsoVdU9xXJIFqQkCQ
        regexp: /[\s\t\n]+https*:\/\/(open\.)*spotify\.com\/([^&\s]+)/gi,
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
    // console.log(p1, p2);
    const spotifyUri = p2.replace(/\//g, ':');
    return `<div class="videoWrapper"><iframe width="560" height="349"
        src="https://embed.spotify.com/?uri=spotify%3A${encodeURIComponent(spotifyUri)}"
        webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>`;
};

module.exports = MyPlugin;
