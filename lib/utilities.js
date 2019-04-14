'use strict';

const strftime = require('strftime');
const moment = require('moment');
const jwt = require('jsonwebtoken');

function utilities() {
    function pad(number) {
        let r = String(number);
        if (r.length === 1) {
            r = `0${r}`;
        }
        return r;
    }

    function isNumber(number) {
        return !Number.isNaN(parseFloat(number)) && Number.isFinite(number);
    }

    function format($number, $decimals, $decPoint, $thousandsSep) {
        const decimals = Number.isNaN($decimals) ? 2 : Math.abs($decimals);
        const decPoint = ($decPoint === undefined) ? ',' : $decPoint;
        const thousandsSep = ($thousandsSep === undefined) ? ' ' : $thousandsSep;

        const number = Math.abs($number || 0);
        const sign = $number < 0 ? '-' : '';

        if (isNumber(number)) {
            const intPart = String(parseInt(number.toFixed(decimals), 10));
            const j = intPart.length > 3 ? intPart.length % 3 : 0;

            const firstPart = (j ? intPart.substr(0, j) + thousandsSep : '');
            const secondPart = intPart.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousandsSep}`);
            const decimalPart = (decimals ? decPoint + Math.abs(number - intPart).toFixed(decimals).slice(2) : '');
            return `${sign}${firstPart}${secondPart}${decimalPart}`;
        }
        return '';
    }

    function getType(element) {
        return Object.prototype.toString.call(element);
    }

    function isString(element) {
        if (getType(element) === '[object String]') {
            return true;
        }
        return false;
    }

    function asArray(element) {
        // console.log('asArray.element', element, typeof element, isString(element));
        if (isString(element)) {
            // console.log('asArray.isString.element', element);
            return element.split(/, ?/).map(el => String(el));
        }
        return undefined;
    }

    function asInteger(num) {
        return parseInt(num, 10);
    }

    function isArray(element) {
        // console.log('isArray.element', element);
        return Array.isArray(element);
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

    function getString($obj, ...$args) {
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

    function makeSearchObject(searchQuery, searchFields = [], searchFieldsNum = [], searchFieldsArray = [], opt = {}) {
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
            if (typeof searchFieldsNum !== 'undefined') {
                const intNumber = parseInt(word, 10);
                if (typeof intNumber === 'number' && !Number.isNaN(intNumber)) {
                    for (let i = 0; i < searchFieldsNum.length; i += 1) {
                        if (searchFieldsNum.hasOwnProperty(i)) {
                            const searchField = searchFieldsNum[i];
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
            if (typeof searchFieldsArray !== 'undefined') {
                for (let i = 0; i < searchFieldsArray.length; i += 1) {
                    if (searchFieldsArray.hasOwnProperty(i)) {
                        const searchField = searchFieldsArray[i][0];
                        const searchFieldSub = searchFieldsArray[i][1];
                        const searchFieldQuery = searchFieldsArray[i][2];
                        const searchElement = {};

                        // { $elemMatch: { award:'National Medal', year:1975 } }
                        searchElement[searchField] = { $elemMatch: {
                            ...searchFieldQuery,
                        } };
                        searchElement[searchField].$elemMatch[searchFieldSub] =
                            { $regex: `${mongoSanitize(word)}`, $options: 'i' };

                        if (typeof searchObj.$or === 'undefined') {
                            searchObj.$or = [];
                        }
                        searchObj.$or.push(searchElement);
                    }
                }
            }
            if (typeof searchObject.$and === 'undefined') {
                searchObject.$and = [];
            }
            searchObject.$and.push(searchObj);
        }
        if (typeof searchObject.$and === 'undefined') {
            searchObject.$and = [];
        }
        searchObject.$and.push(opt.query);
        // console.log('searchObject', JSON.stringify(searchObject, null, 4));
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
        const opt = cleanObject({ expiresIn });
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

    function formatBytes($bytes, decimals) {
        const bytes = parseInt($bytes, 10);
        if (isNumber(bytes)) {
            if (bytes === 0) {
                return '0 Bytes';
            }
            const k = 1024;
            const dm = decimals || 2;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
        }
        return '';
    }

    function isoDateNormalized(dateString) {
        let availDate;
        if (typeof dateString === 'string' && dateString.match(/\d{4}-\d{2}-\d{2}/)) {
            availDate = new Date(dateString);
        } else if (typeof dateString === 'number') {
            availDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
            availDate.setUTCSeconds(dateString);
        }

        if (availDate) {
            const mm = availDate.getMonth() + 1;
            const dd = availDate.getDate();
            const yy = availDate.getFullYear();
            const hh = availDate.getHours();
            const mi = availDate.getMinutes();
            const ss = availDate.getSeconds();
            const tzo = -availDate.getTimezoneOffset();
            const dif = tzo >= 0 ? '+' : '-';
            return `${pad(yy)}-${pad(mm)}-${pad(dd)} `
                + `${pad(hh)}:${pad(mi)}`;
        }
        return dateString;
    }

    function formatDim(input) {
        const parts = String(input).split('x');
        const width = format(parts[0], 0);
        const height = format(parts[1], 0);
        return `${width} x ${height}`;
    }

    function formatPosition(input) {
        const pos = parseFloat(input);
        return format(pos, 5, '.');
    }

    function getStatus(status) {
        if (status === 1) {
            return 'in progress';
        } else if (status === 2) {
            return 'live';
        } else if (status === 3) {
            return 'offline';
        }
        return 'unknown';
    }

    function getStatusClass(status) {
        if (status === 1) {
            return 'warning';
        } else if (status === 2) {
            return 'success';
        } else if (status === 3) {
            return 'danger';
        }
        return '';
    }

    function imageKeywords(img) {
        if (typeof img === 'object') {
            const keywords = [];
            if (typeof img.predictions === 'object' && Array.isArray(img.predictions)) {
                for (let i = 0, l = img.predictions.length; i < l; i += 1) {
                    const el = img.predictions[i];
                    keywords.push(el.className);
                }
            }
            if (typeof img.predictionsCocoSsd === 'object' && Array.isArray(img.predictionsCocoSsd)) {
                for (let i = 0, l = img.predictionsCocoSsd.length; i < l; i += 1) {
                    const el = img.predictionsCocoSsd[i];
                    keywords.push(el.class);
                }
            }
            return keywords.join(',');
        }
        return null;
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
        formatBytes,
        isoDateNormalized,
        formatDim,
        getString,
        formatPosition,
        getStatus,
        getStatusClass,
        imageKeywords,
    };
}

module.exports = utilities();
