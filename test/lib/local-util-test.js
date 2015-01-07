'use strict';

var buster       = require('buster'),
    assert       = buster.assert,
    refute       = buster.refute,
    when         = require('when'),
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
                callback(null, 140);
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
            local_util.send_udp('my nice message', function (result) {
                assert.equals(result, 140);
                done();
            });
        },

        'send_udp as an object': function (done) {
            local_util.send_udp({message: 'my nice message'}, function (result) {
                assert.equals(result, 140);
                done();
            });
        },

        'safe_string': function () {
            var result = local_util.safe_string('If you\'re crazy enough to send in special chars like æøå?~!@#$%^&*())_-+=');
            assert.equals(result, 'if you re crazy enough to send in special chars like æøå');
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
            assert.match(result, '2014-09-13T23:00:22.000+02:00');
        },

    }
});
