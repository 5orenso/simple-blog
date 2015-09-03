/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 <C3><98>istein S<C3><B8>rensen
 * Licensed under the MIT license.
 */
'use strict';

var _ = require('underscore'),
    opts,
    hookMeta = {};

function Hook(opt) {
    opts = opt || {};
}

Hook.prototype.meta = function meta() {
    return hookMeta;
};

// function replace(ref) {
//     ref = {};           // this code does _not_ affect the object passed
// }
// function update(ref) {
//     ref.key = 'newvalue';  // this code _does_ affect the _contents_ of the object
// }
// var a = { key: 'value' };
// replace(a);  // a still has its original value - it's unmodfied
// update(a);   // the _contents_ of 'a' are changed
Hook.prototype.add = function add(funcRef, preHook, postHook) {
    var defaultFunc = funcRef;
    funcRef = function () {
        var args = [],
            results;
        for (var i = 0, l = arguments.length; i < l; i++) {
            args.push(arguments[i]);
        }
        var lastElement = args.length - 1;
        if (_.isFunction(args[lastElement])) {
            args[lastElement] = Hook.prototype.add(args[lastElement], undefined, postHook);
        }
        if (_.isFunction(preHook)) {
            hookMeta.pre = preHook.apply(this, args);
        }
        results = defaultFunc.apply(this, args);
        if (_.isFunction(postHook) && !_.isFunction(args[lastElement])) {
            hookMeta.post = postHook.apply(this, args);
            return results;
        }
    };
    return funcRef;
};

module.exports = Hook;
