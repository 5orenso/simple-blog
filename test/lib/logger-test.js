'use strict';

var buster = require('buster'),
    assert = buster.assert,
    when   = require('when'),
    logger = require('../../lib/logger')({}, {
    logger: {
        log: function (type, msg, meta) {
            return {
                type: type,
                msg: msg,
                meta: meta
            };
        }
    }
});

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
        'log wo/meta': function (done) {
            when(logger.log('simple', 'blog', 'is', 'fun'))
                .done(function (obj) {
                    assert.equals(obj.type, log.type);
                    assert.match(obj.msg, log.msg);
                    done();
                });
        },
        'log w/meta': function (done) {
            when(logger.log('simple', {meta1: 'blog', meta2: 'is', meta3: 'fun' }, { meta4: 'yes it is!'}))
                .done(function (obj) {
//                    console.log(obj);
                    assert.equals(obj.type, logMeta.type);
                    assert.match(obj.msg, logMeta.msg);
                    assert.equals(obj.meta, logMeta.meta);
                    done();
                });
        },
        'err test': function (done) {
            when(logger.err('simple', 'blog', 'is', 'fun'))
                .done(function (obj) {
//                    console.log(obj);
                    assert.equals(obj.type, err.type);
                    assert.match(obj.msg, err.msg);
                    assert(true);
                    done();
                });
        },
        'err w/meta': function (done) {
            when(logger.err('simple', { meta1: 'blog', meta2: 'is', meta3: 'fun' }, {meta4: 'yes it is!'}))
                .done(function (obj) {
//                    console.log(obj);
                    assert.equals(obj.type, errMeta.type);
                    assert.match(obj.msg, errMeta.msg);
                    assert.equals(obj.meta, errMeta.meta);
                    done();
                });
        },
        'set/get': function () {
            assert(logger.set('simple', 'blog is fun'));
            assert.equals(logger.get('simple'), 'blog is fun');
        }

    }
});
