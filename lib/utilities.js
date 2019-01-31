'use strict';

function utilities() {
    function asInteger(num) {
        return parseInt(num, 10);
    }

    function isInteger(num) {
        return Number.isInteger(num);
    }

    function isPositiveInteger(num) {
        return isInteger(num) && num > 0;
    }


    function mongoSanitize($input) {
        const input = $input;
        if (input instanceof Object) {
            const keys = Object.keys(input);
            for (let i = 0; i < keys.length; i += 1) {
                const key = keys[i];
                if (/^\$/.test(key)) {
                    delete input[key];
                }
            }
        }
        return input;
    }

    function makeSearchObject(searchQuery, searchFields = [], intSearchFields) {
        if (typeof searchQuery === 'undefined') {
            return {};
        }
        const searchWords = searchQuery.split(' ')
            .filter(word => (word.trim() !== ''));
        const searchObject = {};
        for (let h = 0; h < searchWords.length; h += 1) {
            const word = searchWords[h];
            const searchObj = {};
            for (let i = 0; i < searchFields.length; i += 1) {
                if (searchFields.hasOwnProperty(i)) {
                    const searchField = searchFields[i];
                    const searchElement = {};
                    searchElement[searchField] = { $regex: `${mongoSanitize(word)}`, $options: 'i' };
                    if (typeof searchObj.$or === 'undefined') {
                        searchObj.$or = [];
                    }
                    searchObj.$or.push(searchElement);
                }
            }
            if (typeof intSearchFields !== 'undefined') {
                const intNumber = parseInt(word, 10);
                if (typeof intNumber === 'number' && !isNaN(intNumber)) {
                    for (let i = 0; i < intSearchFields.length; i += 1) {
                        if (intSearchFields.hasOwnProperty(i)) {
                            const searchField = intSearchFields[i];
                            const searchElement = {};
                            searchElement[searchField] = { $eq: intNumber };
                            if (typeof searchObj.$or === 'undefined') {
                                searchObj.$or = [];
                            }
                            searchObj.$or.push(searchElement);
                        }
                    }
                }
            }
            if (typeof searchObject.$and === 'undefined') {
                searchObject.$and = [];
            }
            searchObject.$and.push(searchObj);
        }
        // console.log(JSON.stringify(searchObject, null, 4));
        return searchObject;
    }

    return {
        asInteger,
        isInteger,
        isPositiveInteger,
        mongoSanitize,
        makeSearchObject,
    };
 }

 module.exports = utilities();
