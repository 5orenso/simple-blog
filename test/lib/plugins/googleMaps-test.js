'use strict';

var buster = require('buster'),
    assert = buster.assert,
    Plugin = require('../../../lib/plugins/googleMaps'),
    plugin = new Plugin();

buster.testCase('lib/plugins/googleMaps', {
    setUp: function () {
    },
    tearDown: function () {
    },
    'Test plugin googleMaps:': {
        'set/get': function () {
            assert(plugin.set('simple', 'blog is fun'));
            assert.equals(plugin.get('simple'), 'blog is fun');
        },
        // jscs:disable
        'replacer mode=search': function () {
            var inputStr = 'See my map @69.9396,22.9232';
            var result = inputStr.replace(plugin.get('regexp'), plugin.replacer);
            assert.match(result, /<iframe/i);
            assert.match(result, /src=".+?www.google.com\/maps\/embed\/v1\//i);
            assert.match(result, /search\?key=.+?&/i);
            assert.match(result, /zoom=10&q=69.9396%2C22.9232/);
        },

        'replacer mode=search only position': function () {
            var inputStr = '@69.9396,22.9232';
            var result = inputStr.replace(plugin.get('regexp'), plugin.replacer);
            assert.equals(result, inputStr);
        },

        'replacer mode=search on new line': function () {
            var inputStr = 'See my map ' + "\n" +
                '@69.9396,22.9232';
            var result = inputStr.replace(plugin.get('regexp'), plugin.replacer);
            //            console.log(result);
            assert.match(result, /<iframe/i);
            assert.match(result, /src=".+?www.google.com\/maps\/embed\/v1\//i);
            assert.match(result, /search\?key=.+?&/i);
            assert.match(result, /zoom=10&q=69.9396%2C22.9232/);
        },

        'replacer mode=streetview': function () {
            var inputStr = 'See my map ' + "\n" +
                '@69.9396,22.9232;mode=streetview&heading=90&pitch=-15';
            var result = inputStr.replace(plugin.get('regexp'), plugin.replacer);
            assert.match(result, /<iframe/i);
            assert.match(result, /src=".+?www.google.com\/maps\/embed\/v1\//i);
            assert.match(result, /streetview\?key=.+?&/i);
            assert.match(result, /heading=90&pitch=-15&location=69.9396%2C22.9232/);
        },

        'replacer mode=view': function () {
            var inputStr = 'See my map ' + "\n" +
                '@69.9396,22.9232;mode=view';
            var result = inputStr.replace(plugin.get('regexp'), plugin.replacer);
            // console.log(result);
            assert.match(result, /<iframe/i);
            assert.match(result, /src=".+?www.google.com\/maps\/embed\/v1\//i);
            assert.match(result, /view\?key=.+?&/i);
            assert.match(result, /zoom=10/);
            assert.match(result, /center=69.9396%2C22.9232/i);
        },

        'replacer mode=view w/help': function () {
            var inputStr = 'See my map ' + "\n" +
                '@69.9396,22.9232;mode=view&help=1';
            var result = inputStr.replace(plugin.get('regexp'), plugin.replacer);
            //            console.log(result);
            assert.match(result, /<iframe/i);
            assert.match(result, /src=".+?www.google.com\/maps\/embed\/v1\//i);
            assert.match(result, /view\?key=.+?&/i);
            assert.match(result, /zoom=10/);
            assert.match(result, /center=69.9396%2C22.9232/i);
        },

        'replacer mode=directions': function () {
            var inputStr = 'See my map ' + "\n" +
                '@oslo,norway;mode=directions&origin=oslo,norway&destination=telemark,norway&avoid=tolls|highways';
            var result = inputStr.replace(plugin.get('regexp'), plugin.replacer);
            //            console.log(result);
            assert.match(result, /<iframe/i);
            assert.match(result, /src=".+?www.google.com\/maps\/embed\/v1\//i);
            assert.match(result, /directions\?key=.+?&/i);
            assert.match(result, /origin=oslo%2Cnorway&destination=telemark%2Cnorway&avoid=tolls%7Chighways/);
        },

        'replacer mode=directions and missing parameter': function () {
            var inputStr = 'See my map ' + "\n" +
                '@69.9396,22.9232;mode=directions&origin=oslo,norway&avoid=tolls|highways';
            var result = inputStr.replace(plugin.get('regexp'), plugin.replacer);
            assert.match(result, /<div/i);
            assert.match(result, /<li>destination:/i);
            assert.match(result, /<code class="hljs">/i);
            assert.match(result, /@69.9396,22.9232;10;mode=directions&origin=oslo,norway&avoid=tolls|highways/i);
            assert.match(result, /ERROR with googleMaps plugin!/i);
        }


        // jscs:enable

    }
});
