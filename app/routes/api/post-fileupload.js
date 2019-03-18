/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

const uuidv4 = require('uuid/v4');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const im = require('imagemagick');

const { routeName, routePath, run, util, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });
// const Article = require('../../../lib/class/article');
const filenamePrefix = 'simpleBlog-';

function isImage(file) {
    if (file.mimetype.match(/^image\/(jpg|jpeg|png|gif)/i)) {
        return true;
    }
    return false;
}

function convertDMSToDD(degrees, minutes, seconds, direction) {
    const dd = degrees + minutes / 60 + seconds / (60 * 60);
    if (direction === 'S' || direction === 'W') {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}

function readExif(file) {
    return new Promise((resolve, reject) => {
        im.readMetadata(file, (err, metadata) => {
            if (err) reject(err);
            if (metadata.exif && metadata.exif.gpsLatitude) {
                // gpsLatitude: "70/1, 8/1, 3183/100"
                // ​gpsLatitudeRef: "N"
                const latParts = metadata.exif.gpsLatitude.split(/, /).map(val => eval(val));
                metadata.exif.lat = convertDMSToDD(latParts[0], latParts[1], latParts[2],
                    metadata.exif.gpsLatitudeRef);

                // gpsLongitude: "29/1, 18/1, 4090/100"
                // gpsLongitudeRef: "E"
                const lngParts = metadata.exif.gpsLongitude.split(/, /).map(val => eval(val));
                metadata.exif.lng = convertDMSToDD(lngParts[0], lngParts[1], lngParts[2],
                    metadata.exif.gpsLongitudeRef);
            }
            resolve(metadata.exif);
        });
    });
}

function readFileInfo(file) {
    return new Promise((resolve, reject) => {
        fs.stat(file, (err, stats) => {
            if (err) reject(err);
            resolve(stats);
        });
    });
}

function pathExists(absolutePath) {
    return new Promise((resolve, reject) => {
        console.log('absolutePath', absolutePath);
        fs.exists(absolutePath, (exists) => {
            if (!exists) {
                mkdirp(absolutePath, (err) => {
                    if (err) {
                        console.error(err);
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


module.exports = async (req, res) => {
    const { hrstart, runId }  = run(req);
    const filesUploaded = [];

    const photoPath = util.returnString(req, 'config', 'adapter', 'markdown', 'photoPath');

    // const art = new Article();
    if (typeof req.files['files[]'] === 'object') {
        let files = [];
        if (Array.isArray(req.files['files[]'])) {
            files = req.files['files[]'];
        } else {  // One file uploaded
            files.push(req.files['files[]']);
        }
        for (let i = 0; i < files.length; i += 1) {
            const file = files[i];
            const filename = uuidv4();
            file.ext = path.extname(file.name);
            file.newFilename = filenamePrefix + filename + file.ext;

            // const tmpFile = `/tmp/${file.newFilename}`;
            const tmpPath = path.normalize(`${photoPath}${req.query.category || 'no-category'}/${req.query.title || 'no-title'}`);
            const tmpFile = `${tmpPath}/${file.newFilename}`;
            await pathExists(tmpPath);
            await file.mv(tmpFile);

            file.src = `${req.query.category}/${req.query.title}/${file.newFilename}`;

            const exif = await readExif(tmpFile);
            const filestats = await readFileInfo(tmpFile);
            file.exif = exif;
            file.stats = filestats;

            delete file.data;
            filesUploaded.push(file);
        }
    }

    const data = {
        filesUploaded,
    };

    utilHtml.renderApi(req, res, 201, data);
};
