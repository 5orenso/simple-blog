const myMongoose = require('../lib/class/mongoose');
const Image = require('../lib/class/image');
const Article = require('../lib/class/article');
const ImageUtil = require('../lib/class/image-util');

const fs = require('fs');
const path = require('path');

const config = require(process.argv[2] || '../config/config-dist.js');
const skipAi = process.argv[3] ? true : false;
const photoPath = path.normalize(config.adapter.markdown.photoPath);

const { promisify } = require('util');
const { resolve } = require('path');

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
    const article = new Article();
    const imageUtil = new ImageUtil();
    await imageUtil.loadModels();

    // Load all images from db:
    const imglist = await image.find({}, {}, { limit: 5000 });
    const imgRef = {};
    for (let i = 0, l = imglist.length; i < l; i += 1) {
        const img = imglist[i];
        imgRef[img.src] = img;
    }
    console.log('Searching for images inside photoPath:', photoPath);

    const files = await getFiles(photoPath);
    for (let i = 0, l = files.length; i < l; i += 1) {
        const filename = files[i];
        const src = `${filename.replace(photoPath, '')}`;

        if (imgRef[src]) {
            // Image already exists inside db. Only run updates and save.
            console.log(`Image already exists.: ${filename}`);
            let needsUpdate = false;
            const requiredFields = ['predictions', 'predictionsCocoSsd', 'features', 'stats', 'faceDetections'];
            for (let i = 0, l = requiredFields.length; i < l; i += 1) {
                const field = requiredFields[i];
                if (!imgRef[src][field]) {
                    needsUpdate = true;
                    console.log(`    > Missing info in field: ${field}`);
                }
            }

            // Checking for geo
            const field = 'geo';
            if (imgRef[src].exif && imgRef[src].exif.lat && imgRef[src].exif.lng && !imgRef[src][field]) {
                needsUpdate = true;
                console.log(`    > Missing info in field: ${field}`);
            }

            if (needsUpdate) {
                const imageInfo = await imageUtil.read(filename, skipAi, { config, img: imgRef[src] });
                const updateImg = {
                    id: imgRef[src].id,
                    ...imageInfo,
                };
                console.log(`    > Updating image with info:`, updateImg);
                await image.save(updateImg);

                // Update all articles with the same image.
                await article.rawUpdate({
                    'img.src': src
                }, {
                    $set: {
                        'img.$.exif': img.exif,
                        'img.$.geo': img.geo,
                        'img.$.stats': img.stats,
                        'img.$.features': img.features,
                        'img.$.predictions': img.predictions,
                        'img.$.predictionsCocoSsd': img.predictionsCocoSsd,
                        'img.$.faceDetections': img.faceDetections,
                    }
                });
            }
        } else {
            console.log(`New Image: ${filename}`);
            const imageInfo = await imageUtil.read(filename, false, { config });
            const newImg = {
                src,
                ...imageInfo,
            };
            console.log(`    > Saving image with info:`, newImg);
            await image.save(newImg);
        }
    }
    await myMongoose.closeAll();
};

main();
