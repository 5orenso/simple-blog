'use strict';

var buster = require('buster'),
    assert = buster.assert,
    Plugin = require('../../../lib/plugins/youtube'),
    plugin = new Plugin();

buster.testCase('lib/plugins/youtube', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test plugin flot:': {
        'set/get': function () {
            assert(plugin.set('simple', 'blog is fun'));
            assert.equals(plugin.get('simple'), 'blog is fun');
        },
        // jscs:disable
        'replacer mode=search': function () {
            var inputStr = 'See my map https://www.youtube.com/watch?v=lJNu4k20sFE';
            var result = inputStr.replace(plugin.get('regexp'), plugin.replacer);
            var regexp = new RegExp('<div class="videoWrapper"><iframe height="500" src="https://www.youtube.com/embed/lJNu4k20sFE" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>');
            assert.match(result, regexp);
        }
        // jscs:enable

    }
});
