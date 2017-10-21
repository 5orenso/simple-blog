'use strict';

const routeName = __filename.slice(__dirname.length + 1, -3);
const routePath = __dirname.replace(/.+\/routes/, '');
const webUtil = require('../../lib/web-util');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const filenamePrefix = 'webupload-';
const baseHref = '/pho/';

function isImage(file) {
    // image/jpeg, image/png, image/gif
    if (file.mimetype.match(/^image\/(jpeg|png|gif)/i)) {
        return true;
    }
    return false;
}

function pathExists(absolutePath) {
    return new Promise((resolve, reject) => {
        console.log('absolutePath', absolutePath);
        fs.exists(absolutePath, function(exists) {
            if (!exists) {
                mkdirp(absolutePath, function(err) {
                    if (err) {
                        console.error(err);
                        reject(err);
                    }
                    console.log('created', absolutePath);
                    resolve(absolutePath);
                });
            } else {
                console.log('exists', absolutePath);
                resolve(absolutePath);
            }
        });
    });
}

module.exports = (req, res) => {
    const hrstart = process.hrtime();
    webUtil.printIfDev(`Route: ${routePath}/${routeName}`, req.query, req.param);
    let uploadResult = true;
    let errorMessage;
    const filesUploaded = [];
    const allPromises = [];

    const uploadPath = path.normalize(req.config.adapter.markdown.photoPath + req.body.pathPrefix + '/');
    // imagePath: /Users/sorenso/Projects/simple-blog/content/images/outdoor/snow-scooter-alta-2011
    console.log('imagePath:', uploadPath);

    if (!req.files) {
        uploadResult = false;
        errorMessage = 'No file uploaded.';
    }

    if (typeof req.files === 'object') {
        let files = [];
        if (Array.isArray(req.files['files[]'])) { // Multiple files uploaded
            files = req.files['files[]'];
        } else {  // One file uploaded
            files.push(req.files['files[]']);
        }
        for (let i = 0; i < files.length; i += 1) {
            const file = files[i];
            const filename = uuidv4();
            file.ext = path.extname(file.name);
            file.newFilename = filenamePrefix + filename + file.ext;
            file.webLink = `${baseHref}${file.newFilename}`;
            const destinationFile = `${uploadPath}${file.newFilename}`;
            allPromises.push(pathExists(uploadPath)
                .then(() => file.mv(destinationFile))
                .then(() => {
                    if (isImage(file)) {
                        file.thumbLink = `${baseHref}${file.newFilename}?w=100`;
                    }
                    delete file.data;
                    filesUploaded.push(file);
                }));
        }
    }

    Promise.all(allPromises)
        .then(() => {
            webUtil.sendResultResponse(req, res, {
                uploadResult: {
                    success: uploadResult,
                    error: errorMessage,
                    files: filesUploaded,
                },
            }, {
                hrstart,
                routePath,
                routeName,
            });
        });
};
