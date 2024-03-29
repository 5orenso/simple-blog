/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const im = require('imagemagick');
const jpeg = require('jpeg-js');
const request = require('request');

global.fetch = require('node-fetch');

// const tf = require('@tensorflow/tfjs');
// const mobilenet = require('@tensorflow-models/mobilenet');
// const cocoSsd = require('@tensorflow-models/coco-ssd');
// const faceapi = require('face-api.js');

const util = require('../utilities');

const appPath = `${__dirname}/../../`;

const NUMBER_OF_CHANNELS = 3

class ImageUtilities {
    constructor() {
        this.model;
        this.modelCocoSsd;

        this.imageRaw = {};
        this.image = {};
    }

    // Load Tensorflow models
    // async loadModels() {
    //     try {
    //         this.model = await mobilenet.load(2, 1);
    //         this.modelCocoSsd = await cocoSsd.load();
    //         // console.log(faceapi.nets);
    //         await faceapi.nets.ssdMobilenetv1.loadFromDisk(`${appPath}lib/models`);
    //         await faceapi.nets.faceLandmark68Net.loadFromDisk(`${appPath}lib/models`);
    //         await faceapi.nets.faceRecognitionNet.loadFromDisk(`${appPath}lib/models`);
    //         await faceapi.nets.faceExpressionNet.loadFromDisk(`${appPath}lib/models`);
    //     } catch (error) {
    //         console.error('loadModels.error:', error);
    //     }
    // }

    readImage(path, forceLoad) {
        if (this.imageRaw.pixels && !forceLoad) {
            return this.imageRaw.pixels;
        }
        const buf = fs.readFileSync(path);
        const pixels = jpeg.decode(buf, true);
        this.imageRaw.pixels = pixels;
        return pixels;
    }

    static imageByteArray(image, numChannels) {
        const pixels = image.data
        const numPixels = image.width * image.height;
        const values = new Int32Array(numPixels * numChannels);

        for (let i = 0; i < numPixels; i++) {
            for (let channel = 0; channel < numChannels; ++channel) {
                values[i * numChannels + channel] = pixels[i * 4 + channel];
            }
        }
        return values;
    }

    // imageToInput(image, numChannels, forceLoad) {
    //     if (this.imageRaw.input && !forceLoad) {
    //         return this.imageRaw.input;
    //     }
    //     const values = ImageUtilities.imageByteArray(image, numChannels);
    //     const outShape = [image.height, image.width, numChannels];
    //     const input = tf.tensor3d(values, outShape, 'int32');
    //     this.imageRaw.input = input;
    //     return input;
    // }

    // Tensorflow MobileNet
    // async classify(path, forceLoad = false) {
    //     try {
    //         const image = this.readImage(path, forceLoad)
    //         const input = this.imageToInput(image, NUMBER_OF_CHANNELS, forceLoad)
    //         // const model = await loadModel();
    //         const predictions = await this.model.classify(input);
    //         // const mn_model = await loadModel(model)
    //         // const predictions = await mn_model.classify(input)
    //         // console.log('classification results:', predictions)
    //         this.image.predictions = predictions;
    //         return predictions;
    //     } catch (error) {
    //         console.error('classify.error:', error);
    //     }
    // }

    // Tensorflow Coco Ssd
    // async classifyCocoSsd(path, forceLoad = false) {
    //     try {
    //         const image = this.readImage(path, forceLoad)
    //         const input = this.imageToInput(image, NUMBER_OF_CHANNELS, forceLoad)
    //         const predictionsCocoSsd = await this.modelCocoSsd.detect(input);
    //         this.image.predictionsCocoSsd = predictionsCocoSsd;
    //         return predictionsCocoSsd;
    //     } catch (error) {
    //         console.error('classifyCocoSsd.error:', error);
    //     }
    // }

    // Tensorflow faceapi
    // async detectAllFaces(path, forceLoad = false) {
    //     try {
    //         const image = this.readImage(path, forceLoad);
    //         const input = this.imageToInput(image, NUMBER_OF_CHANNELS, forceLoad);
    //         const faceDetections = await faceapi.detectAllFaces(input).withFaceExpressions().withFaceLandmarks().withFaceDescriptors();
    //         this.image.faceDetections = faceDetections;
    //         return faceDetections;
    //     } catch (error) {
    //         console.error('detectAllFaces.error:', error);
    //     }
    // }

//     /* compute the mean value of the euclidean distances of the input descriptor */
// /* to each of the face descriptors, which the recognizer has been trained on, */
// /* this is used as the metric to judge how similar the faces are to the training data*/
// function computeMeanDistance(descriptors, inputDescriptor) {
//   return round(
//     descriptors
//       .map(d => fr.distance(d, inputDescriptor))
//       .reduce((d1, d2) => d1 + d2, 0)
//         / descriptors.length || 1
//   )
// }

    static convertDMSToDD(degrees, minutes, seconds, direction) {
        const dd = degrees + minutes / 60 + seconds / (60 * 60);
        if (direction === 'S' || direction === 'W') {
            dd = dd * -1;
        } // Don't do anything for N or E
        return dd;
    }

    // ImageMagick
    static convertToJpeg(filename) {
        return new Promise((resolve, reject) => {
            const fileInfo = path.parse(filename);
            // Returns:
            // { root: '/',
            //   dir: '/home/user/dir',
            //   base: 'file.txt',
            //   ext: '.txt',
            //   name: 'file' }
            const fileJpeg = `${fileInfo.dir}/${fileInfo.name}.jpg`;
            const convertOpt = [
                filename,
                '-flatten',
                '-depth', '8',
                '-quality', '100',
                '-density', '72',
                '-units', 'PixelsPerInch',
                fileJpeg,
            ];
            im.convert(convertOpt, (err, stdout) => {
                if (err) {
                    return reject(err);
                }
                // console.log('stdout:', stdout);
                resolve(fileJpeg);
            });
        });
    }

    readFeatures(file) {
        return new Promise((resolve, reject) => {
            im.identify(file, (err, features) => {
                if (err) {
                    return reject(err);
                }
                this.image.features = features;
                return resolve(features);
            });
        });
    }

    readExif(file) {
        return new Promise((resolve, reject) => {
            const fractionKeys = ['exposureTime'];
            im.readMetadata(file, (err, metadata) => {
                if (err) {
                    return reject(err);
                }
                if (typeof metadata.exif === 'object') {
                    const keys = Object.keys(metadata.exif);
                    for (let i = 0, l = keys.length; i < l; i += 1) {
                        const key = keys[i];
                        const val = metadata.exif[key];
                        if (typeof val === 'string') {
                            if (val.match(/^\d+\/\d+$/)) {
                                metadata.exif[key] = eval(val);
                            }
                            if (fractionKeys.indexOf(key) != -1) {
                                metadata.exif[key] = `1/${Math.round(1 / metadata.exif[key])}`;
                            }
                        }
                    }
                }

                if (metadata.exif && metadata.exif.gpsLatitude) {
                    const latParts = metadata.exif.gpsLatitude.split(/, /).map(val => eval(val));
                    metadata.exif.lat = ImageUtilities.convertDMSToDD(latParts[0], latParts[1], latParts[2],
                        metadata.exif.gpsLatitudeRef);

                    // gpsLongitude: "29/1, 18/1, 4090/100"
                    // gpsLongitudeRef: "E"
                    const lngParts = metadata.exif.gpsLongitude.split(/, /).map(val => eval(val));
                    metadata.exif.lng = ImageUtilities.convertDMSToDD(lngParts[0], lngParts[1], lngParts[2],
                        metadata.exif.gpsLongitudeRef);
                }
                this.image.exif = metadata.exif;
                return resolve(metadata.exif);
            });
        });
    }

    readFileStats(file) {
        return new Promise((resolve, reject) => {
            fs.stat(file, (err, stats) => {
                if (err) {
                    return reject(err);
                }
                this.image.stats = stats;
                resolve(stats);
            });
        });
    }

    reverseGeocode(config, lat, lon) {
        if (!config) {
            return false;
        }
        return new Promise((resolve, reject) => {
            const apiServer = `https://eu1.locationiq.com/v1/reverse.php?key=${config.locationiq_com.apiKey}`;
            const qs = `&lat=${lat}&lon=${lon}&format=json&accept-language=nb`;
            request(`${apiServer}${qs}`, (error, response, body) => {
                if (error) {
                    return reject(error);
                }
                this.image.geo = JSON.parse(body);
                return resolve(body);
            });
        });
    }

    async read($filename, disableAi = false, opt) {
        this.image = {};
        this.imageRaw = {};
        let filename = $filename;
        if (filename.match(/(png|gif|tif)/i)) {
            filename = await ImageUtilities.convertToJpeg(filename);
        }
        if (filename.match(/(jpg|jpeg)/i)) {
            // if (!disableAi) {
            //     await this.classify(filename);
            //     await this.classifyCocoSsd(filename);
            //     await this.detectAllFaces(filename);
            // }
            await this.readExif(filename);
            await this.readFeatures(filename);
            await this.readFileStats(filename);
            if (util.isDefined(this, 'image', 'exif', 'lat') && util.isDefined(this, 'image', 'exif', 'lng')) {
                if (!util.isDefined(opt, 'img', 'geo', 'place_id')) {
                    await this.reverseGeocode(opt.config, this.image.exif.lat, this.image.exif.lng);
                }
            }
            return this.image;
        }
    }

}

module.exports = ImageUtilities;
