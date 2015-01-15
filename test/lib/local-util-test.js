'use strict';

var buster       = require('buster'),
    assert       = buster.assert,
    refute       = buster.refute,
    when         = require('when'),
    error_msg    = 'Error sending UDP...',
    error_msg_throw = 'PANG!',
    local_util   = require('../../lib/local-util')({
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
    }, {
        udp_client: {
            send: function (message, something, message_length, udp_port, udp_server, callback) {
                var message_text = message.toString('utf8');
                if (message_text.match(/error/)) {
                    callback(error_msg, null);
                } else if (message_text.match(/explode/)) {
                    throw new Error(error_msg_throw);
                } else {
                    callback(null, 140);
                }
            }
        }
    });

var my_array = [
    { name: 'b', integer: 456 },
    { name: 'a', integer: 123 },
    { name: 'c', integer: 789 },
];
var my_array_desc_integer = [
    { name: 'c', integer: 789 },
    { name: 'b', integer: 456 },
    { name: 'a', integer: 123 },
];
var my_array_asc_integer = [
    { name: 'a', integer: 123 },
    { name: 'b', integer: 456 },
    { name: 'c', integer: 789 },
];
var my_array_desc_name = [
    { name: 'c', integer: 789 },
    { name: 'b', integer: 456 },
    { name: 'a', integer: 123 },
];
var my_array_asc_name = [
    { name: 'a', integer: 123 },
    { name: 'b', integer: 456 },
    { name: 'c', integer: 789 },
];

var timer_result = {
    'local-util-test': {
        start: [ 221059, 879195203 ],
        end: [ 0, 629624 ],
        total: 0.000629624
    }
};


buster.testCase('lib/local-util', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test local-util:': {
        'sortByKey': function () {
            var result = local_util.sortByKey(my_array, 'integer');
            assert.equals(result, my_array_desc_integer);

            result = local_util.sortByKey(my_array, 'integer').reverse();
            assert.equals(result, my_array_asc_integer);

            result = local_util.sortByKey(my_array, 'name');
            assert.equals(result, my_array_desc_name);

            result = local_util.sortByKey(my_array, 'name').reverse();
            assert.equals(result, my_array_asc_name);
        },

        'quote_url': function () {
            var result = local_util.quote_url('this is an url/with special chars & other ?');
            assert.equals(result, 'this%20is%20an%20url/with%20special%20chars%20&amp;%20other%20?');
            assert(true);
        },

        'quote_url w/no input': function () {
            var result = local_util.quote_url();
            assert.equals(result, '');
        },

        'send_udp as plain message': function (done) {
            local_util.send_udp('my nice message', function (error, result) {
                assert.equals(result, 140);
                done();
            });
        },

        'send_udp as an object': function (done) {
            local_util.send_udp({message: 'my nice message'}, function (error, result) {
                assert.equals(result, 140);
                done();
            });
        },

        'send_udp and fail': function (done) {
            local_util.send_udp('error', function (error, result) {
                assert.equals(error, error_msg);
                done();
            });
        },

        'send_udp and explode': function (done) {
            local_util.send_udp('explode', function (error, result) {
                assert.match(error, error_msg_throw);
                done();
            });
        },

        'safe_string': function () {
            var result = local_util.safe_string('If you\'re crazy enough to send in special chars like æøå?~!@#$%^&*())_-+=');
            assert.equals(result, 'if you re crazy enough to send in special chars like æøå              -');
        },

        'iso_date wo/input': function () {
            var result = local_util.iso_date();
            // 2015-01-07T15:37:48.824+01:00
            assert.match(result, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2}/);
        },

        'iso_date w/epoch micro time as input': function () {
            var result = local_util.iso_date(1410642022 * 1000);
            // 2014-09-13T23:00:22.000+02:00
            assert.match(result, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2}/);
            assert.match(result, /2014-09-13T\d{2}:00:22\.000\+\d{2}:00/);
        },

        'timer': function () {
            local_util.timer('local-util-test');
            for (var i=0; i<1e5; i++) {
                // just waiting a bit
                var j;
            }
            local_util.timer('local-util-test');
            var timers = local_util.timers_get();
            assert.isObject(timers);
            assert.isObject(timers['local-util-test']);
            assert.isNumber(timers['local-util-test'].total);
            assert(true);
        },

        'timers_reset': function () {
            local_util.timer('local-util-test');
            for (var i=0; i<1e5; i++) {
                // just waiting a bit
                var j;
            }
            local_util.timer('local-util-test');
            var timers = local_util.timers_get();
            assert.isObject(timers);
            assert.isObject(timers['local-util-test']);
            assert.isNumber(timers['local-util-test'].total);
            local_util.timers_reset();
            var timers_reset = local_util.timers_get();
            assert.isObject(timers_reset);
            refute.isObject(timers_reset['local-util-test']);
            assert(true);
        },





    }
});
