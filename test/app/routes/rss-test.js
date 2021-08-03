'use strict';

var buster        = require('buster'),
    assert        = buster.assert,
    express       = require('express'),
    request       = require('request'),
    rssRouter     = require(__dirname + '/../../../app/routes/rss');

var config = require(__dirname + '/../../../config/config-integration.js'),
    workerId = 1,
    photoPath = '/tmp/foo';

rssRouter.setConfig(config, {
    workerId: workerId,
    photoPath: photoPath
});

var port = 4321;
var app = express();
app.use('/rss', rssRouter);
var server;

var xml = {
    error: ['Not Found'],
    title: ['Simple Blog Server'],
    description: ['\n\t\t\n\t'],
    link: ['http://www.mydomain.no/'],
    category: [],
    copyright: [''],
    docs: ['http://www.mydomain.no/rss'],
    language: ['en-us'],
    lastBuildDate: ['Fri, 14 Aug 2015 07:46:12 GMT'],
    managingEditor: [''],
    pubDate: ['Fri, 14 Aug 2015 07:46:12 GMT'],
    webMaster: [''],
    generator: ['Simple-blog - github.com/5orenso/simple-blog/'],
    item: [
        {
            title: ['Simple Blog Server'],
            description: ['Life made easier'],
            link: ['http://www.mydomain.no/simple-blog/index'],
            category: [],
            pubDate: ['Mon, 01 Sep 2014 00:00:00 GMT']
        },
        {
            title: ['Simple blog 2'],
            description: [''],
            link: ['http://www.mydomain.no/simple-blog/simple-blog'],
            category: [],
            pubDate: ['Mon, 01 Sep 2014 00:00:00 GMT']
        }
    ]
};

buster.testCase('app/routes/rss', {
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
    // 'config check': function () {
    //     assert.equals(rssRouter.opt.workerId, workerId);
    //     assert.equals(rssRouter.opt.photoPath, photoPath);
    // },
    // 'Test web routes:': {
    //     '/': function (done) {
    //         //console.log('Testing search route /');
    //         request('http://127.0.0.1:' + port + '/rss', function (error, response, body) {
    //             //console.log(body, response.statusCode, response.request.path);
    //             assert.equals(response.statusCode, 200);
    //             // TODO: Check http headers. They should be set to no-cache.
    //             var parseString = require('xml2js').parseString;
    //             parseString(body, function (err, result) {
    //                 assert.equals(result.rss.channel[0].title, xml.title);
    //                 assert.equals(result.rss.channel[0].link, xml.link);
    //                 assert.equals(result.rss.channel[0].docs, xml.docs);
    //                 assert.equals(result.rss.channel[0].generator, xml.generator);
    //                 assert.equals(result.rss.channel[0].item[0].title, xml.item[0].title);
    //                 assert.equals(result.rss.channel[0].item[0].pubDate, xml.item[0].pubDate);
    //                 done();
    //             });
    //         });
    //     },

    //     '/this-should-not-be-found': function (done) {
    //         request('http://127.0.0.1:' + port + '/rss/no-hit', function (error, response, body) {
    //             var parseString = require('xml2js').parseString;
    //             parseString(body, function (err, result) {
    //                 assert.equals(result.rss.channel[0].error, xml.error);
    //                 done();
    //             });
    //         });
    //     }

    // }
});
