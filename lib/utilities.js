'use strict';

const strftime = require('strftime');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const natural = require('natural');
const sw = require('stopword');
const striptags = require('striptags');
const removeMarkdown = require('remove-markdown');

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];

function utilities() {
    function asHumanReadable(date) {
        const epochNow = epoch();
        const epochDate = epoch(date);
        const ageInSec = epochNow / 1000 - epochDate / 1000;
        const days = parseInt(ageInSec / 86400, 10);
        const weeks = parseInt(days / 7, 10);
        const months = parseInt(weeks / 4, 10);
        if (weeks > 1) {
            return isoDateNormalized(epochDate / 1000);
        } else if (weeks === 1) {
            return `${weeks} uke siden`;
        } else if (days > 1) {
            return `${days} dager siden`;
        } else if (days === 1) {
            return `i går ${displayTime(epochDate)}`;
        }
        return `${displayTime(epochDate)}`;
    }

    function displayTime(dt, human = true, showSec = false) {
        if (typeof dt === 'number') {
            dt = new Date(dt);
        } else {
            return 'n/a';
        }
        const now = new Date();
        const nowEpoch = parseInt(now.getTime() / 1000, 10);
        const epoch = parseInt(dt.getTime() / 1000, 10);
        const msDiff = nowEpoch - epoch;
        if (human && msDiff < 60) {
            return `akkurat nå`;
        } else if (human && msDiff < 3600) {
            return `${parseInt(msDiff / 60, 10)} min siden`;
        } else if (human && msDiff < 7200) {
            return `${parseInt(msDiff / 3600, 10)} time siden`;
        } else if (human && msDiff < 86400) {
            return `${parseInt(msDiff / 3600, 10)} timer siden`;
        } else {
            if (showSec) {
                const hour = dt.getHours() < 10 ? `0${dt.getHours()}` : dt.getHours();
                const min = dt.getMinutes() < 10 ? `0${dt.getMinutes()}` : dt.getMinutes();
                const sec = dt.getSeconds() < 10 ? `0${dt.getSeconds()}` : dt.getSeconds();
                return `${hour}:${min}:${sec}`;
            } else {
                const hour = dt.getHours() < 10 ? `0${dt.getHours()}` : dt.getHours();
                const min = dt.getMinutes() < 10 ? `0${dt.getMinutes()}` : dt.getMinutes();
                return `kl.${hour}:${min}`;
            }
        }
    }

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

    function isArrayWithContent(element) {
        // console.log('isArray.element', element);
        if (Array.isArray(element)) {
            if (element.length > 0) {
                return true;
            }
        }
        return false;
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

    function asString($obj, ...$args) {
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

    function asObject($obj, ...$args) {
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

    function isDefined($obj, ...$args) {
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
        return true;
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

    function match($string = '', $match, $options = '') {
        const regexp = new RegExp($match, $options);
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

    function epoch($date) {
        if (typeof $date !== 'undefined') {
            return new Date($date).getTime();
        }
        return new Date().getTime();
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
            const month = MONTHS[availDate.getMonth()];
            // const mm = availDate.getMonth() + 1;
            const dd = availDate.getDate();
            const yy = availDate.getFullYear();
            const hh = availDate.getHours();
            const mi = availDate.getMinutes();
            const ss = availDate.getSeconds();
            const tzo = -availDate.getTimezoneOffset();
            const dif = tzo >= 0 ? '+' : '-';
            // return `${pad(yy)}-${pad(mm)}-${pad(dd)} `
            //     + `kl. ${pad(hh)}:${pad(mi)}`;
            return `${dd}.${month} ${yy} kl.${pad(hh)}:${pad(mi)}`
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


    function toRef(documents, key) {
        const ref = {};
        if (Array.isArray(documents)) {
            for (let i = 0, l = documents.length; i < l; i += 1) {
                const doc = documents[i];
                ref[doc[key]] = doc;
            }
        }
        return ref;
    }

    function distinctArray(array) {
        return [ ...new Set(array) ];
    }

    function tokenizeAndStem($sentence) {
        const sentence = striptags($sentence);
        natural.PorterStemmerNo.attach();
        const tokens = sentence.tokenizeAndStem();
        const distinctTokens = [ ...new Set(tokens) ]
        return sw.removeStopwords(distinctTokens, sw.no);
    }

    function termsCount(terms, $data) {
        let data = striptags($data);
        const tokenizer = new natural.AggressiveTokenizerNo();
        const termRef = {};
        if (!terms || !data) {
            return 0;
        }
        if (typeof data === 'string'){
            data = tokenizer.tokenize(striptags(data));
        }
        for (let i = 0, l = data.length; i < l; i += 1) {
            const word = data[i].toLowerCase();
            for (let j = 0, m = terms.length; j < m; j += 1) {
                const term = terms[j].toLowerCase();
                if (word === term) {
                    if (!termRef[word]) {
                        termRef[word] = 0;
                    }
                    termRef[word] += 1;
                }
            }
        }
        return termRef;
    }

    function termsRatio(terms, $content) {
        const tokenizer = new natural.AggressiveTokenizerNo();
        const content = striptags($content);
        const totalWords = tokenizer.tokenize(content).length;
        const wordCount = termsCount(terms, content);
        const words = Object.keys(wordCount);
        for (let i = 0, l = words.length; i < l; i += 1) {
            const word = words[i];
            wordCount[word] = wordCount[word] / totalWords;
        }
        return wordCount;
    }

    function classifyArticle(artlist = [], article) {
        if (artlist.length === 0 || !article) {
            return [];
        }

        const classifier = new natural.BayesClassifier();
        for (let i = 0, l = artlist.length; i < l; i += 1) {
            const art = artlist[i];
            if (art.tags && art.tags.length > 0) {
                for (let j = 0, m = art.tags.length; j < m; j += 1) {
                    const tag = art.tags[j];
                    classifier.addDocument(art.body, tag);
                }
            }
        }
        classifier.train();
        const classifierResult = classifier.getClassifications(article.body)
        console.log('===> classifierResult', classifierResult);

        const finalWords = [];
        for (let i = 0, l = classifierResult.length; i < l; i += 1) {
            const obj = classifierResult[i];
            // { label: 'nordre land', value: 0.00558659217877095 },
            // { label: 'gamlebyvegen', value: 0.00558659217877095 },
            // { label: 'nord torpa', value: 0.00558659217877095 },
            // { label: 'bjørnsund', value: 1.4441002314123645e-28 },
            if (obj.value > 0.001) {
                finalWords.push(obj.label);
            }
        }
        return finalWords;
    }

    function wordCount(text) {
        if (typeof text === 'string') {
            // Remove all html
            let textWork = text.replace(/<[^>]*>?/gm, '');
            // Remove all markdown
            textWork = removeMarkdown(textWork);
            // Remove all special characters
            textWork.replace(/[a-z0-9æøå]+/gi, ' ');
            // Truncate all whitespaces
            textWork.replace(/\s+/g, ' ');
            return textWork.split(' ').length;
        }
        return 0;
    }

    function secReadable(sec = 0) { 
        const days = parseInt(sec / (24 * 3600), 10);

        let restSec = sec % (24 * 3600);
        const hours = parseInt(restSec / 3600, 10);

        restSec %= 3600;
        const minutes = parseInt(restSec / 60, 10);

        restSec %= 60;
        const seconds = parseInt(restSec, 10);

        return {
            days,
            hours,
            minutes,
            seconds,
        };
    } 

    function readTime(text, language = 'en') {
        const words = wordCount(text);
        // 100 words a minute is common reading speed.
        const wordsPerSec = 100 / 60;
        const sec = words / wordsPerSec;
        const timeObj = secReadable(sec);

        if (language === 'no') {
            return `${timeObj.days ? `${timeObj.days} dag${timeObj.days > 1 ? 'er' : ''} ` : ''}`
                + `${timeObj.hours ? `${timeObj.hours} time${timeObj.hours > 1 ? 'r' : ''} ` : ''}`
                + `${timeObj.minutes ? `${timeObj.minutes} min${timeObj.minutes > 1 ? '' : ''} ` : ''}`
                + `${timeObj.seconds} sek${timeObj.seconds > 1 ? '' : ''}`;
        }
        return `${timeObj.days ? `${timeObj.days} day${timeObj.days > 1 ? 's' : ''} ` : ''}`
            + `${timeObj.hours ? `${timeObj.hours} hour${timeObj.hours > 1 ? 's' : ''} ` : ''}`
            + `${timeObj.minutes ? `${timeObj.minutes} min${timeObj.minutes > 1 ? '' : ''} ` : ''}`
            + `${timeObj.seconds} sec${timeObj.seconds > 1 ? '' : ''}`;
    }

    function youtubeThumb($content, $size = 'medium') {
        if (typeof $content !== 'string') {
            return undefined;
        }
        let youtubeRegex;
        if ($content.match(/youtube/)) {
            // eslint-disable-next-line
            youtubeRegex = /(<p>|<br>|[\s\t\n]|^)*https*:\/\/(www\.)*youtube\.com\/(.*?v=([^&\s<$]+)(&[^\s<$]+)*)/gi;
        } else if ($content.match(/youtu\.be/)) {
            // eslint-disable-next-line
            youtubeRegex = /(<p>|<br>|[\s\t\n]|^)*https*:\/\/(www\.)*youtu\.be\/(([^?&\s<$]+)((\?|&)[^\s<$]+)*)/gi;
        }
        const youtubeMatch = youtubeRegex.exec($content);
        const sizes = {
            xsmall: 'default',
            small: 'mqdefault',
            medium: 'hqdefault',
            large: 'sddefault',
            max: 'maxresdefault',
        };
        let youtubeVideoThumb;
        if (typeof youtubeMatch === 'object' && Array.isArray(youtubeMatch)) {
            youtubeVideoThumb = `//img.youtube.com/vi/${youtubeMatch[4]}/${sizes[$size]}.jpg`;
        }
        return youtubeVideoThumb;
    }

    function length(text) {
        try {
            return text.length;
        } catch(err) {
            return 0;
        }
    }

    function normalize(val, max, min) {
        return (val - min) / (max - min);
    }

    function normalizeRange(val, min, max, newMin, newMax) {
        return newMin + (val - min) * (newMax - newMin) / (max - min);
    }

    function rgb2hsv(cr, cg, cb) {
        // R, G, B values are divided by 255
        // to change the range from 0..255 to 0..1
        const r = cr / 255.0;
        const g = cg / 255.0;
        const b = cb / 255.0;

        // h, s, v = hue, saturation, value
        const cmax = Math.max(r, Math.max(g, b)); // maximum of r, g, b
        const cmin = Math.min(r, Math.min(g, b)); // minimum of r, g, b
        const diff = cmax - cmin; // diff of cmax and cmin.
        let h = -1;
        let s = -1;

        // if cmax and cmax are equal then h = 0
        if (cmax === cmin) {
            h = 0;
        } else if (cmax === r) {
            // if cmax equal r then compute h
            h = ((60 * ((g - b) / diff)) + 360) % 360;
        } else if (cmax === g) {
            // if cmax equal g then compute h
            h = ((60 * ((b - r) / diff)) + 120) % 360;
        } else if (cmax === b) {
            // if cmax equal b then compute h
            h = ((60 * ((r - g) / diff)) + 240) % 360;
        }

        // if cmax equal zero
        if (cmax === 0) {
            s = 0;
        } else {
            s = (diff / cmax) * 100;
        }

        // compute v
        const v = cmax * 100;
        return { h, s, v };
    }

    function asHtmlIdSafe($string) {
        if (typeof $string === 'string') {
            const string = $string.toLowerCase()
                .replace(/æ/i, 'e')
                .replace(/ø/i, 'o')
                .replace(/å/i, 'a')
                .replace(/[^a-z0-9]/gi, '-')
                .replace(/-+/g, '-')
                .replace(/^-/g, '')
                .replace(/-$/g, '');
            return string;
        }
        return $string;
    }

    function generateCode(min = 100000, max = 999999) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return {
        asHumanReadable,
        asArray,
        asInteger,
        isArray,
        isArrayWithContent,
        isInteger,
        isPositiveInteger,
        isString,
        format,
        mongoSanitize,
        cleanObject,
        returnString,
        asString,
        asObject,
        isDefined,
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
        epoch,
        isoDateNormalized,
        formatDim,
        getString,
        formatPosition,
        getStatus,
        getStatusClass,
        imageKeywords,
        toRef,
        tokenizeAndStem,
        termsCount,
        termsRatio,
        classifyArticle,
        wordCount,
        secReadable,
        readTime,
        youtubeThumb,
        length,
        normalize,
        normalizeRange,
        pad,
        rgb2hsv,
        asHtmlIdSafe,
        generateCode,
    };
}

module.exports = utilities();
