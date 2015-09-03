'use strict';

var buster = require('buster'),
    assert = buster.assert,
    when   = require('when'),
    Hook   = require('../../lib/hook'),
    hook   = new Hook();

buster.testCase('lib/hook', {
    setUp: function () {
        this.timeout = 2000;
    },
    tearDown: function () {
    },
    'Test hook:': {
        //'set/get': function () {
        //    assert(hook.set('simple', 'blog is fun'));
        //    assert.equals(hook.get('simple'), 'blog is fun');
        //},

        'add hooks to a sync function': function () {
            function syncFunc(input) {
                return input;
            }
            syncFunc = hook.add(syncFunc, function () { // jshint ignore:line
                return 'pre';
            }, function () {
                return 'post';
            });
            var result = syncFunc('main');
            var hookMeta = hook.meta();
            //console.log('hook-test.result = ', result, hookMeta);
            assert.equals(result, 'main');
            assert.equals(hookMeta.pre, 'pre');
            assert.equals(hookMeta.post, 'post');
        },

        'add hooks to a async function': function (done) {
            function asyncFunc(input, callback) {
                setTimeout(function () {
                    callback(input);
                }, 1000);
            }
            asyncFunc = hook.add(asyncFunc, function () { // jshint ignore:line
                return 'cb-pre';
            }, function () {
                return 'cb-post';
            });
            when(when.promise(function(resolve) {
                asyncFunc('cb-main', function (result) {
                    resolve(result);
                });
            })).
            done(function (result) {
                    var hookMeta = hook.meta();
                    //console.log(' = hook-test.result = ', result, hookMeta);
                    assert.equals(result, 'cb-main');
                    assert.equals(hookMeta.pre, 'cb-pre');
                    assert.equals(hookMeta.post, 'cb-post');
                    done();
                });
        },

        'add hooks to a sync function and alter input': function () {
            function syncFunc(input) {
                input.bar = 'foobar';
                //console.log(input);
            }
            syncFunc = hook.add(syncFunc, function (inputRef) { // jshint ignore:line
                inputRef.foo = 'gomle';
            });
            var input = { foo: 'bar' };
            syncFunc(input);
            //console.log('hook-test.result = ', result, hookMeta);
            assert.equals(input.foo, 'gomle');
            assert.equals(input.bar, 'foobar');
        }

    }
});
