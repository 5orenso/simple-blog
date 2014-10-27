'use strict';

var buster       = require('buster'),
    assert       = buster.assert,
    refute       = buster.refute,
    when         = require('when'),
    category     = require('../../lib/local-util')({
        logger: {
            log: function () { },
            err: function () { }
        },
    });


buster.testCase('lib/local-util', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test local-util:': {
        'sortByKey': function () {
            assert(true);
        },

        'quote_url': function () {
            assert(true);
        },

    }
});
