/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2020 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const uuidv4 = require('uuid/v4');
const path = require('path');
const fs = require('fs');
const ColorThief = require('colorthief');

const tj = require('@tmcw/togeojson');
const DOMParser = require('xmldom').DOMParser;
const xmlParser = require('xml-js');
const geoLib = require('geo-lib');
const ExifImage = require('exif').ExifImage;
const sizeOf = require('image-size');

const Image = require('../../../lib/class/image');
const ImageUtil = require('../../../lib/class/image-util');

const {
    initOpt, run, util, webUtil, utilHtml, tc,
} = require('../../middleware/init')({ __filename, __dirname });

const S3 = require('../../../lib/aws/s3');

const filenamePrefix = 'simpleblog-';

function isImage(file) {
    // image/jpeg, image/png, image/gif
    if (file.mimetype.match(/^image\/(jpeg|png|gif|heic|heif|svg|webp|tiff)/i)) {
        return true;
    }
    return false;
}

function isGpx(file) {
    // image/jpeg, image/png, image/gif
    if (file.ext.match(/gpx/i)) {
        return true;
    }
    return false;
}

function avg(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

function calcAngle(height, distance) {
    if (distance <= 0) {
        return 0;
    }
    const degrees = toDegrees(Math.atan(height / distance));
    const percent = degrees / 45 * 100;
    // console.log({ height, distance, degrees, percent });
    return percent;
}

function readExif(image) {
    return new Promise((resolve) => {
        try {
            ExifImage({ image }, (error, exifData) => {
                if (error) {
                    return resolve(error);
                }
                return resolve(exifData);
            });
        } catch (error) {
            return resolve(error);
        }
    });
}

function imageDimensions(image) {
    return new Promise((resolve) => {
        sizeOf(image, (error, dimensions) => {
            if (error) {
                return resolve(error);
            }
            return resolve(dimensions);
        });
    });
}

function smoothOut(arr, variance) {
    const tAvg = avg(arr) * variance;
    const ret = [];
    for (let i = 0; i < arr.length; i += 1) {
        const prev = i > 0 ? ret[i - 1] : arr[i];
        const next = i < arr.length ? arr[i] : arr[i - 1];
        ret[i] = avg([tAvg, avg([prev, arr[i], next])]);
    }
    return ret;
}

function parseTrkPoints(points = []) {
    const finalResult = {
        totalDistance: 0,
        maxSpeed: 0,
        avgSpeed: 0,
        ascent: 0,
        decent: 0,
        duration: 0,
        rest: 0,
        startTime: new Date().getTime(),
        endTime: 0,
        startLatlng: [],
        endLatlng: [],
        states: [],
    };
    const speeds = [];
    const climbs = [];
    const allSpeeds = [];
    const allElevations = [];
    const allDistances = [];
    const ascent = [];
    const decent = [];
    // const pointsSmooth = simplify(points, 0.0001);
    // console.log(pointsSmooth);
    // console.log(points);
    let prevPt;
    let firstPt;
    let lastPt;
    let startTime = new Date().getTime();
    let endTime = 0;
    let stateDuration = 0;
    let stateDistance = 0;
    let stateSpeeds = [];
    let currentState = 'rest';
    let prevState = 'rest';
    for (let j = 0, m = points.length; j < m; j += 1) {
        const pt = points[j];
        if (!pt.firstPt) {
            firstPt = pt;
        }
        lastPt = pt;
        // console.log(j, pt);
        // {
        //     _attributes: { lat: '61.006554', lon: '9.975422' },
        //     ele: 560,
        //     time: '2020-08-10T16:53:07Z',
        //     x: 9.975422,
        //     y: 61.006554
        // }
        if (tc.checkNested(prevPt, 'lat')) {
            const ptime = new Date(prevPt.time).getTime();
            const time = new Date(pt.time).getTime();
            if (time > endTime) {
                endTime = time;
            }
            if (time < startTime) {
                startTime = time;
            }
            const result = geoLib.distance({
                p1: { lat: prevPt.lat, lon: prevPt.lon },
                p2: { lat: pt.lat, lon: pt.lon },
                timeUsed: (time - ptime) / 1000,
            });
            // console.log(result, prevPt, pt);
            // {
            //     distance: 0.01,
            //     unit: 'km',
            //     method: 'haversine',
            //     timeUsedInSeconds: 3,
            //     speedKph: 12,
            //     speedMph: 7.46,
            //     speedMpk: '5:0'
            // }
            // Total distance:
            const ascending = pt.ele - prevPt.ele;
            let percent = calcAngle(ascending, result.distance * 1000);
            if (percent > 30) {
                percent = 30;
            }
            if (percent < -30) {
                percent = -30;
            }
            climbs.push(tc.isNumber(percent) ? percent : 0);

            finalResult.totalDistance += result.distance;
            allDistances.push(result.distance);
            finalResult.duration += (time - ptime) / 1000;

            if (result.speedKph <= 0.3) {
                finalResult.rest += (time - ptime) / 1000;
                currentState = 'rest';
            } else {
                speeds.push(result.speedKph / 3.6);
                currentState = 'running';
            }
            // Total elevation
            if (prevPt.ele > pt.ele) {
                decent.push(prevPt.ele - pt.ele);
            } else if (prevPt.ele < pt.ele) {
                ascent.push(pt.ele - prevPt.ele);
            }
            allSpeeds.push(result.speedKph / 3.6);
            allElevations.push(pt.ele);

            if (prevState !== currentState) {
                if (stateDuration > 10) {
                    let state = prevState;
                    let avgSpeed = util.avgArr(stateSpeeds);

                    if (prevState === 'rest') {
                        state = stateDuration > 900 ? 'restTrail' : 'rest';
                        avgSpeed = 0;
                    }
                    finalResult.states.push({
                        state,
                        duration: stateDuration,
                        distance: stateDistance,
                        avgSpeed,
                    });
                    stateDuration = (time - ptime) / 1000;
                    stateDistance = result.distance;
                    stateSpeeds = [];
                    prevState = currentState;
                } else {
                    stateDuration += (time - ptime) / 1000;
                    stateDistance += result.distance;
                    if (result.speedKph >= 0) {
                        stateSpeeds.push(result.speedKph / 3.6);
                    }
                }
            } else {
                stateDuration += (time - ptime) / 1000;
                stateDistance += result.distance;
                if (result.speedKph >= 0) {
                    stateSpeeds.push(result.speedKph / 3.6);
                }
                prevState = currentState;
            }
        }
        prevPt = pt;
    }
    let state = prevState;
    let avgSpeed = util.avgArr(stateSpeeds);

    if (prevState === 'rest') {
        state = stateDuration > 900 ? 'rest' : 'stop';
        avgSpeed = 0;
    }

    finalResult.states.push({
        state,
        duration: stateDuration,
        distance: stateDistance,
        avgSpeed,
    });

    // finalResult.avgSpeed = totalSpeed / totalMovingPoints;
    const speedsSmooth = smoothOut(speeds, 0.85);

    finalResult.speeds = smoothOut(allSpeeds, 0.85);
    finalResult.elevations = allElevations;
    finalResult.climbs = climbs;
    finalResult.distances = allDistances;
    finalResult.temperatures = [];
    finalResult.avgSpeed = avg(speedsSmooth);
    finalResult.maxSpeed = Math.max(...speedsSmooth);
    finalResult.ascent = ascent.reduce((a, b) => a + b, 0);
    finalResult.decent = decent.reduce((a, b) => a + b, 0);
    finalResult.startLatlng = [firstPt.lat, firstPt.lon];
    finalResult.endLatlng = [lastPt.lat, lastPt.lon];
    finalResult.startTime = startTime;
    finalResult.endTime = endTime;

    return finalResult;
}

module.exports = async (req, res) => {
    const { runOpt } = run(req);

    if (!req.files) {
        const response = {
            status: 428,
            message: 'No files found',
        };
        return webUtil.renderApi(req, res, { response, ...initOpt, ...runOpt });
    }

    const imageUtil = new ImageUtil();
    const imageBucket = webUtil.isDevelopment()
        ? tc.getNestedValue(req, 'config.urls.dev.imageS3Bucket')
        : tc.getNestedValue(req, 'config.urls.prod.imageS3Bucket');
    const s3imageThumbBaseHref = webUtil.isDevelopment()
        ? tc.getNestedValue(req, 'config.urls.dev.imageServer')
        : tc.getNestedValue(req, 'config.urls.prod.imageServer');
    const s3BaseHref = webUtil.isDevelopment()
        ? tc.getNestedValue(req, 'config.urls.dev.fileServer')
        : tc.getNestedValue(req, 'config.urls.prod.fileServer');

    const messages = [];
    const filesUploaded = [];
    const allPromises = [];

    if (typeof req.files['files[]'] === 'object') {
        let files = [];
        if (Array.isArray(req.files['files[]'])) { // Multiple files uploaded
            files = req.files['files[]'];
        } else { // One file uploaded
            files.push(req.files['files[]']);
        }
        for (let i = 0; i < files.length; i += 1) {
            const file = files[i];
            const filename = uuidv4();
            const fileCategory = util.asHtmlIdSafe(req.query.category || 'no-category');
            let targetFolder = `${req.config.blog.imagePath}`;
            if (fileCategory) {
                targetFolder += `/${fileCategory}`;
            }

            file.createdDate = new Date();
            file.ext = path.extname(file.name);
            file.newFilename = filenamePrefix + filename + file.ext;
            file.s3Link = `${s3BaseHref}/${targetFolder}/${file.newFilename}`;
            const tmpFile = `/tmp/${file.newFilename}`;
            allPromises.push(file.mv(tmpFile)
                .then(async () => {
                    if (isImage(file)) {
                        file.s3ThumbLink = `${s3imageThumbBaseHref}/80x80/${targetFolder}/${file.newFilename}`;
                        file.s3XSmallLink = `${s3imageThumbBaseHref}/150x/${targetFolder}/${file.newFilename}`;
                        file.s3SmallLink = `${s3imageThumbBaseHref}/220x/${targetFolder}/${file.newFilename}`;
                        file.s3MediumLink = `${s3imageThumbBaseHref}/400x/${targetFolder}/${file.newFilename}`;
                        file.s3LargeLink = `${s3imageThumbBaseHref}/800x/${targetFolder}/${file.newFilename}`;
                        file.s3XLargeLink = `${s3imageThumbBaseHref}/1024x/${targetFolder}/${file.newFilename}`;
                        file.s3XXLargeLink = `${s3imageThumbBaseHref}/1280x/${targetFolder}/${file.newFilename}`;
                        file.s33XLargeLink = `${s3imageThumbBaseHref}/1600x/${targetFolder}/${file.newFilename}`;
                        file.s34XLargeLink = `${s3imageThumbBaseHref}/1920x/${targetFolder}/${file.newFilename}`;
                    }
                    delete file.data;

                    const stats = fs.statSync(tmpFile);
                    const fileSizeInBytes = stats.size;
                    file.bytes = fileSizeInBytes;

                    if (isImage(file)) {
                        file.dimensions = await imageDimensions(tmpFile);
                        file.exif = await readExif(tmpFile);

                        try {
                            file.color = await ColorThief.getColor(tmpFile);
                            file.palette = await ColorThief.getPalette(tmpFile, 10);
                        } catch (e) {
                            file.color = {};
                            file.palette = {};
                        }

                        file.hsv = util.rgb2hsv(file.color[0], file.color[1], file.color[2]);
                        file.hsvPalette = [];
                        if (file.palette) {
                            for (let j = 0, m = file.palette.length; j < m; j += 1) {
                                const color = file.palette[j];
                                file.hsvPalette.push(util.rgb2hsv(color[0], color[1], color[2]));
                            }
                        }
                    }

                    if (isGpx(file)) {
                        const xmlString = fs.readFileSync(tmpFile, 'utf8');
                        const gpxXml = new DOMParser().parseFromString(xmlString);
                        file.geoJSON = tj.gpx(gpxXml, { styles: true });
                        const jsonObj = xmlParser.xml2json(xmlString, { compact: true, spaces: 4 });
                        const gpxObj = JSON.parse(jsonObj);
                        file.gpx = gpxObj.gpx;
                        file.gpxInfo = {
                            totalDistance: 0,
                            maxSpeed: 0,
                            avgSpeed: 0,
                            ascent: 0,
                            decent: 0,
                            duration: 0,
                            rest: 0,
                            startLatlng: [],
                            endLatlng: [],
                        };

                        if (tc.checkNested(file.gpx, 'trk') && tc.isArray(file.gpx.trk)) {
                            file.gpx.trk.forEach((trk) => {
                                if (tc.checkNested(trk, 'trkseg', 'trkpt')) {
                                    const points = trk.trkseg.trkpt.map((p) => {
                                        // console.log({ trk, p }, tc.checkNested(p, 'time', '_text'));
                                        let time;
                                        if (tc.checkNested(p, 'time')) {
                                            if (tc.checkNested(p, 'time', '_text')) {
                                                time = tc.getNestedValue(p, 'time._text');
                                            } else {
                                                time = p.time;
                                            }
                                        }
                                        let ele;
                                        if (tc.checkNested(p, 'ele')) {
                                            if (tc.checkNested(p, 'ele', '_text')) {
                                                ele = parseInt(tc.getNestedValue(p, 'ele._text'), 10);
                                            } else {
                                                ele = parseInt(p.ele, 10);
                                            }
                                        }
                                        return {
                                            ...p,
                                            x: parseFloat(tc.getNestedValue(p, '_attributes.lon') || p.lon),
                                            y: parseFloat(tc.getNestedValue(p, '_attributes.lat') || p.lat),
                                            lon: parseFloat(tc.getNestedValue(p, '_attributes.lon') || p.lon),
                                            lat: parseFloat(tc.getNestedValue(p, '_attributes.lat') || p.lat),
                                            time,
                                            ele,
                                        };
                                    });

                                    const result = parseTrkPoints(points);
                                    file.gpxInfo.totalDistance += result.totalDistance;
                                    file.gpxInfo.maxSpeed += result.maxSpeed;
                                    file.gpxInfo.avgSpeed += result.avgSpeed;
                                    file.gpxInfo.ascent += result.ascent;
                                    file.gpxInfo.decent += result.decent;
                                    file.gpxInfo.duration += result.duration;
                                    file.gpxInfo.rest += result.rest;

                                    file.gpxInfo.startTime = result.startTime;
                                    file.gpxInfo.endTime = result.endTime;
                                }
                            });
                        } else if (tc.checkNested(file.gpx, 'trk', 'trkseg', 'trkpt')) {
                            const points = file.gpx.trk.trkseg.trkpt.map(p => ({
                                ...p,
                                x: parseFloat(tc.getNestedValue(p, '_attributes.lon') || p.lon),
                                y: parseFloat(tc.getNestedValue(p, '_attributes.lat') || p.lat),
                                lon: parseFloat(tc.getNestedValue(p, '_attributes.lon') || p.lon),
                                lat: parseFloat(tc.getNestedValue(p, '_attributes.lat') || p.lat),
                                time: tc.checkNested(p, 'time', '_text') ? tc.getNestedValue(p, 'time._text') : p.time,
                                ele: parseInt(tc.getNestedValue(p, 'ele._text') || p.ele, 10),
                            }));

                            const result = parseTrkPoints(points);
                            file.gpxInfo = {
                                ...result,
                            };
                        }
                    }

                    file.src = `${fileCategory}/${file.newFilename}`;

                    filesUploaded.push(file);

                    const imageInfo = await imageUtil.read(tmpFile, true, { config: req.config });
                    const fileData = { ...file, ...imageInfo };

                    const image = new Image();
                    const imageObject = await image.save(fileData);

                    return S3.upload(imageBucket, `/tmp/${file.newFilename}`, file.mimetype, targetFolder);
                }));
        }
    }

    const results = await Promise.all(allPromises);
    const response = {
        filesUploaded,
    };
    return utilHtml.renderApi(req, res, 201, response);
};
