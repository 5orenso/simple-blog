/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014-2019 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const crypto = require('crypto');

const { routeName, routePath, run, webUtil } = require('../middleware/init')({ __filename, __dirname });

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
    const { hrstart, runId } = run(req);

    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(req.body));
    const notificationPath = path.normalize(req.config.adapter.markdown.notificationPath);
    const filename = `${notificationPath}${hash.digest('hex')}`;

    pathExists(notificationPath)
        .then(() => writeToFile(filename, JSON.stringify(req.body)))
        .then(() => {
            webUtil.logFunctionTimer({ runId, routePath, routeName, hrstart }, req);
            res.status(201).send(JSON.stringify({ data: { success: true } }));
        });
};
