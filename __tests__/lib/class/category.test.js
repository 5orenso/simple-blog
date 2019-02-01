const myMongoose = require('../../../lib/class/mongoose');
const Category = require('../../../lib/class/category');

const config = {
    mongo: {
        url: 'mongodb://localhost:27017/simpleBlogTEST?safe=true&auto_reconnect=true&poolSize=20',
    },
};

const category = new Category();

beforeAll(async () => {
    await myMongoose.init(config);
    await category.save({ title: 'test3', url: 'foobar' });
});

afterAll(async () => {
    await category.dropCollection(true, 'yes-i-am-sure');
});

describe('Category Class', () => {
    describe('Method tests', () => {

        test('Should save category, check content and delete it again', async () => {
            return await category.save({ title: 'test3', url: '/foobar' })
                .then((result) => {
                    // console.log('category.save.result', result);
                    expect(result.title).toEqual('test3');
                    expect(result.url).toEqual('/foobar');

                    return category.save({ id: result.id, title: 'test4' });
                })
                .then((result) => {
                    expect(result.title).toEqual('test4');
                    return category.delete({ id: result.id });
                })
                .then((result) => {
                    // console.log('article.delete.result', result);
                    expect(result).toEqual(true);
                })
        });

        test('Should load 1 category as object', async () => {
            return await category.findOne({})
               .then((result) => {
                   // console.log('article.findOne.result', result);
                   expect(typeof result === 'object' && !Array.isArray(result)).toBeTruthy();
               })
        });

        test('Should load categorys as an array of objects', async () => {
            return await category.find({}, {}, { limit: 1 })
               .then((result) => {
                   // console.log('category.find.result', result);
                   expect(Array.isArray(result)).toBeTruthy();
               });
        });

        test('Should search and return categorys as an array of objects', async () => {
            return await category.search('test', {}, { limit: 1 })
               .then((result) => {
                   // console.log('category.search.result', result);
                   expect(Array.isArray(result)).toBeTruthy();
               });
        });
    });
});
