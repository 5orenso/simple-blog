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
    if (file.mimetype.match(/^image\/(jpeg|png|gif)/i)) {
        return true;
    }
    return false;
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
            file.s3Link = `${s3BaseHref}/${file.newFilename}`;
            const tmpFile = `/tmp/${file.newFilename}`;
            allPromises.push(file.mv(tmpFile)
                .then(async () => {
                    if (isImage(file)) {
                        file.s3ThumbLink = `${s3imageThumbBaseHref}/80x80/${file.newFilename}`;
                        file.s3XSmallLink = `${s3imageThumbBaseHref}/150x/${file.newFilename}`;
                        file.s3SmallLink = `${s3imageThumbBaseHref}/220x/${file.newFilename}`;
                        file.s3MediumLink = `${s3imageThumbBaseHref}/400x/${file.newFilename}`;
                        file.s3LargeLink = `${s3imageThumbBaseHref}/800x/${file.newFilename}`;
                        file.s3XLargeLink = `${s3imageThumbBaseHref}/1024x/${file.newFilename}`;
                        file.s3XXLargeLink = `${s3imageThumbBaseHref}/1280x/${file.newFilename}`;
                        file.s33XLargeLink = `${s3imageThumbBaseHref}/1600x/${file.newFilename}`;
                        file.s34XLargeLink = `${s3imageThumbBaseHref}/1920x/${file.newFilename}`;
                    }
                    delete file.data;

                    const stats = fs.statSync(tmpFile);
                    const fileSizeInBytes = stats.size;
                    file.bytes = fileSizeInBytes;

                    if (isImage(file)) {
                        file.dimensions = await imageDimensions(tmpFile);
                        file.exif = await readExif(tmpFile);
                        file.color = await ColorThief.getColor(tmpFile);
                        file.palette = await ColorThief.getPalette(tmpFile, 10);

                        file.hsv = util.rgb2hsv(file.color[0], file.color[1], file.color[2]);
                        file.hsvPalette = [];
                        if (file.palette) {
                            for (let j = 0, m = file.palette.length; j < m; j += 1) {
                                const color = file.palette[j];
                                file.hsvPalette.push(util.rgb2hsv(color[0], color[1], color[2]));
                            }
                        }
                        file.src = `${fileCategory}/${file.newFilename}`;
                    }

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
