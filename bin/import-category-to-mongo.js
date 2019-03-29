const config = require(process.argv[2] || '../config/config-dist.js');
const myMongoose = require('../lib/class/mongoose');
const Article = require('../lib/class/article');
const Category = require('../lib/class/category');


const main = async () => {
    await myMongoose.connectGlobal(config);
    const article = new Article();
    const category = new Category();

    const artlist = await article.find();

    const catRef = {};
    for (let i = 0, l = artlist.length; i < l; i += 1) {
        console.log(i, artlist[i]);
        const art = artlist[i];
        catRef[art.category] = 1;
    }
    const categories = Object.keys(catRef);
    for (let i = 0, l = categories.length; i < l; i += 1) {
        await category.save({
            title: categories[i],
            url: `/v2/${categories[i]}/`,
        });
    }

    await myMongoose.closeAll();
};

main();
