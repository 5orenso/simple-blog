/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express        = require('express'),
    morgan         = require('morgan'),
    when           = require('when'),
    _              = require('underscore'),
    fs             = require('fs'),
    path           = require('path'),
    imagemagick    = require('imagemagick'),
    mkdirp         = require('mkdirp'),
    url            = require('url'),
    wsd            = require('websequencediagrams'),
    crypto         = require('crypto'),
    appPath        = __dirname + '/../../',
    photoPath      = path.normalize(appPath + 'content/images/'),
    photoCachePath = path.normalize(appPath + 'content/images_cached/'),
    wsdPath        = '/tmp/',
    logger         = require(appPath + 'lib/logger')(),
    LocalUtil      = require(appPath + 'lib/local-util'),
    localUtil      = new LocalUtil(),
    Metrics        = require(appPath + 'lib/metrics'),
    metrics        = new Metrics({
        useDataDog: true
    });

var imageRouter = express.Router();
imageRouter.setConfig = function (conf, opt) {
    imageRouter.config = conf;
    if (opt) {
        if (opt.hasOwnProperty('workerId')) {
            logger.set('workerId', opt.workerId);
        }
        if (opt.hasOwnProperty('photoPath')) {
            photoPath = path.normalize(opt.photoPath);
        }
        if (opt.hasOwnProperty('photoCachePath')) {
            photoCachePath = path.normalize(photoCachePath + opt.photoCachePath + '/');
        }
    }
    if (conf) {
        if (_.isObject(conf) && _.isObject(conf.log)) {
            logger.set('log', conf.log);
        }
    }

    // Add timer hooks to the functions you want to measure.
    pathExists = metrics.hook(pathExists, 'simpleblog.image.pathExists');
    fileExists = metrics.hook(fileExists, 'simpleblog.image.fileExists');
    resizeImage = metrics.hook(resizeImage, 'simpleblog.image.resizeImage');
    serveImage = metrics.hook(serveImage, 'simpleblog.image.serveImage');
    makeWebsequenceDiagram = metrics.hook(makeWebsequenceDiagram, 'simpleblog.image.makeWebsequenceDiagram');
    pathExists = metrics.hook(pathExists, 'simpleblog.image.pathExists');
    pathExists = metrics.hook(pathExists, 'simpleblog.image.pathExists');
};

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(appPath + '/logs/image-access.log', {flags: 'a'});
// setup the logger
imageRouter.use(morgan('combined', {stream: accessLogStream}));

imageRouter.use(function(req, res, next) {
    // do logging
    logger.log(
        req.method,
        req.url,
        req.get('Content-type'),
        req.get('User-agent')
    );
    next(); // make sure we go to the next routes and don't stop here
});

function getUrlFromRequest(req) {
    var imageFilename = req.url.replace(/\//, '');
    imageFilename = decodeURIComponent(imageFilename);
    return url.parse(imageFilename, true);
}

function pathExists(absolutePath) {
    return when.promise(function(resolve, reject) {
        fs.exists(absolutePath, function(exists) {
            if (!exists) {
                mkdirp(path.dirname(absolutePath), function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(absolutePath);
                });
            } else {
                resolve(absolutePath);
            }
        });
    });
}

function fileExists(absoluteFilename) {
    return when.promise(function(resolve, reject) {
        fs.exists(absoluteFilename, function(exists) {
            if (exists) {
                resolve(absoluteFilename);
            } else {
                reject('Not found: ' + absoluteFilename);
            }
        });
    });
}

function resizeImage(opt) {
    return when.promise(function(resolve, reject) {
        fs.exists(opt.imageFilenameResized, function(exists) {
            if (!exists || opt.force) {
                imagemagick.resize({
                    srcPath: opt.imageFilenameAbsolute,
                    dstPath: opt.imageFilenameResized,
                    width: opt.width,
                    quality: 0.9,
                    format: 'jpg',
                    progressive: false,
//                    height: opt.height,
//                    strip: true,
//                    filter: 'Lagrange',
                    sharpening: 0.3
//                    customArgs: []

                }, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(opt.imageFilenameResized);
                    }
                });
            } else {
                resolve(opt.imageFilenameResized);
            }
        });
    });
}

function serveImage(response, imageFilenameResized) {
    return when.promise(function (resolve, reject) {
        fs.exists(imageFilenameResized, function(exists) {
            if (exists) {
                fs.readFile(imageFilenameResized, 'binary', function (err, file) {
                    if (err) {
                        response.writeHead(500, {'Content-Type': 'text/plain'});
                        // jscs:disable
                        response.write(err + "\n");
                        // jscs:enable
                        response.end();
                        reject(err);
                    } else {
                        response.writeHead(200);
                        response.write(file, 'binary');
                        response.end();
                        resolve();
                    }
                });
            } else {
                reject('File does not exist: ' + imageFilenameResized);
            }
        });
    });
}

// TODO: Should this route be inside this router? It's external
// and it depends on an external resource. I think we should move
// to a custom router somewhere else.
function makeWebsequenceDiagram(wsdText, path) {
    return when.promise(function (resolve, reject) {
        // ["default",
        //"earth",
        //    "modern-blue",
        //    "mscgen",
        //    "omegapple",
        //    "qsd",
        //    "rose",
        //    "roundgreen",
        //    "napkin"];

        wsd.diagram(wsdText, 'roundgreen', 'png', function (err, buf) {
            if (err) {
                reject(err);
            } else {
                //console.log("Received MIME type:", typ);
                var filename = path + crypto.createHash('sha256').update(wsdText).digest('hex') + '.png';
                fs.writeFile(filename, buf, function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(filename);
                });
            }
        });
    });
}

imageRouter.use('/*', localUtil.setCacheHeaders);

imageRouter.get('/wsd/*', function(req, res) {
    var parsedUrl = getUrlFromRequest(req);
    var filename = wsdPath + crypto.createHash('sha256').update(parsedUrl.query.data).digest('hex') + '.png';
    when(pathExists(wsdPath))
        .then(function () {
            return fileExists(filename);
        })
        .catch(function () {
            return makeWebsequenceDiagram(parsedUrl.query.data, wsdPath);
        })
        .then(function (wsdFile) {
            return serveImage(res, wsdFile);
        })
        .done(function () {
            metrics.increment('simpleblog.image.wsd');
        }, function (error) {
            res.status(404).send(error);
            res.end();
        });

});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
imageRouter.get('/*', function(req, res) {
    var parsedUrl = getUrlFromRequest(req);
    var cachePath = (parsedUrl.query.w || 'rel') + 'x' + (parsedUrl.query.h || 'rel');
    var imageFilenameRequested = decodeURIComponent(parsedUrl.pathname);
    var imageFilenameAbsolute  = photoPath + imageFilenameRequested;
    var imageFilenameResized   = photoCachePath + cachePath + '/' + imageFilenameRequested;

    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
//        if (timer) { stopwatch.end(); }
    });

    when(pathExists(imageFilenameResized))
        .then(function () {
            return fileExists(imageFilenameAbsolute);
        })
        .then(function () {
            return resizeImage({
                imageFilenameAbsolute: imageFilenameAbsolute,
                imageFilenameResized: imageFilenameResized,
                height: parsedUrl.query.h,
                width: parsedUrl.query.w,
                force: parsedUrl.query.force
            });
        })
        .then(function () {
            return fileExists(imageFilenameResized);
        })
        .then(function () {
            return serveImage(res, imageFilenameResized);
        })
        .done(function () {
            metrics.increment('simpleblog.image.regular');
        }, function (error) {
            res.status(404).send(error);
            res.end();
        });

//    res.send('yo! ' + photoPath + imageFilenameRequested);
});
module.exports = imageRouter;
