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
        },
        toJSON: function () {}
    },
    activeConn = {
        inc: function () {},
        dec: function () {},
        toJSON: function () {}
    },
    timer      = {
        start: function () {
            return {
                end: function () {}
            };
        },
        toJSON: function () {}
    },
    gauge      = {
        toJSON: function () {}
    },
    statsRouter = require(__dirname + '/../../../app/routes/stats');

var config = require(__dirname + '/../../../config/config-dist.js');
statsRouter.setConfig(config, {
    workerId: 1,
    stats: stats,
    activeConn: activeConn,
    timer: 1,
    timerWeb: timer,
    timerApi: timer,
    timerImage: timer,
    gauge: gauge
});

var port = 4321;
var app = express();
app.use('/api', statsRouter);
var server;

buster.testCase('stats', {
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
    'Test stats routes:': {
        '/stats': function (done) {
            request('http://127.0.0.1:' + port + '/api/', function (error, response) {
//                console.log(body);
//                console.log(error);
//                console.log(response.statusCode);
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

    }
});
