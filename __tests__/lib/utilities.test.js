const util = require('../../lib/utilities');

describe('utilities lib', () => {
    describe('Method tests', () => {
        describe('asInteger', () => {
            test('Should return as a number', () => {
                const input = '1';
                const expectedResult = 1;
                const result = util.asInteger(input);
                expect(result).toEqual(expectedResult);
            });
        });

        describe('isInteger', () => {
            test('Should return true when input is an integer', () => {
                const input = 1;
                const expectedResult = true;
                const result = util.isInteger(input);
                expect(result).toEqual(expectedResult);
            });
            test('Should return false when input is not an integer', () => {
                const input = 'f1';
                const expectedResult = false;
                const result = util.isInteger(input);
                expect(result).toEqual(expectedResult);
            });
        });

        describe('isPositiveInteger', () => {
            test('Should return true when input is a positive integer', () => {
                const input = 1;
                const expectedResult = true;
                const result = util.isPositiveInteger(input);
                expect(result).toEqual(expectedResult);
            });
            test('Should return false when input is not a positive integer', () => {
                const input = -1;
                const expectedResult = false;
                const result = util.isPositiveInteger(input);
                expect(result).toEqual(expectedResult);
            });
            test('Should return false when input is a string', () => {
                const input = 'minus 1';
                const expectedResult = false;
                const result = util.isPositiveInteger(input);
                expect(result).toEqual(expectedResult);
            });
        });

        describe('mongoSanitize', () => {
            test('Should return a sanitized mongo object from a string input', () => {
                const input = 'foo bar';
                const expectedResult = 'foo bar';
                const result = util.mongoSanitize(input);
                expect(result).toEqual(expectedResult);
            });
            test('Should return a sanitized mongo object from an object input', () => {
                const input = { foo: 'bar' };
                const expectedResult = { foo: 'bar' };
                const result = util.mongoSanitize(input);
                expect(result).toEqual(expectedResult);
            });
            test('Should return a sanitized mongo object from an invalid object input', () => {
                const input = { foo: 'bar', $set: { foo: 'gomle' } };
                const expectedResult = { foo: 'bar' };
                const result = util.mongoSanitize(input);
                expect(result).toEqual(expectedResult);
            });
        });

        describe('makeSearchObject', () => {
            test('Should return a query object we can send to mongo.find with string only', () => {
                const input = 'foo bar';
                const expectedResult = {
                    "$and": [
                        {
                            "$or": [
                                {"title": {"$options": "i", "$regex": "foo"}},
                                {"body": {"$options": "i", "$regex": "foo"}}
                            ]
                        },
                        {
                            "$or": [
                                {"title": {"$options": "i", "$regex": "bar"}},
                                {"body": {"$options": "i", "$regex": "bar"}}
                            ]
                        }
                    ]
                };
                const result = util.makeSearchObject(input, ['title', 'body']);
                expect(result).toEqual(expectedResult);
            });
            test('Should return a query object we can send to mongo.find with string and int', () => {
                const input = 'foo 22';
                const expectedResult = {
                    "$and": [
                        {
                            "$or": [
                                {"title": {"$options": "i", "$regex": "foo"}}
                            ]
                        },
                        {
                            "$or": [
                                {"title": {"$options": "i", "$regex": "22"}},
                                {"body": {"$eq": 22}}
                            ]
                        }
                    ]
                };
                const result = util.makeSearchObject(input, ['title'], ['body']);
                expect(result).toEqual(expectedResult);
            });
        });

    });
});
