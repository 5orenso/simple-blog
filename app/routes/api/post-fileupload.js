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
const Image = require('../../../lib/class/image');
const ImageUtil = require('../../../lib/class/image-util');

const filenamePrefix = 'simpleBlog-';

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

    const imageUtil = new ImageUtil();
    // await imageUtil.loadModels();

    const photoPath = util.returnString(req, 'config', 'adapter', 'markdown', 'photoPath');

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

            const tmpPath = path.normalize(`${photoPath}${req.query.category || 'no-category'}/${req.query.title || 'no-title'}`);
            const tmpFile = `${tmpPath}/${file.newFilename}`;
            await pathExists(tmpPath);
            await file.mv(tmpFile);

            file.src = `${req.query.category}/${req.query.title}/${file.newFilename}`;
            delete file.data;

            const imageInfo = await imageUtil.read(tmpFile, true);
            const fileData = { ...file, ...imageInfo };

            const image = new Image();
            await image.save(fileData);
            filesUploaded.push(fileData);
        }
    }

    const data = {
        filesUploaded,
    };

    utilHtml.renderApi(req, res, 201, data);
};
