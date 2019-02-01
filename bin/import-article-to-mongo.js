const myMongoose = require('../lib/class/mongoose');
const Article = require('../lib/class/article');

const OldArticle = require('../lib/article');
const OldArticleUtil = require('../lib/article-util');
const OldLogger = require('../lib/logger');

const path = require('path');
const appPath = `${__dirname}/../`;
const photoPath = path.normalize(`${appPath}../content/images/`);

const config = require('../config/config-dist.js');
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

const article = new Article();

const main = async () => {
    await myMongoose.init(config);

    oldArticle.list(articlePath)
        .then(async (list) => {
            // console.log(list);
            for (let i = 0, l = list.length; i < l; i += 1) {
                const art = list[i];
                const newArt = {
                    filename: art.file,
                    author: art.author,
                    published: parseDate(art.published),
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
                // console.log('newArt', newArt);
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
            await myMongoose.close();
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
