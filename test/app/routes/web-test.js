'use strict';

var buster     = require('buster'),
    assert     = buster.assert,
    refute     = buster.refute,
    when       = require('when'),
    express    = require('express'),
    request    = require('request'),
    web_router = require('../../../app/routes/web');

var config = require('../../../config/config-dist.js');
web_router.set_config(config, {
    content_path: __dirname + '/../../content/articles/'
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
//            console.log("Closed out remaining connections.");
//            delete require.cache[require.resolve('../../../lib/article')];

            done();
        });
    },
    'Test web routes:': {
        'simple-blog/index': function (done) {
//            request('http://127.0.0.1:' + port + '/web/simple-blog/index', function (error, response, body) {
            request('http://127.0.0.1:' + port + '/web/simple-blog/index', function (error, response, body) {
                if (!error && response.statusCode === 200) {
//                    console.log(body);
                    assert(true);
                    done();
                    assert.equals(200, response.statusCode);
//                    console.log(response);
//                    assert.equals(JSON.parse(body), responses.endpoints);
                } else {
                    console.log('response.statusCode:', response.statusCode);
//                    console.log(body);
                    done();
                }
            });




//            when(article.catlist({}))
//                .done(function (obj) {
//                    assert(true);
//                    done();
//                });
        },



    }
});