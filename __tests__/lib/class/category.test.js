const Category = require('../../../lib/class/category');

const config = {
    mongo: {
        url: 'mongodb://localhost:27017/simpleBlogTEST?safe=true&auto_reconnect=true&poolSize=20',
    },
};

const category = new Category(config);

beforeAll(async () => {
    console.log('beforeAll');
    await category.connect();
    await category.save({ title: 'test3', url: 'foobar' });
});

afterAll(async () => {
    console.log('afterAll');
    await category.dropCollection(true, 'yes-i-am-sure');
    await category.close();
});

describe('Category Class', async () => {
    describe('Method tests', async () => {

        test('Should save category, check content and delete it again', async () => {
            const result = await category.save({ title: 'test3', url: '/foobar' })
            expect(result.title).toEqual('test3');
            expect(result.url).toEqual('/foobar');

            const result2 = await category.save({ id: result.id, title: 'test4' });
            expect(result2.title).toEqual('test4');

            const result3 = await category.delete({ id: result.id });
            expect(result3).toEqual(true);
        });

        test('Should load 1 category as object', async () => {
            const result = await category.findOne({});
            expect(typeof result === 'object' && !Array.isArray(result)).toBeTruthy();
        });

        test('Should load categorys as an array of objects', async () => {
            const result = await category.find({}, {}, { limit: 1 });
            expect(Array.isArray(result)).toBeTruthy();
        });

        test('Should search and return categorys as an array of objects', async () => {
            const result = await category.search('test', {}, { limit: 1 });
            expect(Array.isArray(result)).toBeTruthy();
        });
    });
});
