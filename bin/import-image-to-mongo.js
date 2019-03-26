const myMongoose = require('../lib/class/mongoose');
const Image = require('../lib/class/image');

const fs = require('fs');
const im = require('imagemagick');
const path = require('path');
const appPath = `${__dirname}/../`;

const config = require(process.argv[2] || '../config/config-dist.js');
const photoPath = path.normalize(config.adapter.markdown.photoPath);

// Tensorflow shit
const tf = require('@tensorflow/tfjs')
// require('@tensorflow/tfjs-node')

global.fetch = require('node-fetch');
const mobilenet = require('@tensorflow-models/mobilenet');
const cocoSsd = require('@tensorflow-models/coco-ssd');

let model;
let modelCocoSsd;

// const fs = require('fs');
const jpeg = require('jpeg-js');

const NUMBER_OF_CHANNELS = 3

const readImage = path => {
    const buf = fs.readFileSync(path)
    const pixels = jpeg.decode(buf, true)
    return pixels
}

const imageByteArray = (image, numChannels) => {
    const pixels = image.data
    const numPixels = image.width * image.height;
    const values = new Int32Array(numPixels * numChannels);

    for (let i = 0; i < numPixels; i++) {
        for (let channel = 0; channel < numChannels; ++channel) {
            values[i * numChannels + channel] = pixels[i * 4 + channel];
        }
    }
    return values
}

const imageToInput = (image, numChannels) => {
    const values = imageByteArray(image, numChannels)
    const outShape = [image.height, image.width, numChannels];
    const input = tf.tensor3d(values, outShape, 'int32');
    return input
}

// const loadModel = async () => {
//     const mn = new mobilenet.MobileNet(1, 1);
//     mn.path = './mobilenet-model.json';
//     await mn.load({
//         version: 1,
//     });
//     return mn;
// }
//
// const loadModelCocoSsd = async () => {
//     const model = await cocoSsd.load();
//     return model;
// }

const classify = async (path) => {
    const image = readImage(path)
    const input = imageToInput(image, NUMBER_OF_CHANNELS)
    // const model = await loadModel();
    const predictions = await model.classify(input);
    // const mn_model = await loadModel(model)
    // const predictions = await mn_model.classify(input)
    // console.log('classification results:', predictions)
    return predictions;
}

const classifyCocoSsd = async (path) => {
    const image = readImage(path)
    const input = imageToInput(image, NUMBER_OF_CHANNELS)
    const predictions = await modelCocoSsd.detect(input);
    return predictions;
}
// /Tensorflow shit



function parsePath(input) {
    let final = input.replace(/^\//, '');
    final = final.replace(/\/$/, '');
    return final;
}

function parseDate(input) {
    if (typeof input === 'undefined') {
        return new Date();
    }
    let newDate;
    try {
        newDate = Date.parse(input);
        console.log(input);

    } catch (error) {
        console.log(error);
        newDate = new Date();
    }
    return newDate;
}

function isImage(file) {
    if (file.mimetype.match(/^image\/(jpg|jpeg|png|gif)/i)) {
        return true;
    }
    return false;
}

function convertDMSToDD(degrees, minutes, seconds, direction) {
    const dd = degrees + minutes / 60 + seconds / (60 * 60);
    if (direction === 'S' || direction === 'W') {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}

function readExif(file) {
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
                metadata.exif.lat = convertDMSToDD(latParts[0], latParts[1], latParts[2],
                    metadata.exif.gpsLatitudeRef);

                // gpsLongitude: "29/1, 18/1, 4090/100"
                // gpsLongitudeRef: "E"
                const lngParts = metadata.exif.gpsLongitude.split(/, /).map(val => eval(val));
                metadata.exif.lng = convertDMSToDD(lngParts[0], lngParts[1], lngParts[2],
                    metadata.exif.gpsLongitudeRef);
            }
            return resolve(metadata.exif);
        });
    });
}

function readFileInfo(file) {
    return new Promise((resolve, reject) => {
        fs.stat(file, (err, stats) => {
            if (err) reject(err);
            resolve(stats);
        });
    });
}

function readDir(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                return reject(err);
            }
            return resolve(files);
        })
    });
}

const { promisify } = require('util');
const { resolve } = require('path');
// const fs = require('fs');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function getFiles(dir) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = resolve(dir, subdir);
        return (await stat(res)).isDirectory() ? getFiles(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []);
}

const main = async () => {
    await myMongoose.connectGlobal(config);
    const image = new Image();
    // Load all images from db:
    const imglist = await image.find({}, {}, { limit: 5000 });
    const imgRef = {};
    for (let i = 0, l = imglist.length; i < l; i += 1) {
        const img = imglist[i];
        imgRef[img.src] = img;
    }
    // Load AI:
    model = await mobilenet.load(2, 1);
    modelCocoSsd = await cocoSsd.load();

    console.log('photoPath', photoPath);

    const files = await getFiles(photoPath);
    for (let i = 0, l = files.length; i < l; i += 1) {
        const filename = files[i];
        const src = `${filename.replace(photoPath, '')}`;
        if (filename.match(/(jpg|jpeg)/i)) {
            if (imgRef[src]) {
                // Image already exists inside db. Only run updates and save.
                console.log(`Image already exists.: ${filename}`);
                let isUpdated = false;
                const updateImg = {
                    id: imgRef[src].id,
                };
                if (!imgRef[src].predictionsCocoSsd) {
                    isUpdated = true;
                    const predictionsCocoSsd = await classifyCocoSsd(filename);
                    updateImg.predictionsCocoSsd = predictionsCocoSsd;
                }
                if (!imgRef[src].predictions) {
                    isUpdated = true;
                    const predictions = await classify(filename);
                    updateImg.predictions = predictions;
                }
                if (isUpdated) {
                    console.log(updateImg);
                    await image.save(updateImg);
                }
            } else {
                console.log(`New Image: ${filename}`);
                const newImg = {
                    src,
                };
                const predictions = await classify(filename);
                const predictionsCocoSsd = await classifyCocoSsd(filename);
                const exif = await readExif(filename);
                const filestats = await readFileInfo(filename);
                newImg.predictions = predictions;
                newImg.predictionsCocoSsd = predictionsCocoSsd;
                newImg.exif = exif;
                newImg.stats = filestats;
                console.log(newImg);
                await image.save(newImg);
            }
        }
    }
    await image.close();
};

main();
