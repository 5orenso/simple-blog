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
            var regexp = new RegExp('<iframe src=".+?www.google.com\/maps\/embed\/v1\/' +
                'search\\?key=.+?&' +
                'zoom=10&q=69.9396%2C22.9232' +
                '" width="100%" height="400" frameborder="0" style="border:0" allowfullscreen><\/iframe>');
            assert.match(result, regexp);
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
            var regexp = new RegExp('<iframe src=".+?www.google.com\/maps\/embed\/v1\/' +
                'search\\?key=.+?&' +
                'zoom=10&q=69.9396%2C22.9232' +
                '" width="100%" height="400" frameborder="0" style="border:0" allowfullscreen><\/iframe>');
            assert.match(result, regexp);
        },

        'replacer mode=streetview': function () {
            var inputStr = 'See my map ' + "\n" +
                '@69.9396,22.9232;mode=streetview&heading=90&pitch=-15';
            var result = inputStr.replace(plugin.get('regexp'), plugin.replacer);
//            console.log(result);
            var regexp = new RegExp('<iframe src=".+?www.google.com\/maps\/embed\/v1\/' +
                'streetview\\?key=.+?&' +
                'heading=90&pitch=-15&location=69.9396%2C22.9232' +
                '" width="100%" height="400" frameborder="0" style="border:0" allowfullscreen><\/iframe>');
            assert.match(result, regexp);
        },

        'replacer mode=view': function () {
            var inputStr = 'See my map ' + "\n" +
                '@69.9396,22.9232;mode=view';
            var result = inputStr.replace(plugin.get('regexp'), plugin.replacer);
//            console.log(result);
            var regexp = new RegExp('<iframe src=".+?www.google.com\/maps\/embed\/v1\/' +
                'view\\?key=.+?&' +
                'zoom=10&center=69.9396%2C22.9232' +
                '" width="100%" height="400" frameborder="0" style="border:0" allowfullscreen><\/iframe>');
            assert.match(result, regexp);
        },

        'replacer mode=directions': function () {
            var inputStr = 'See my map ' + "\n" +
                '@69.9396,22.9232;mode=directions&origin=oslo,norway&destination=telemark,norway&avoid=tolls|highways';
            var result = inputStr.replace(plugin.get('regexp'), plugin.replacer);
//            console.log(result);
            var regexp = new RegExp('<iframe src=".+?www.google.com\/maps\/embed\/v1\/' +
                'directions\\?key=.+?&' +
                'origin=oslo%2Cnorway&destination=telemark%2Cnorway&avoid=tolls%7Chighways' +
                '" width="100%" height="400" frameborder="0" style="border:0" allowfullscreen><\/iframe>');
            assert.match(result, regexp);
        },

        'replacer mode=directions and missing parameter': function () {
            var inputStr = 'See my map ' + "\n" +
                '@69.9396,22.9232;mode=directions&origin=oslo,norway&avoid=tolls|highways';
            var result = inputStr.replace(plugin.get('regexp'), plugin.replacer);
//            console.log(result);
            var regexp = new RegExp('<div><strong>ERROR with googleMaps plugin! ` @69.9396,22.9232;10;mode=directions&origin=oslo,norway&avoid=tolls|highways` <br>Error: Missing parameters:</strong><ul><li>destination: <pre><code class="hljs">');
            assert.match(result, regexp);
        }


        // jscs:enable

    }
});
