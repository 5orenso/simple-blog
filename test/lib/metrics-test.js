'use strict';

var buster  = require('buster'),
    assert  = buster.assert,
    Metrics = require('../../lib/metrics'),
    metrics  = new Metrics();

buster.testCase('lib/metrics', {
    setUp: function () {
        //this.timeout = 2000;
    },
    tearDown: function () {
    },
    'Test metrics:': {
        'set/get': function () {
            assert(metrics.set('simple', 'blog is fun'));
            assert.equals(metrics.get('simple'), 'blog is fun');
        },

        'add metric hooks to a sync function': function () {
            function syncFunc(input) {
                var j = 0;
                for (var i = 0; i < 1e8; i++) {
                    j++;
                }
                return input;
            }
            syncFunc = metrics.hook(syncFunc, 'syncFunc');  // jshint ignore:line
            var result = syncFunc('main');
            var hookMeta = metrics.hookMeta();
            console.log('metrics-test.result = ', result, hookMeta);
            assert.equals(result, 'main');
            assert.isNumber(hookMeta.pre);
            assert.isNumber(hookMeta.post);
            assert.near(hookMeta.post, 250, 250);
            assert.greater(hookMeta.pre, 1441000000000);
        }
        //
        //'add hooks to a async function': function (done) {
        //    function asyncFunc(input, callback) {
        //        setTimeout(function () {
        //            callback(input);
        //        }, 1000);
        //    }
        //    asyncFunc = hook.add(asyncFunc, function () { // jshint ignore:line
        //        return 'cb-pre';
        //    }, function () {
        //        return 'cb-post';
        //    });
        //    when(when.promise(function(resolve) {
        //        asyncFunc('cb-main', function (result) {
        //            resolve(result);
        //        });
        //    })).
        //        done(function (result) {
        //            var hookMeta = hook.meta();
        //            //console.log(' = hook-test.result = ', result, hookMeta);
        //            assert.equals(result, 'cb-main');
        //            assert.equals(hookMeta.pre, 'cb-pre');
        //            assert.equals(hookMeta.post, 'cb-post');
        //            done();
        //        });
        //}

    }
});
