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

function addMarkdownToFile(addToFile, imageFilename, imageDescription) {
    return new Promise((resolve, reject) => {
        const markdownForImage = `![${imageDescription}](${imageFilename})\n`;
        fs.appendFile(addToFile, markdownForImage, (err) => {
            if (err) {
                return reject(err);
            }
            return resolve('saved');
        });
    });
}

function addImgToFile(addToFile, imageFilename, imageDescription) {
    return new Promise((resolve, reject) => {
        const imageContent = `:img ${imageFilename}
:imgtext ${imageDescription}\n`;
        fs.appendFile(addToFile, imageContent, (err) => {
            if (err) {
                return reject(err);
            }
            return resolve('saved');
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

    const uploadPath = path.normalize(`${req.config.adapter.markdown.photoPath}${req.body.pathPrefix}/`);
    const webPath = req.body.pathPrefix;
    const addToFile = path.normalize(`${req.config.adapter.markdown.contentPath}${req.body.addToFile}`);
    const addGalleryImage = req.body.addGalleryImage;

    // imagePath: /Users/sorenso/Projects/simple-blog/content/images/outdoor/snow-scooter-alta-2011
    console.log('uploadPath:', uploadPath);
    console.log('webPath:', webPath);
    console.log('addToFile:', addToFile);

    if (!req.files) {
        uploadResult = false;
        errorMessage = 'No file uploaded.';
    }

    if (typeof req.files === 'object') {
        let files = [];
        if (Array.isArray(req.files['files[]'])) { // Multiple files uploaded
            files = req.files['files[]'];
        } else { // One file uploaded
            files.push(req.files['files[]']);
        }
        for (let i = 0; i < files.length; i += 1) {
            const file = files[i];
            const filename = uuidv4();
            file.ext = path.extname(file.name);
            file.newFilename = filenamePrefix + filename + file.ext;
            file.webLink = `${path.normalize(baseHref + webPath)}/${file.newFilename}`;
            const destinationFile = `${uploadPath}${file.newFilename}`;
            allPromises.push(pathExists(uploadPath)
                .then(() => file.mv(destinationFile))
                .then(() => {
                    if (isImage(file)) {
                        file.thumbLink = `${path.normalize(baseHref + webPath)}/${file.newFilename}?w=100`;
                    }
                    delete file.data;
                    filesUploaded.push(file);
                })
                .then(() => {
                    if (isImage(file)) {
                        if (addGalleryImage) {
                            return addImgToFile(addToFile, `${path.normalize(webPath)}/${
                                file.newFilename}`, file.name);
                        }
                        return addMarkdownToFile(addToFile, `${path.normalize(baseHref + webPath)}/${
                            file.newFilename}?w=750`, file.name);
                    }
                    return false;
                }));
        }
    }

    Promise.all(allPromises)
        .then(() => {
            console.log('filesUploaded', filesUploaded);
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
