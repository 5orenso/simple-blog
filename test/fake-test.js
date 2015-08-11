'use strict';

var buster = require('buster');
var assert = buster.assert;

buster.testCase('Fake test.', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'My tests:': {
        'This is true': function () {
            assert(true);
        }
    }
});
