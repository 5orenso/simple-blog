'use strict';

var buster     = require('buster'),
    assert     = buster.assert,
    refute     = buster.refute,
    when       = require('when'),
    fs         = require('fs'),
    express    = require('express'),
    request    = require('request'),
    web_router = require(__dirname + '/../../../app/routes/web');

var content_path     = __dirname + '/../../content/articles/',
    photo_path       = __dirname + '/../../content/images/',
    photo_cache_path = __dirname + '/../../content/images_cached/';

var config = require(__dirname + '/../../../config/config-dist.js');
web_router.set_config(config, {
    content_path: content_path,
    photo_path: photo_path,
    photo_cache_path: photo_cache_path
});

var port = 4321;
var app = express();
app.use('/web', web_router);
var server;

var responses = {
    endpoints : {"message":"hooray! welcome to our api!"}
};


var rmDir = function(dirPath) {
    var files;
    try { files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            } else {
                rmDir(filePath);
            }
        }
    }
    fs.rmdirSync(dirPath);
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
        'simple-blog/index': function (done) {
            request('http://127.0.0.1:' + port + '/web/simple-blog/index', function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    assert(true);
                    done();
                    assert.equals(200, response.statusCode);
                } else {
                    console.log('response.statusCode:', response.statusCode);
                    done();
                }
            });

        },

        'pho/test.jpg?w=300 from scratch': function (done) {
            rmDir(photo_cache_path);
            request('http://127.0.0.1:' + port + '/web/pho/test.jpg?w=300', function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    done();
                    assert.equals(200, response.statusCode);
                } else {
                    console.log('response.statusCode:', response.statusCode);
                    console.log(error);
                    console.log(response);
                    done();
                }
            });
        },

        'pho/test.jpg?w=300 cached version': function (done) {
            request('http://127.0.0.1:' + port + '/web/pho/test.jpg?w=300', function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    done();
                    assert.equals(200, response.statusCode);
                } else {
                    console.log('response.statusCode:', response.statusCode);
                    console.log(error);
                    console.log(response);
                    done();
                }
            });
        },


        'pho/test.jpg?w=300&force=1 force cache refresh': function (done) {
            request('http://127.0.0.1:' + port + '/web/pho/test.jpg?w=300&force=1', function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    done();
                    assert.equals(200, response.statusCode);
                } else {
                    console.log('response.statusCode:', response.statusCode);
                    console.log(error);
                    console.log(response);
                    done();
                }
            });
        },




    }
});