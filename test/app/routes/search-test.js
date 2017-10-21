'use strict';

var buster        = require('buster'),
    assert        = buster.assert,
    express       = require('express'),
    request       = require('request'),
    searchRouter = require(__dirname + '/../../../app/routes/search');

var config = require(__dirname + '/../../../config/config-integration.js');
searchRouter.setConfig(config, {
    workerId: 1
});

var port = 4321;
var app = express();
app.use('/search', searchRouter);
var server;

var art = {
    tagValues: {
        toc: '',
        fact: '',
        artlist: '<ul class="artlist"></ul>',
        'artlist-block': '<div class="artlist"></div><br class="clear">',
        artlistOnepage: '<ul class="artlist"></ul>'
    },
    published: '2014-01-01',
    title: 'Simple blog 2',
    img: ['simple-blog.jpg'],
    body: '<p>This is content number 2.</p>\n',
    file: 'index',
    filename: 'my-path-to-the-files/content/articles/simple-blog/simple-blog.md',
    baseHref: '/simple-blog/',
    artlist: [undefined]
};

buster.testCase('app/routes/search', {
    setUp: function () {
        // TODO: Start webserver and use routes.
        this.timeout = 2000;
        server = app.listen(port);
    },
    tearDown: function (done) {
        // TODO: Shutdown webserver.
        server.close(function() {
            done();
        });
    },
    'Test web routes:': {
        '// /': function (done) {
            //console.log('Testing search route /');
            request('http://127.0.0.1:' + port + '/search/one-hit', function (error, response, body) {
                //console.log(body, response.statusCode, response.request.path);
                assert.equals(response.statusCode, 200);
                assert.match(body, art.body);
                assert.match(body, art.title);
                done();
            });
        },
        '// / w/query_string': function (done) {
            //console.log('Testing search route /');
            request('http://127.0.0.1:' + port + '/search/?q=one-hit', function (error, response, body) {
                //console.log(body, response.statusCode, response.request.path);
                assert.equals(response.statusCode, 200);
                assert.match(body, art.body);
                assert.match(body, art.title);
                done();
            });
        },

        '// /this-should-not-be-found': function (done) {
            request('http://127.0.0.1:' + port + '/search/no-hit', function (error, response, body) {
                //console.log(body, response.statusCode, response.request.path);
                assert.equals(response.statusCode, 200);
                assert.match(body, '"no-hit" not found');
                done();
            });
        },

        '// /this-should-not-be-found w/query_string': function (done) {
            request('http://127.0.0.1:' + port + '/search/?=no-hit', function (error, response, body) {
                //console.log(body, response.statusCode, response.request.path);
                assert.equals(response.statusCode, 200);
                assert.match(body, '"no-hit" not found');
                done();
            });
        },

        '// /this-should-blow-up': function (done) {
            request('http://127.0.0.1:' + port + '/search/blow-up', function (error, response, body) {
                //console.log(body, response.statusCode, response.request.path);
                assert.equals(response.statusCode, 404);
                assert.match(body, 'Error in search...');
                done();
            });
        },

        '// /this-should-blow-up w/query_string': function (done) {
            request('http://127.0.0.1:' + port + '/search/?q=blow-up', function (error, response, body) {
                //console.log(body, response.statusCode, response.request.path);
                assert.equals(response.statusCode, 404);
                assert.match(body, 'Error in search...');
                done();
            });
        }

    }
});
