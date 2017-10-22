'use strict';

var buster        = require('buster'),
    assert        = buster.assert,
    refute        = buster.refute,
    errorMsg      = 'Error sending UDP...',
    errorMsgThrow = 'PANG!';

delete require.cache[require.resolve('../../lib/local-util')];


var LocalUtil     = require('../../lib/local-util'),
    localUtil     = new LocalUtil({
        logger: {
            log: function () { },
            err: function () { }
        },
        config: {
            udp: {
                prefix: 'unittest',
                host: 'localhost',
                port: 9999
            }
        }
    });

var myArray = [
    { name: 'b', integer: 456 },
    { name: 'a', integer: 123 },
    { name: 'c', integer: 789 }
];
var myArrayDescInteger = [
    { name: 'c', integer: 789 },
    { name: 'b', integer: 456 },
    { name: 'a', integer: 123 }
];
var myArrayAscInteger = [
    { name: 'a', integer: 123 },
    { name: 'b', integer: 456 },
    { name: 'c', integer: 789 }
];
var myArrayDescName = [
    { name: 'c', integer: 789 },
    { name: 'b', integer: 456 },
    { name: 'a', integer: 123 }
];
var myArrayAscName = [
    { name: 'a', integer: 123 },
    { name: 'b', integer: 456 },
    { name: 'c', integer: 789 }
];

// var timer_result = {
//     'local-util-test': {
//         start: [ 221059, 879195203 ],
//         end: [ 0, 629624 ],
//         total: 0.000629624
//     }
// };

buster.testCase('lib/local-util', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test local-util:': {
        'sortByKey test': function () {
            var result = localUtil.sortByKey(myArray, 'integer');
            assert.equals(result, myArrayDescInteger);

            result = localUtil.sortByKey(myArray, 'integer').reverse();
            assert.equals(result, myArrayAscInteger);

            result = localUtil.sortByKey(myArray, 'name');
            assert.equals(result, myArrayDescName);

            result = localUtil.sortByKey(myArray, 'name').reverse();
            assert.equals(result, myArrayAscName);
        },

        'quoteUrl test': function () {
            var result = localUtil.quoteUrl('this is an url/with special chars & other ?');
            assert.equals(result, 'this%20is%20an%20url/with%20special%20chars%20&amp;%20other%20?');
            assert(true);
        },

        'quote_url w/no input': function () {
            var result = localUtil.quoteUrl();
            assert.equals(result, '');
        },

        // 'send_udp as plain message': function (done) {
        //     localUtil.sendUdp('my nice message', function (error, result) {
        //         assert.equals(result, 140);
        //         done();
        //     });
        // },
        //
        // 'send_udp as an object': function (done) {
        //     localUtil.sendUdp({message: 'my nice message'}, function (error, result) {
        //         assert.equals(result, 140);
        //         done();
        //     });
        // },
        //
        // 'send_udp and fail': function (done) {
        //     localUtil.sendUdp('error', function (error) {
        //         assert.equals(error, errorMsg);
        //         done();
        //     });
        // },
        //
        // 'send_udp and explode': function (done) {
        //     localUtil.sendUdp('explode', function (error) {
        //         assert.match(error, errorMsgThrow);
        //         done();
        //     });
        // },

        'safeString test': function () {
            var result = localUtil.safeString('If you\'re crazy enough to send in special chars ' +
                'like æøå?~!@#$%^&*())_-+=');
            assert.equals(result, 'if you re crazy enough to send in special chars like æøå              -');
        },

        'iso_date wo/input': function () {
            var result = localUtil.isoDate();
            // 2015-01-07T15:37:48.824+01:00
            assert.match(result, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2}/);
        },

        'iso_date w/epoch micro time as input': function () {
            var result = localUtil.isoDate(1410642022 * 1000);
            // 2014-09-13T23:00:22.000+02:00
            assert.match(result, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2}/);
            assert.match(result, /2014-09-13T\d{2}:00:22\.000\+\d{2}:00/);
        },

        'timer test': function () {
            localUtil.timer('local-util-test');
            for (var i = 0; i < 1e5; i++) {
                // just waiting a bit
                var j;
                j++;
            }
            localUtil.timer('local-util-test');
            var timers = localUtil.timersGet();
            assert.isObject(timers);
            assert.isObject(timers['local-util-test']);
            assert.isNumber(timers['local-util-test'].total);
            assert(true);
        },

        'timersReset test': function () {
            localUtil.timer('local-util-test');
            for (var i = 0; i < 1e5; i++) {
                // just waiting a bit
                var j;
                j++;
            }
            localUtil.timer('local-util-test');
            var timers = localUtil.timersGet();
            assert.isObject(timers);
            assert.isObject(timers['local-util-test']);
            assert.isNumber(timers['local-util-test'].total);
            localUtil.timersReset();
            var timersReset = localUtil.timersGet();
            assert.isObject(timersReset);
            refute.isObject(timersReset['local-util-test']);
            assert(true);
        }
    }
});
