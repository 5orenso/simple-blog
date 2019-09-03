'use strict';

const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

class S3 {
    constructor(config) {
        this.config = config;
    }
    
    static upload(bucket, filename, contentType, targetFolder = '') {
        return new Promise((resolve, reject) => {
            const hrstart = process.hrtime();
            const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'eu-west-1' });
            fs.readFile(filename, (fsError, fsData) => {
                if (fsError) {
                    reject(fsError);
                }
                let targetFile = path.basename(filename);
                if (targetFolder !== '') {
                    targetFile = `${targetFolder}/${targetFile}`;
                }
                const params = {
                    Bucket: bucket,
                    Key: `${targetFile}`,
                    Body: fsData,
                    ContentType: contentType,
                };
                s3.upload(params, (s3Error, s3Data) => {
                    if (s3Error) {
                        console.error(s3Error);
                        return reject(s3Error);
                    }
                    return resolve(s3Data);
                });
            });
        });
    }

    static download(bucket, downloadFile, downloadTo) {
        return new Promise((resolve, reject) => {
            const s3 = new AWS.S3();
            const params = {
                Bucket: bucket,
                Key: downloadFile,
            };
            const file = fs.createWriteStream(downloadTo);
            s3.getObject(params).createReadStream().pipe(file);
            file.on('error', (err) => {
                reject(err);
            });
            file.on('close', () => {
                resolve();
            });
        });
    }

    static listFiles(bucket, prefix) {
        return new Promise((resolve, reject) => {
            const s3 = new AWS.S3();
            const params = {
                Bucket: bucket,
                Prefix: prefix,
            };
            s3.listObjects(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}

module.exports = S3;
