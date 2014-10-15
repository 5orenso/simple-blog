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
    web_router = require(__dirname + '/../../../app/routes/web');

var content_path     = __dirname + '/../../content/articles/';

var config = require(__dirname + '/../../../config/config-dist.js');
web_router.set_config(config, {
    content_path: content_path,
    workerId: 1,
    stats: stats,
    activeConn: activeConn,
    timer: timer
});

var port = 4321;
var app = express();
app.use('/web', web_router);
var server;

var responses = {
    endpoints : {"message":"hooray! welcome to our api!"}
};



buster.testCase('app/routes/web', {
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
    'Test web routes:': {
        '/': function (done) {
            request('http://127.0.0.1:' + port + '/web/', function (error, response, body) {
                assert.equals(200, response.statusCode);
                done();
            });

        },

        '/this-should-not-be-found': function (done) {
            request('http://127.0.0.1:' + port + '/web/this-should-not-be-found', function (error, response, body) {
                assert.equals(404, response.statusCode);
                done();
            });

        },

        'simple-blog/index': function (done) {
            request('http://127.0.0.1:' + port + '/web/simple-blog/index', function (error, response, body) {
                assert.equals(200, response.statusCode);
                done();
            });

        },

        'simple-blog/': function (done) {
            request('http://127.0.0.1:' + port + '/web/simple-blog/', function (error, response, body) {
                assert.equals(200, response.statusCode);
                done();
            });

        }


    }
});