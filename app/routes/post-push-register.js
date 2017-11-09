/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const routeName = __filename.slice(__dirname.length + 1, -3);
const routePath = __dirname.replace(/.+\/routes/, '');
const webUtil = require('../../lib/web-util');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const crypto = require('crypto');

function pathExists(absolutePath) {
    return new Promise((resolve, reject) => {
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
}

function writeToFile(absoluteFilename, data) {
    return new Promise((resolve, reject) => {
        fs.exists(absoluteFilename, (exists) => {
            if (exists) {
                resolve(false);
            } else {
                fs.writeFile(absoluteFilename, data, 'utf8', (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(true);
                });
            }
        });
    });
}

module.exports = (req, res) => {
    const hrstart = process.hrtime();
    webUtil.printIfDev(`Route: ${routePath}/${routeName}`, req.query, req.param, req.body);

    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(req.body));
    const notificationPath = path.normalize(req.config.adapter.markdown.notificationPath);
    const filename = `${notificationPath}${hash.digest('hex')}`;

    pathExists(notificationPath)
        .then(() => writeToFile(filename, JSON.stringify(req.body)))
        .then(() => {
            webUtil.logFunctionTimer(`router${routePath}`, routeName, req.path, process.hrtime(hrstart));
            res.status(201).send(JSON.stringify({ data: { success: true } }));
        });
};
