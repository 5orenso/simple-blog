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
            var regexp = new RegExp('https://www.strava.com/segments/1942901/embed');
            assert.match(result, regexp);
            assert.match(result, /<div class="videoWrapper">/i);
            assert.match(result, /<iframe width="560" height="349"/i);
            assert.match(result, /webkitallowfullscreen mozallowfullscreen allowfullscreen/i);
            assert.match(result, /<\/iframe>/i);
            assert.match(result, /<\/div>/i);
        }
        // jscs:enable

    }
});
