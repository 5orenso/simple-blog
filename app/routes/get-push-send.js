/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const webpush = require('web-push');

const { routeName, routePath, run, webUtil } = require('../middleware/init')({ __filename, __dirname });

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
    const { hrstart, runId } = run(req);

    const notificationPath = path.normalize(req.config.adapter.markdown.notificationPath);

    // /push-register
    // A real world application would store the subscription info.
    const notification = {
        title: req.query.title,
        body: req.query.body,
        icon: req.query.icon,
        url: req.query.url,
    };

    if (req.session.email) {
        findAllFiles(notificationPath)
            .then(files => Promise.all(files.map(file => sendNotifications(req.config,
                `${notificationPath}${file}`, notification))))
            .then((results) => {
                webUtil.logFunctionTimer({ runId, routePath, routeName, hrstart }, req);
                res.status(201).send('Push notifications sent to: ', JSON.stringify(results));
            })
            .catch((error) => {
                console.error(error);
                res.status(406).send(error);
            });
    } else {
        webUtil.logFunctionTimer({ runId, routePath, routeName, hrstart }, req);
        res.sendStatus(201);
    }
};
