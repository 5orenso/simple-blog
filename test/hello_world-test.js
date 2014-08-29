'use strict';

var buster = require('buster');
var assert = buster.assert;
var refute = buster.refute;
var when = require('when');

var path = __dirname + '/../',
    helloWorld = require(path + 'app/hello_world.js'),
    hello = helloWorld({ port : 9999 });

buster.testCase('Testing hello_world module.', {
    setUp: function() {
    },

    'Checking some functionality:': {
        'Starting server, fetching data, calculating and shutting down.': function(is_done) {
            when(hello.say())
                .then( function (valueFromSay) {
                    assert.equals(valueFromSay, 150);
                    console.log(valueFromSay);
                })
                .then(hello.bye)
                .done(function () {
                    is_done();
                });
        }
    }
});

