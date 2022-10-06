'use strict';

const commander = require('commander');
const path = require('path');

const myMongoose = require('../../../../lib/class/mongoose');
const util = require('../../../../lib/utilities');
const Image = require('../../../../lib/class/image');
const Article = require('../../../../lib/class/article');
const ImageUtil = require('../../../../lib/class/image-util');

commander
    .usage('[options]')
    .option('-c, --config <file>', 'Configuration file path', '../../../../config/config.js')
    .option('-i, --imageid <image id>', 'Image id')
    .parse(process.argv);

if (!commander.imageid) {
    console.error('Missing --imageid');
    commander.help();
    process.exit();
}

const config = require(commander.config);
const photoPath = path.normalize(config.adapter.markdown.photoPath);
const skipAi = false;

const main = async () => {
    await myMongoose.connectGlobal(config);
    const image = new Image();
    const article = new Article();
    const imageUtil = new ImageUtil();
    // await imageUtil.loadModels();
    const imgObj = await image.findOne({ id: commander.imageid }, {});

    const filename = `${photoPath}${imgObj.src}`;
    console.log(`Analyzing image: ${filename}`);

    const imageInfo = await imageUtil.read(filename, skipAi, { config, img: imgObj });
    const updateImg = {
        id: imgObj.id,
        ...imageInfo,
    };
    console.log(`    > Updating image with info`);
    const img = await image.save(updateImg);

    // Update all articles with the same image.
    await article.rawUpdate({
        'img.src': img.src
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

    await myMongoose.closeAll();
};

main();
