'use strict';

var buster     = require('buster'),
    assert     = buster.assert,
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
    apiRouter = require(__dirname + '/../../../app/routes/api');

var config = require(__dirname + '/../../../config/config-integration.js');
apiRouter.setConfig(config, {
    workerId: 1,
    stats: stats,
    activeConn: activeConn,
    timer: timer
});

var port = 4321;
var app = express();
app.use('/api', apiRouter);
var server;

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
            request('http://127.0.0.1:' + port + '/api/', function (error, response) {
                assert.equals(response.statusCode, 200);
                done();
            });

        },

        '/api/this-should-not-be-found': function (done) {
            request('http://127.0.0.1:' + port + '/api/this-should-not-be-found', function (error, response) {
                assert.equals(response.statusCode, 404);
                done();
            });

        }
        // TODO: Write a /report test with post.

    }
});
