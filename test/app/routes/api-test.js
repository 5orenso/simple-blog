'use strict';

var buster     = require('buster'),
    assert     = buster.assert,
    refute     = buster.refute,
    when       = require('when'),
    express    = require('express'),
    request    = require('request'),
    api_router = require('../../../app/routes/api');

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
//        console.log('api: setup');
        this.timeout = 2000;
        server = app.listen(port);
    },
    tearDown: function (done) {
        // TODO: Shutdown webserver.
//        console.log('api: tearDown');
        server.close(function() {
//            console.log("Closed out remaining connections.");
//            process.exit();
            done();
        });
    },
    'Test api routes:': {
        'endpoints': function (done) {
            request('http://127.0.0.1:' + port + '/api', done(function (error, response, body) {
                if (!error && response.statusCode === 200) {
//                    console.log(body);
//                    console.log(response);
                    assert.equals(JSON.parse(body), responses.endpoints);
                }
            }));


//            when(article.catlist({}))
//                .done(function (obj) {
//                    assert(true);
//                    done();
//                });
        },
//        'test': function () {
//            assert(true);
//        }


    }
});