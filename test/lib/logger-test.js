'use strict';

var buster = require('buster'),
    assert = buster.assert,
    when   = require('when'),
    sinon  = require('sinon');

var Logger = require('../../lib/logger'),
    logger = new Logger();

var log = {
    type: 'info',
    msg: /\d+ \[\d*\]: simple -> blog -> is -> fun/,
    meta: null
};
var logMeta = {
    type: 'info',
    msg: /\d+ \[\d*\]: simple -> \{"meta4":"yes it is!"\}/,
    meta: { meta1: 'blog', meta2: 'is', meta3: 'fun' }
};
var err = {
    type: 'error',
    msg: /\d+ \[\d*\]: simple -> blog -> is -> fun/,
    meta: null
};
var errMeta = {
    type: 'error',
    msg: /\d+ \[\d*\]: simple -> \{"meta4":"yes it is!"\}/,
    meta: { meta1: 'blog', meta2: 'is', meta3: 'fun' }
};
buster.testCase('lib/logger', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test logger:': {
        'log wo/meta': function () {
            assert(logger.log('simple', 'blog', 'is', 'fun'));
        },
        'err test': function () {
            assert(logger.err('simple', 'blog', 'is', 'fun'));
        },


    }
});
