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
        // https://gist.github.com/5orenso/e1168688570e589d38f8
        regexp: /[\s\t\n]+(https*:\/\/gist\.github\.com\/[^&\s.]+)/gi,
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
    // console.log(p1, p2, p3, p4);
    // <script src="https://gist.github.com/5orenso/e1168688570e589d38f8.js"></script>
    return `<script src="${p1}.js"></script>`;
};
// jscs:enable

module.exports = MyPlugin;
