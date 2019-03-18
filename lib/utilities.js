'use strict';

const strftime = require('strftime');
const moment = require('moment');
const jwt = require('jsonwebtoken');

function utilities() {
    function getType(element) {
        return Object.prototype.toString.call(element);
    }

    function asArray(element) {
        console.log('asArray.element', element, typeof element, isString(element));
        if (isString(element)) {
            console.log('asArray.isString.element', element);
            return element.split(/, ?/).map(el => String(el));
        }
        return undefined;
    }

    function asInteger(num) {
        return parseInt(num, 10);
    }

    function isArray(element) {
        console.log('isArray.element', element);
        return Array.isArray(element);
    }

    function isInteger(num) {
        return Number.isInteger(num);
    }

    function isPositiveInteger(num) {
        return isInteger(num) && num > 0;
    }

    function isString(element) {
        if (getType(element) === '[object String]') {
            return true;
        }
        return false;
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

    function cleanObject($obj, opt = {}) {
        const obj = Object.assign({}, $obj);
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i += 1) {
            const idx = keys[i];
            if (obj.hasOwnProperty(idx)) {
                if (typeof obj[idx] === 'undefined' || obj[idx] === false) {
                    delete obj[idx];
                }
                if (opt.emptyIsUndefined && obj[idx] === '') {
                    delete obj[idx];
                }
                if (opt.zeroIsUndefined && obj[idx] === 0) {
                    delete obj[idx];
                }
                if (opt.zeroStringIsUndefined && obj[idx] === '0') {
                    delete obj[idx];
                }
                if (opt.nullIsUndefined && obj[idx] === null) {
                    delete obj[idx];
                }
            }
        }
        return obj;
    }

    function returnString($obj, ...$args) {
        let args = $args;
        if (Array.isArray(args[0])) {
            args = args[0];
        }
        // let args = Array.prototype.slice.call(arguments, 1);
        let obj = $obj;
        for (let i = 0; i < args.length; i += 1) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
                return false;
            }
            obj = obj[args[i]];
        }
        return obj;
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

    function restrict(req, res, next) {
        if (req.session.email) {
            next();
        } else if (req.user) {
            req.session.email = req.user.email;
            req.session.jwtUser = req.user;
            next();
        } else {
            if (typeof req.originalUrl === 'string' && !req.originalUrl.match(/(login|logout)/)) {
                req.session.originalUrl = req.originalUrl;
            }
            res.redirect('/login');
        }
    }

    function formatDate($isoDate) {
        const isoDate = $isoDate || strftime('%Y-%m-%d');
        let format = '%b %e';
        const currentYear = strftime('%Y');
        const thisYear = strftime('%Y', new Date(Date.parse(isoDate)));
        if (currentYear > thisYear) {
            format = '%b %e, %Y';
        }
        return strftime(format, new Date(Date.parse(isoDate)));
    }

    function substring(input, start, end) {
        return input.substring(start, end);
    }

    function fixFilename(filename) {
        return filename.replace(/^_/, '');
    }

    function removeLineBreaks(content) {
        if (typeof content === 'string') {
            return content.replace(/(\n|\r)+/g, ' ');
        }
        return content;
    }

    function match($string, $match) {
        const regexp = new RegExp($match);
        return $string.match(regexp);
    }

    function oneline(name) {
        let str = name;
        if (typeof str === 'string') {
            str = str.replace(/\r+/g, ' ');
            str = str.replace(/\n+/g, ' ');
            str = str.replace(/\t+/g, ' ');
            str = str.replace(/\s+/g, ' ');
            str = str.replace(/^\s+/, '');
            str = str.replace(/\s+$/, '');
        }
        return str;
    }

    function duration(input) {
        return moment.duration(input);
    }

    function makeJwtToken(object, config, expiresIn) {
        const $tokenInfo = cleanObject(object);
        const opt = cleanObject({
            expiresIn,
        });
        const generateJwt = tokenInfo => jwt.sign(tokenInfo, config.jwt.secret, opt);
        const token = generateJwt($tokenInfo);
        return token;
    }

    function decodeJwtToken(token, config) {
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, config.jwt.secret);
        } catch (error) {
            decodedToken = { error: 'JsonWebTokenError: jwt malformed' };
        }
        return decodedToken;
    }

    return {
        asArray,
        asInteger,
        isArray,
        isInteger,
        isPositiveInteger,
        isString,
        mongoSanitize,
        cleanObject,
        returnString,
        makeSearchObject,
        restrict,
        formatDate,
        substring,
        fixFilename,
        removeLineBreaks,
        match,
        oneline,
        duration,
        makeJwtToken,
        decodeJwtToken,
    };
 }

 module.exports = utilities();
