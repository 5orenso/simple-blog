const MongooseHelper = require('../../../../lib/class/mongoose');
const getArticleRoute = require('../../../../app/routes/v2/get-article.js');

const config = {
    mongo: {
        url: 'mongodb://localhost:27017/simpleBlogTEST?safe=true&auto_reconnect=true&poolSize=20',
    },
};

const req = {
    params: {
        category: 'test',
    },
    query: {},
    session: {},
    config: {},
    originalUrl: '/test'
};

beforeAll(async () => {
    console.log('beforeAll');
    await MongooseHelper.connectGlobal(config);
});

afterAll(async () => {
    console.log('afterAll');
    await MongooseHelper.closeAll();
});

describe('get-article route', async () => {

    test('Should save article, check content and delete it again', async () => {
        let resultStatusCode;
        let resultHtml;
        const res = {
            status: (statusCode) => {
                resultStatusCode = statusCode;
                return {
                    send: (htmlContent) => {
                        resultHtml = htmlContent;
                    }
                }
            }
        };
        await getArticleRoute(req, res);
        console.log(resultStatusCode);
        expect(resultStatusCode).toEqual(200);
        expect(resultHtml).toMatch(/<html/);
        expect(resultHtml).toMatch(/<body/);
    });

});
