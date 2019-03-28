const myMongoose = require('../lib/class/mongoose');
const Article = require('../lib/class/article');

const OldArticle = require('../lib/article');
const OldArticleUtil = require('../lib/article-util');
const OldLogger = require('../lib/logger');

const fs = require('fs');
const im = require('imagemagick');
const path = require('path');
const appPath = `${__dirname}/../`;

const config = require(process.argv[2] || '../config/config-dist.js');
const photoPath = config.adapter.markdown.photoPath;

const oldArtUtil = new OldArticleUtil();
const logger = new OldLogger();
const oldArticle = new OldArticle({
    logger,
    photoPath,
    config,
});

const articlePath = oldArtUtil.getArticlePathRelative('/');
const articleKeys = {};

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

const main = async () => {
    await myMongoose.connectGlobal(config);
    const article = new Article();

    oldArticle.list(articlePath)
        .then(async (list) => {
            // console.log(list);
            for (let i = 0, l = list.length; i < l; i += 1) {
                const art = list[i];
                const newArt = {
                    status: 2,
                    filename: art.file,
                    author: art.author,
                    published: parseDate(art.published || '2000-01-01 00:00:00'),
                    tags: (art.tags && art.tags.split(', ')),
                    category: parsePath(art.baseHref),
                    title: art.title,
                    teaser: art.teaser,
                    youtube: art.youtube,
                    vimeo: art.vimeo,
                    ingress: art.ingress,
                    body: art.body,
                    img: art.img,
                    imgText: art.imgText,
                    titleParts: [],
                    teaserParts: [],
                    imgParts: [],
                    imgTextParts: [],
                    bodyParts: [],
                    colParts: [],
                };
                for (let j = 0, m = 10; j < m; j += 1) {
                    ['title', 'teaser', 'img', 'imgText', 'body', 'col'].map(part => {
                        if (art[`${part}${j}`]) {
                            newArt[`${part}Parts`].push(art[`${part}${j}`]);
                        }
                    });
                }

                if (Array.isArray(newArt.img)) {
                    for (let j = 0, m = newArt.img.length; j < m; j += 1) {
                        newArt.img[j] = {
                            src: newArt.img[j],
                            text: newArt.imgText[j],
                        };
                        const filename = `${photoPath}${newArt.img[j].src}`;
                        let exif;
                        if (filename.match(/(jpg|jpeg)/i)) {
                            exif = await readExif(filename);
                            newArt.img[j].exif = exif;
                        }
                        const filestats = await readFileInfo(filename);
                        newArt.img[j].stats = filestats;
                    }
                }

                if (art.imageObject) {
                    newArt.imageObject = {
                        author: art.imageObject.author,
                        name: art.imageObject.name,
                        description: art.imageObject.description,
                        keywords: (art.imageObject.keywords && art.imageObject.keywords.split(', ')),
                        contentUrl: art.imageObject.contentUrl,
                        published: parseDate(art.imageObject.published),
                        loc: {
                            type: 'Point',
                            coordinates: [parseFloat(art.imageObject.lon), parseFloat(art.imageObject.lat)],
                        },
                        camera: art.imageObject.camera,
                        lens: art.imageObject.lens,
                        shutter: art.imageObject.shutter,
                        focal: art.imageObject.focal,
                        aperture: art.imageObject.aperture,
                        iso: art.imageObject.iso,
                    };
                }
                console.log('newArt', newArt);
                await article.save(newArt);

                // const keys = Object.keys(art);
                // for (let j = 0, m = keys.length; j < m; j += 1) {
                //     const key = keys[j];
                //     if (typeof articleKeys[key] === 'undefined') {
                //         articleKeys[key] = 1;
                //     }
                //     articleKeys[key] += 1;
                // }
            }
            // console.log(articleKeys);
            await article.close();
        })
        .catch(error => console.error(error));

    // //
    // //
    // const myProduct = await article.findOne({
    //     id: 135,
    // });
    // console.log('myProduct', myProduct);
    //
    // myProduct.body = 'foobargomle';
    // await myProduct.save();
    // // await article.save(myProduct);
    // //
    // // // await article.save(myProduct);

};

main();
