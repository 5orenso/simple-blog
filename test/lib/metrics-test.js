'use strict';

var buster    = require('buster'),
    assert    = buster.assert,
    StatsD    = require('node-dogstatsd').StatsD,
    //dogstatsd = new StatsD(),
    sinon     = require('sinon'),
    Metrics   = require('../../lib/metrics'),
    metrics   = new Metrics({
        useDataDog: true
    });

sinon.stub(StatsD.prototype, 'timing', function (metricName, timeInMillisec) {
    console.log('stub called with: ', metricName, timeInMillisec);
});
//sinon.spy(dogstatsd, "timing");
sinon.stub(StatsD.prototype, 'increment', function (metricName) {
    console.log('stub called with: ', metricName);
});

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
            //console.log('metrics-test.result = ', result, hookMeta);
            assert.equals(result, 'main');
            assert.isNumber(hookMeta.pre);
            assert.isNumber(hookMeta.post);
            assert.near(hookMeta.post, 250, 250);
            assert.greater(hookMeta.pre, 1441000000000);
            console.log(sinon.assert.callCount(StatsD.prototype.timing, 1));
            //console.log(stub.callCount());
            //assert(dogstatsd.timing.calledWithMatch('syncFunc', ));
            //assert(dogstatsd.timing.called());
        },

        'call metrics increment': function () {
            assert(metrics.increment('my.metric'));
            console.log(sinon.assert.callCount(StatsD.prototype.increment, 1));
        }

    }
});
