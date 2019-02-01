const myMongoose = require('../../../lib/class/mongoose');
const Article = require('../../../lib/class/article');

const article = new Article();

const config = {
    mongo: {
        url: 'mongodb://localhost:27017/simpleBlogTEST?safe=true&auto_reconnect=true&poolSize=20',
    },
};

beforeAll(async () => {
    await myMongoose.init(config);
    await article.save({ title: 'test3', body: 'foobar' });
});

afterAll(async () => {
    await myMongoose.close();
});

describe('Article Class', () => {
    describe('Method tests', () => {

        test('Should save article, check content and delete it again', async () => {
            return await article.save({ title: 'test3', body: 'foobar' })
                .then((result) => {
                    // console.log('article.save.result', result);
                    expect(result.title).toEqual('test3');
                    expect(result.body).toEqual('foobar');

                    return article.save({ id: result.id, title: 'test4' });
                })
                .then((result) => {
                    expect(result.title).toEqual('test4');
                    return article.delete({ id: result.id });
                })
                .then((result) => {
                    // console.log('article.delete.result', result);
                    expect(result).toEqual(true);
                })
        });

        test('Should load 1 article as object', async () => {
            return await article.findOne({})
               .then((result) => {
                   // console.log('article.findOne.result', result);
                   expect(typeof result === 'object' && !Array.isArray(result)).toBeTruthy();
               })
        });

        test('Should load articles as an array of objects', async () => {
            return await article.find({}, {}, { limit: 1 })
               .then((result) => {
                   // console.log('article.find.result', result);
                   expect(Array.isArray(result)).toBeTruthy();
               });
        });

        test('Should search and return articles as an array of objects', async () => {
            return await article.search('test', {}, { limit: 1 })
               .then((result) => {
                   // console.log('article.search.result', result);
                   expect(Array.isArray(result)).toBeTruthy();
               });
        });
    });
});
