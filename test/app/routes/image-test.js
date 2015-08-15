'use strict';

var buster     = require('buster'),
    assert     = buster.assert,
    fs         = require('fs'),
    express    = require('express'),
    request    = require('request'),
    sinon      = require('sinon'),
    wsd        = require('websequencediagrams'),
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
    imageRouter = require(__dirname + '/../../../app/routes/image');

var contentPath     = __dirname + '/../../content/articles/',
    photoPath       = __dirname + '/../../content/images/',
    photoCachePath = __dirname + '/../../content/images_cached/';

var config = require(__dirname + '/../../../config/config-integration.js');
imageRouter.setConfig(config, {
    contentPath: contentPath,
    photoPath: photoPath,
    photoCachePath: photoCachePath,
    workerId: 1,
    stats: stats,
    activeConn: activeConn,
    timer: timer
});

var port = 4322;
var app = express();
app.use('/photo', imageRouter);
var server;

var rmDir = function(dirPath) {
    var files;
    try {
        files = fs.readdirSync(dirPath);
    } catch (e) {
        return;
    }
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

buster.testCase('app/routes/image', {
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

        '/test.jpg?w=300 from scratch': function (done) {
            rmDir(photoCachePath);
            request('http://127.0.0.1:' + port + '/photo/test.jpg?w=300', function (error, response) {
                if (!error && response.statusCode === 200) {
                    done();
                    assert.equals(response.statusCode, 200);
                } else {
                    console.log('response.statusCode:', response.statusCode);
                    console.log(error);
//                    console.log(response);
                    done();
                }
            });
        },

        '/test.jpg?w=300 cached version': function (done) {
            request('http://127.0.0.1:' + port + '/photo/test.jpg?w=300', function (error, response) {
                if (!error && response.statusCode === 200) {
                    done();
                    assert.equals(response.statusCode, 200);
                } else {
                    console.log('response.statusCode:', response.statusCode);
                    console.log(error);
//                    console.log(response);
                    done();
                }
            });
        },

        '/test.jpg?w=300&force=1 force cache refresh': function (done) {
            request('http://127.0.0.1:' + port + '/photo/test.jpg?w=300&force=1', function (error, response) {
                if (!error && response.statusCode === 200) {
                    done();
                    assert.equals(response.statusCode, 200);
                } else {
                    console.log('response.statusCode:', response.statusCode);
                    console.log(error);
//                    console.log(response);
                    done();
                }
            });
        },

        '/test-not-found.jpg?w=300': function (done) {
            request('http://127.0.0.1:' + port + '/photo/test-not-found.jpg?w=300', function (error, response) {
                if (!error && response.statusCode === 404) {
                    done();
                    assert.equals(response.statusCode, 404);
                } else {
                    console.log('response.statusCode:', response.statusCode);
                    console.log(error);
                    done();
                }
            });
        },

        '/wsd with data': function (done) {
            sinon.stub(wsd, 'diagram', function (text, opt, format, callback) {
                console.log(text, opt, format);
                callback(null, 'wsd image');
            });
            var date = new Date();
            var utime = date.getTime();
            request('http://127.0.0.1:' + port + '/photo/wsd/?data=title%20TestService%0A' +
                    utime + 'Browser-%3EVG.no%0A',
                function (error, response) {
                    if (!error && response.statusCode === 404) {
                        done();
                    } else {
                        // jscs:disable
                        assert(wsd.diagram.calledWithMatch('title TestService' + "\n" +
                            utime + 'Browser->VG.no', 'roundgreen', 'png'));
                        // jscs:enable
                        assert.equals(response.statusCode, 200);
                        done();
                    }
                }
            );
        }

    }
});
