'use strict';

var buster    = require('buster'),
    assert    = buster.assert,
    StatsD    = require('node-dogstatsd').StatsD,
    //dogstatsd = new StatsD(),
    sinon     = require('sinon'),
    when      = require('when'),
    Metrics   = require('../../lib/metrics'),
    metrics   = new Metrics({
        useDataDog: true
    });

sinon.stub(StatsD.prototype, 'timing', function (metricName, timeInMillisec) {
    //console.log('stub called with: ', metricName, timeInMillisec);
    metricName = timeInMillisec;
});
//sinon.spy(dogstatsd, "timing");
sinon.stub(StatsD.prototype, 'increment', function (metricName) {
    //console.log('stub called with: ', metricName);
    metricName = '';
});

buster.testCase('lib/metrics', {
    setUp: function () {
        this.timeout = 5000;
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
            //console.log('metrics-test.result = ', result, hookMeta);
            assert.equals(result, 'main');
            assert.isNumber(hookMeta.pre);
            assert.isNumber(hookMeta.post);
            assert.near(hookMeta.post, 250, 250);
            assert.greater(hookMeta.pre, 1441000000000);
            //console.log(sinon.assert.called(StatsD.prototype.timing, 1));
            sinon.assert.called(StatsD.prototype.timing, 1);
            //console.log(stub.callCount());
            //assert(dogstatsd.timing.calledWithMatch('syncFunc', ));
            //assert(dogstatsd.timing.called());
        },

        'add metric hooks to a async function': function (done) {
            function asyncFunc(input, callback) {
                setTimeout(function () {
                    callback(input);
                }, 100);
            }
            asyncFunc = metrics.hook(asyncFunc, 'asyncFunc');  // jshint ignore:line
            when(when.promise(function(resolve) {
                asyncFunc('cb-main', function (result) {
                    resolve(result);
                });
            })).
                done(function (result) {
                    var hookMeta = metrics.hookMeta();
                    //console.log(' = metrics-async-test.result = ', result, hookMeta);
                    assert.equals(result, 'cb-main');
                    assert.greater(hookMeta.pre, 1441000000000);
                    assert.near(hookMeta.post, 100, 50);
                    done();
                });
        },

        'add metric hooks to a promise function': function (done) {
            function promiseFunc(input) {
                //console.log('promise-start...' + (new Date()).getTime());
                return when.promise(function(resolve) {
                    setTimeout(function () {
                        var inputObject = input;
                        //inputObject.bar = 'foobar';
                        //console.log('promise-done...' + (new Date()).getTime());
                        resolve(inputObject);
                    }, 100);
                });
            }
            promiseFunc = metrics.hook(promiseFunc, 'promiseFunc');  // jshint ignore:line
            //console.log(promiseFunc.toString());
            when(promiseFunc('cb-main')).
                done(function (result) {
                    var hookMeta = metrics.hookMeta();
                    //console.log(' = metrics-promise-test.result = ', result, hookMeta);
                    assert.equals(result, 'cb-main');
                    assert.greater(hookMeta.pre, 1441000000000);
                    assert.near(hookMeta.post, 100, 50);
                    done();
                });
        },

        'call metrics increment': function () {
            assert(metrics.increment('my.metric'));
            //console.log(sinon.assert.callCount(StatsD.prototype.increment, 1));
            sinon.assert.called(StatsD.prototype.increment);
        }

    }
});
