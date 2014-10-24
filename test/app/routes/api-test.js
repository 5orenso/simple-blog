'use strict';

var buster     = require('buster'),
    assert     = buster.assert,
    refute     = buster.refute,
    when       = require('when'),
    fs         = require('fs'),
    express    = require('express'),
    request    = require('request'),
    stats      = {
        meter: function () {
            return {
                mark: function () {}
            };
        }
    },
    activeConn = {
        inc: function () {},
        dec: function () {}
    },
    timer      = {
        start: function () {
            return {
                end: function () {}
            };
        }
    },
    api_router = require(__dirname + '/../../../app/routes/api');
var content_path     = __dirname + '/../../content/articles/';


var config = require(__dirname + '/../../../config/config-integration.js');
api_router.set_config(config, {
    content_path: content_path,
    workerId: 1,
    stats: stats,
    activeConn: activeConn,
    timer: timer
});

var port = 4321;
var app = express();
app.use('/api', api_router);
var server;

var responses = {
    endpoints : {"message":"hooray! welcome to our api!"}
};



buster.testCase('app/routes/api', {
    setUp: function () {
        // TODO: Start webserver and use routes.
//        console.log('web: setup');
        this.timeout = 2000;
        server = app.listen(port);
    },
    tearDown: function (done) {
//        console.log('web: tearDown');
        // TODO: Shutdown webserver.
        server.close(function() {
            done();
        });
    },
    'Test api routes:': {
        '/api/': function (done) {
            request('http://127.0.0.1:' + port + '/api/', function (error, response, body) {
                assert.equals(200, response.statusCode);
                done();
            });

        },

        '/api/this-should-not-be-found': function (done) {
            request('http://127.0.0.1:' + port + '/api/this-should-not-be-found', function (error, response, body) {
                assert.equals(404, response.statusCode);
                done();
            });

        },


    }
});