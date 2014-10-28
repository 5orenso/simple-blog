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

    }
});
