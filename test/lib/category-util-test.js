'use strict';

var buster       = require('buster'),
    assert       = buster.assert,
    refute       = buster.refute,
    when         = require('when'),
    category_util = require('../../lib/category-util')({
        logger: {
            log: function () { },
            err: function () { }
        },
    });


buster.testCase('lib/category-util', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test category-util:': {
        'format_catlist': function () {
            assert(true);
        },


    }
});
