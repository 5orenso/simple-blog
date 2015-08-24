'use strict';

var buster = require('buster'),
    assert = buster.assert,
    Plugin = require('../../../lib/plugins/strava'),
    plugin = new Plugin();

buster.testCase('lib/plugins/strava', {
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
            var inputStr = 'See my map https://www.strava.com/segments/1942901';
            var result = inputStr.replace(plugin.get('regexp'), plugin.replacer);
            var regexp = new RegExp('<div class="videoWrapper"><iframe width="560" height="349" src="https://www.strava.com/segments/1942901/embed" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>');
            assert.match(result, regexp);
        }
        // jscs:enable

    }
});
