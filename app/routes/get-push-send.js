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
const webpush = require('web-push');

function findAllFiles(filePath) {
    return new Promise((resolve, reject) => {
        fs.readdir(filePath, (err, files) => {
            if (err) {
                reject(err);
            }
            resolve(files);
        });
    });
}

function sendNotifications(config, filename, notification) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            try {
                const notificationOpt = JSON.parse(data);
                webpush.setGCMAPIKey(config.push.gcmApiKey);
                const subject = config.push.subject;
                const publicKey = config.push.vapidKeys.publicKey;
                const privateKey = config.push.vapidKeys.privateKey;
                webpush.setVapidDetails(subject, publicKey, privateKey);
                const pushSubscription = {
                    endpoint: notificationOpt.endpoint,
                    keys: {
                        auth: notificationOpt.authSecret,
                        p256dh: notificationOpt.key,
                    },
                };
                return webpush.sendNotification(pushSubscription, JSON.stringify(notification))
                    .then(result => resolve(result))
                    .catch(error => reject(error));
            } catch (e) {
                return reject(e);
            }
        });
    });
}

module.exports = (req, res) => {
    const hrstart = process.hrtime();
    webUtil.printIfDev(`Route: ${routePath}/${routeName}`, req.query, req.param, req.body);

    const notificationPath = path.normalize(req.config.adapter.markdown.notificationPath);

    // /push-register
    // A real world application would store the subscription info.
    console.log('==> GET /push-send', req.query, req.body);
    const notification = {
        title: req.query.title,
        body: req.query.body,
        icon: req.query.icon,
        url: req.query.url,
    };
    console.log('==> GET /push-send.notification', notification);

    if (req.session.email) {
        findAllFiles(notificationPath)
            .then(files => Promise.all(files.map(file =>
                sendNotifications(req.config, `${notificationPath}${file}`, notification))))
            .then((results) => {
                // console.log('results', results);
                webUtil.logFunctionTimer(`router${routePath}`, routeName, req.path, process.hrtime(hrstart));
                res.status(201).send('Push notifications sent to: ', JSON.stringify(results));
            })
            .catch((error) => {
                console.error(error);
                res.status(406).send(error);
            });
    } else {
        webUtil.logFunctionTimer(`router${routePath}`, routeName, req.path, process.hrtime(hrstart));
        res.sendStatus(201);
    }
};
