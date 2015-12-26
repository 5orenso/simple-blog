/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2015 <C3><98>istein S<C3><B8>rensen
 * Licensed under the MIT license.
 */
'use strict';

var _    = require('underscore'),
    when = require('when'),
    hookMeta = {};

function Hook(opt) {
    this.opts = opt || {};
}

Hook.prototype.meta = function meta() {
    return hookMeta;
};

Hook.prototype.add = function add(funcRef, preHook, postHook) {
    if (funcRef.name === 'hookFunctionWrapper') {
        //console.log('Already wrapped!');
        return funcRef;
    }
    var defaultFunc = funcRef;
    funcRef = function hookFunctionWrapper() {
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
            // Is it a thenable promise?
            if (_.isObject(results) && _.isFunction(results.then)) {
                // It seems like it. Return a promise to the caller.
                return when.promise(function(resolve, reject) {
                    when(results)
                        .done(function (result) {
                            hookMeta.post = postHook.apply(this, args);
                            resolve(result);
                    }, function (result) {
                            reject(result);
                        });
                });
            } else {
                hookMeta.post = postHook.apply(this, args);
                return results;
            }
        }
    };
    return funcRef;
};

module.exports = Hook;
