'use strict';

var buster = require('buster'),
    assert = buster.assert,
    Plugin = require('../../../lib/plugins/github-gist'),
    plugin = new Plugin();

buster.testCase('lib/plugins/github-gist', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test plugin github-gist:': {
        'set/get': function () {
            assert(plugin.set('simple', 'blog is fun'));
            assert.equals(plugin.get('simple'), 'blog is fun');
        },
        // jscs:disable
        'replacer mode=search': function () {
            var inputStr = 'See my map https://gist.github.com/5orenso/e1168688570e589d38f8';
            var result = inputStr.replace(plugin.get('regexp'), plugin.replacer);
            //console.log(result);
            var regexp = new RegExp('<script src="https://gist.github.com/5orenso/e1168688570e589d38f8.js"></script>');
            assert.match(result, regexp);
        }
        // jscs:enable

    }
});
