/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
var express          = require('express'),
    morgan           = require('morgan'),
    when             = require('when'),
    _                = require('underscore'),
    fs               = require('fs'),
    path             = require('path'),
    imagemagick      = require('imagemagick'),
    mkdirp           = require('mkdirp'),
    url              = require('url'),
    wsd              = require('websequencediagrams'),
    crypto           = require('crypto'),
    app_path         = __dirname + '/../../',
    photo_path       = path.normalize(app_path + 'content/images/'),
    photo_cache_path = path.normalize(app_path + 'content/images_cached/'),
    wsd_path         = '/tmp/',
    logger           = require(app_path + 'lib/logger')(),
    local_util       = require(app_path + 'lib/local-util')();

var image_router = express.Router();
image_router.set_config = function (conf, opt) {
    image_router.config = conf;
    if (opt) {
        if (opt.hasOwnProperty('workerId')) {
            logger.set('workerId', opt.workerId);
        }
        if (opt.hasOwnProperty('photo_path')) {
            photo_path = path.normalize(opt.photo_path);
        }
        if (opt.hasOwnProperty('photo_cache_path')) {
            photo_cache_path = path.normalize(photo_cache_path + opt.photo_cache_path + '/');
        }
    }
    if (conf) {
        if (_.isObject(conf) && _.isObject(conf.log)) {
            logger.set('log', conf.log);
        }
    }
};


// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(app_path + '/logs/image-access.log', {flags: 'a'});
// setup the logger
image_router.use(morgan('combined', {stream: accessLogStream}));

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


function makeWebsequenceDiagram(wsd_text, path) {
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

        wsd.diagram(wsd_text, "roundgreen", "png", function (err, buf) {
            if (err) {
                reject(err);
            } else {
                //console.log("Received MIME type:", typ);
                var filename = path + crypto.createHash('sha256').update(wsd_text).digest("hex") + '.png';
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

image_router.use('/*', local_util.set_cache_headers);

image_router.get('/wsd/*', function(req, res) {
    var lu    = require(app_path + 'lib/local-util')({config: image_router.config});
    var parsed_url = getUrlFromRequest(req);
    var filename = wsd_path + crypto.createHash('sha256').update(parsed_url.query.data).digest("hex") + '.png';
    when(pathExists(wsd_path))
        .then(function () {
            return fileExists(filename);
        })
        .catch(function () {
            lu.timer('routes/image->wsd');
            return makeWebsequenceDiagram(parsed_url.query.data, wsd_path);
        })
        .then(function (wsd_file) {
            lu.timer('routes/image->wsd');
            return serveImage(res, wsd_file);
        })
        .done(function () {
            lu.timer('routes/image->request');
            lu.send_udp({ timers: lu.timers_get() });
        }, function (error) {
            lu.timer('routes/image->request');
            lu.send_udp({ timers: lu.timers_get() });
            res.status(404).send(error);
            res.end();
        });

});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
image_router.get('/*', function(req, res) {
    var lu    = require(app_path + 'lib/local-util')({config: image_router.config});
    var parsed_url = getUrlFromRequest(req);
    var cache_path = (parsed_url.query.w || 'rel') + 'x' + (parsed_url.query.h || 'rel');
    var image_filename_requested = decodeURIComponent(parsed_url.pathname);
    var image_filename_absolute  = photo_path + image_filename_requested;
    var image_filename_resized   = photo_cache_path + cache_path + '/' + image_filename_requested;

    // Stop timer when response is transferred and finish.
    res.on('finish', function () {
//        if (timer) { stopwatch.end(); }
    });
    lu.timers_reset();
    lu.timer('routes/image->request');

    when(pathExists(image_filename_resized))
        .then(function () {
            return fileExists(image_filename_absolute);
        })
        .then(function () {
            lu.timer('routes/image->resizeImage');
            return resizeImage({
                image_filename_absolute: image_filename_absolute,
                image_filename_resized: image_filename_resized,
                height: parsed_url.query.h,
                width: parsed_url.query.w,
                force: parsed_url.query.force
            });
        })
        .then(function () {
            lu.timer('routes/image->resizeImage');
            return fileExists(image_filename_resized);
        })
        .then(function () {
            return serveImage(res, image_filename_resized);
        })
        .done(function () {
            lu.timer('routes/image->request');
            lu.send_udp({ timers: lu.timers_get() });
        }, function (error) {
            lu.timer('routes/image->request');
            lu.send_udp({ timers: lu.timers_get() });
            res.status(404).send(error);
            res.end();
        });

//    res.send('yo! ' + photo_path + image_filename_requested);
});
module.exports = image_router;