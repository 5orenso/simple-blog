/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const express = require('express');
const morgan = require('morgan');
const when = require('when');
const _ = require('underscore');
const fs = require('fs');
const path = require('path');
const imagemagick = require('imagemagick');
const mkdirp = require('mkdirp');
const url = require('url');
const wsd = require('websequencediagrams');
const crypto = require('crypto');
const Logger = require('../../lib/logger');
const LocalUtil = require('../../lib/local-util');

const appPath = `${__dirname}/../../`;
let photoPath = path.normalize(`${appPath}content/images/`);
let photoCachePath = path.normalize(`${appPath}content/images_cached/`);

const wsdPath = '/tmp/';
const logger = new Logger();
const localUtil = new LocalUtil();

const getUrlFromRequest = function getUrlFromRequest(req) {
    let imageFilename = req.url.replace(/\//, '');
    imageFilename = decodeURIComponent(imageFilename);
    return url.parse(imageFilename, true);
};

const pathExists = function pathExists(absolutePath) {
    return when.promise((resolve, reject) => {
        fs.exists(absolutePath, (exists) => {
            if (!exists) {
                mkdirp(path.dirname(absolutePath), (err) => {
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
};

const fileExists = function fileExists(absoluteFilename) {
    return when.promise((resolve, reject) => {
        fs.exists(absoluteFilename, (exists) => {
            if (exists) {
                resolve(absoluteFilename);
            } else {
                reject(`Not found: ${absoluteFilename}`);
            }
        });
    });
};

const resizeImage = function resizeImage(opt) {
    return when.promise((resolve, reject) => {
        fs.exists(opt.imageFilenameResized, (exists) => {
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
                    sharpening: 0.3,
                    //                    customArgs: []

                }, (err) => {
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
};

const serveImage = function serveImage(response, imageFilenameResized) {
    return when.promise((resolve, reject) => {
        fs.exists(imageFilenameResized, (exists) => {
            if (exists) {
                fs.readFile(imageFilenameResized, 'binary', (err, file) => {
                    if (err) {
                        response.writeHead(500, { 'Content-Type': 'text/plain' });
                        // jscs:disable
                        response.write(`${err}\n`);
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
                reject(`File does not exist: ${imageFilenameResized}`);
            }
        });
    });
};

// TODO: Should this route be inside this router? It's external
// and it depends on an external resource. I think we should move
// to a custom router somewhere else.
const makeWebsequenceDiagram = function makeWebsequenceDiagram(wsdText, wsdLocalPath) {
    return when.promise((resolve, reject) => {
        // ["default",
        // "earth",
        //    "modern-blue",
        //    "mscgen",
        //    "omegapple",
        //    "qsd",
        //    "rose",
        //    "roundgreen",
        //    "napkin"];

        wsd.diagram(wsdText, 'roundgreen', 'png', (error, buf) => {
            if (error) {
                reject(error);
            } else {
                // console.log("Received MIME type:", typ);
                const filename = `${wsdLocalPath + crypto.createHash('sha256').update(wsdText).digest('hex')}.png`;
                fs.writeFile(filename, buf, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(filename);
                });
            }
        });
    });
};

const imageRouter = express.Router();
imageRouter.setConfig = function doSetConfig(conf, opt) {
    imageRouter.config = conf;
    if (opt) {
        if (opt.hasOwnProperty('workerId')) {
            logger.set('workerId', opt.workerId);
        }
        if (opt.hasOwnProperty('photoPath')) {
            photoPath = path.normalize(opt.photoPath);
        }
        if (opt.hasOwnProperty('photoCachePath')) {
            photoCachePath = path.normalize(`${photoCachePath + opt.photoCachePath}/`);
        }
    }
    if (conf) {
        if (_.isObject(conf) && _.isObject(conf.log)) {
            logger.set('log', conf.log);
        }
    }
};

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(`${appPath}/logs/image-access.log`, { flags: 'a' });
// setup the logger
imageRouter.use(morgan('combined', { stream: accessLogStream }));

imageRouter.use((req, res, next) => {
    // do logging
    logger.log(req.method, req.url, req.get('Content-type'), req.get('User-agent'));
    next(); // make sure we go to the next routes and don't stop here
});

imageRouter.use('/*', localUtil.setCacheHeaders);

imageRouter.get('/wsd/*', (req, res) => {
    const parsedUrl = getUrlFromRequest(req);
    const filename = `${wsdPath + crypto.createHash('sha256').update(parsedUrl.query.data).digest('hex')}.png`;
    when(pathExists(wsdPath))
        .then(() => fileExists(filename))
        .catch(() => makeWebsequenceDiagram(parsedUrl.query.data, wsdPath))
        .then(wsdFile => serveImage(res, wsdFile))
        .done(() => {
            // metrics.increment('simpleblog.image.wsd');
        }, (error) => {
            res.status(404).send(error);
            res.end();
        });
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
imageRouter.get('/*', (req, res) => {
    const parsedUrl = getUrlFromRequest(req);
    const cachePath = `${parsedUrl.query.w || 'rel'}x${parsedUrl.query.h || 'rel'}`;
    const imageFilenameRequested = decodeURIComponent(parsedUrl.pathname);
    const imageFilenameAbsolute = photoPath + imageFilenameRequested;
    const imageFilenameResized = `${photoCachePath + cachePath}/${imageFilenameRequested}`;

    // Stop timer when response is transferred and finish.
    res.on('finish', () => {
        //        if (timer) { stopwatch.end(); }
    });

    when(pathExists(imageFilenameResized))
        .then(() => fileExists(imageFilenameAbsolute))
        .then(() => resizeImage({
            imageFilenameAbsolute,
            imageFilenameResized,
            height: parsedUrl.query.h,
            width: parsedUrl.query.w,
            force: parsedUrl.query.force,
        }))
        .then(() => fileExists(imageFilenameResized))
        .then(() => serveImage(res, imageFilenameResized))
        .done(() => {
            // metrics.increment('simpleblog.image.regular');
        }, (error) => {
            res.status(404).send(error);
            res.end();
        });

//    res.send('yo! ' + photoPath + imageFilenameRequested);
});
module.exports = imageRouter;
