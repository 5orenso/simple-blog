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
const { spawn } = require('child_process');

const { routeName, routePath, run, util, webUtil, utilHtml } = require('../../middleware/init')({ __filename, __dirname });
const Image = require('../../../lib/class/image');
const ImageUtil = require('../../../lib/class/image-util');

const filenamePrefix = 'simpleBlog-';

function pathExists(absolutePath) {
    return new Promise((resolve, reject) => {
        // console.log('absolutePath', absolutePath);
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

            const imageInfo = await imageUtil.read(tmpFile, true, { config: req.config });
            const fileData = { ...file, ...imageInfo };

            const image = new Image();
            const imageObject = await image.save(fileData);
            filesUploaded.push(fileData);

            // console.log('__filename, __dirname', __filename, __dirname);
            // console.log('spawning:', 'node', [`${__dirname}/fileupload/process-image.js`, '--imageid', imageObject.id]);
            // console.log(process.env);
            // console.log(process.argv);
            let configFile = process.argv[3];
            if (configFile.match(/^\./)) {
                configFile = path.normalize(`${__dirname}/../../${process.argv[3]}`);
            }
            // console.log(configFile);
            const child = spawn('node', [
                './fileupload/process-image.js',
                '--imageid', imageObject.id,
                '--config', configFile,
            ], {
                detached: true,
                stdio: 'ignore',
                cwd: __dirname,
            });
            // child.stdout.on('data', (data) => {
            //     console.log(`child stdout:\n${data}`);
            // });
            // child.stderr.on('data', (data) => {
            //     console.log(`stderr: ${data}`);
            // });
            // child.on('close', (code) => {
            //     console.log(`child process exited with code ${code}`);
            // });
            child.unref();
        }
    }

    const data = {
        filesUploaded,
    };

    utilHtml.renderApi(req, res, 201, data);
};
