const Article = require('../../../lib/class/article');

const config = {
    mongo: {
        url: 'mongodb://localhost:27017/simpleBlogTEST?safe=true&auto_reconnect=true&poolSize=20',
    },
};

const article = new Article(config);

beforeAll(async () => {
    console.log('beforeAll');
    await article.connect();
    await article.save({ title: 'test3', body: 'foobar' });
});

afterAll(async () => {
    console.log('afterAll');
    await article.dropCollection(true, 'yes-i-am-sure');
    await article.close();
});

describe('Article Class', async () => {
    describe('Method tests', async () => {

        test('Should save article, check content and delete it again', async () => {
            const result = await article.save({ title: 'test3', body: 'foobar' });
            expect(result.title).toEqual('test3');
            expect(result.body).toEqual('foobar');

            const result2 = await article.save({ id: result.id, title: 'test4' });
            expect(result2.title).toEqual('test4');

            const result3 = await article.delete({ id: result.id });
            expect(result3).toEqual(true);
        });

        test('Should load 1 article as object', async () => {
            const result = await article.findOne({});
            expect(typeof result === 'object' && !Array.isArray(result)).toBeTruthy();
        });

        test('Should load articles as an array of objects', async () => {
            const result = await article.find({}, {}, { limit: 1 });
            expect(Array.isArray(result)).toBeTruthy();
        });

        test('Should search and return articles as an array of objects', async () => {
            const result = await article.search('test', {}, { limit: 1 });
            expect(Array.isArray(result)).toBeTruthy();
        });
    });
});
