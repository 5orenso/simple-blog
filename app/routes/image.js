/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express          = require('express'),
    when             = require('when'),
    _                = require('underscore'),
    fs               = require('fs'),
    path             = require('path'),
    imagemagick      = require('imagemagick'),
    mkdirp           = require('mkdirp'),
    url              = require('url'),
    app_path         = __dirname + '/../../',
    photo_path       = path.normalize(app_path + 'content/images/'),
    photo_cache_path = path.normalize(app_path + 'content/images_cached/'),
    logger           = require(app_path + 'lib/logger')();


var config;
var image_router = express.Router();
image_router.set_config = function (conf) {
    image_router.config = conf;
};
image_router.use(function(req, res, next) {
    // do logging
    logger.log(
        req.method,
        req.url,
        req.get('Content-type'),
        req.get('User-agent')
    );
    next(); // make sure we go to the next routes and don't stop here
});


function getUrlFromRequest (req) {
    var image_filename = req.url.replace(/\//, '');
    image_filename = decodeURIComponent(image_filename);
    return url.parse(image_filename, true);
}


function pathExists (absolute_path) {
    console.log('pathExists: ', absolute_path);
    return when.promise(function(resolve, reject) {
        fs.exists(absolute_path, function(exists) {
            if(!exists) {
                mkdirp(path.dirname(absolute_path), function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(absolute_path);
                });
            } else {
                resolve(absolute_path);
            }
        });
    });
}

function fileExists (absolute_filename) {
    console.log('fileExists: ', absolute_filename);
    return when.promise(function(resolve, reject) {
        fs.exists(absolute_filename, function(exists) {
            if (exists) {
                resolve(absolute_filename);
            } else {
                reject('Not found: ' + absolute_filename);
            }
        });
    });
}


function resizeImage(opt) {
    console.log('resizeImage: ', opt.image_filename_absolute, opt.image_filename_resized, opt.width)
    return when.promise(function(resolve, reject) {
        fs.exists(opt.image_filename_resized, function(exists) {
            if (!exists || opt.force) {
                imagemagick.resize({
                    srcPath: opt.image_filename_absolute,
                    dstPath: opt.image_filename_resized,
                    width: opt.width,
                    quality: 0.9,
                    format: 'jpg',
                    progressive: false,
//                    height: opt.height,
//                    strip: true,
//                    filter: 'Lagrange',
                    sharpening: 0.3,
//                    customArgs: []

                }, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(opt.image_filename_resized);
                    }
                });
            } else {
                resolve(opt.image_filename_resized);
            }
        });
    });
}

function serveImage(response, image_filename_resized) {
    console.log('serverImage: ', image_filename_resized);
    return when.promise(function (resolve, reject) {
        fs.exists(image_filename_resized, function(exists) {
            if (exists) {
                fs.readFile(image_filename_resized, "binary", function (err, file) {
                    if (err) {
                        response.writeHead(500, {"Content-Type": "text/plain"});
                        response.write(err + "\n");
                        response.end();
                        reject(err);
                    } else {
                        response.writeHead(200);
                        response.write(file, "binary");
                        response.end();
                        resolve();
                    }
                });
            } else {
                reject('File does not exist: ' + image_filename_resized);
            }
        });
    });
}


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
image_router.get('/*', function(req, res) {
    var parsed_url = getUrlFromRequest(req);
    var cache_path = (parsed_url.query.w || 'rel') + 'x' + (parsed_url.query.h || 'rel');
    var image_filename_requested = parsed_url.pathname;
    var image_filename_absolute  = photo_path + image_filename_requested;
    var image_filename_resized   = photo_cache_path + cache_path + '/' + image_filename_requested;

    when(pathExists(image_filename_resized))
        .then(function () {
            return fileExists(image_filename_absolute);
        })
        .then(function () {
            return resizeImage({
                image_filename_absolute: image_filename_absolute,
                image_filename_resized: image_filename_resized,
                height: parsed_url.query.h,
                width: parsed_url.query.w,
                force: parsed_url.query.force
            });
        })
        .then(function () {
            return fileExists(image_filename_resized);
        })
        .then(function () {
            return serveImage(res, image_filename_resized);
        })
        .done(null, function (error) {
            res.status(500).send(error);
            res.end();
            console.log(error);
        });

//    res.send('yo! ' + photo_path + image_filename_requested);
});
module.exports = image_router;