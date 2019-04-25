/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2018 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const querystring = require('querystring');

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

class Utilities {
    static isoDate(dateString) {
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
            return `${pad(yy)}-${pad(mm)}-${pad(dd)}T`
                + `${pad(hh)}:${pad(mi)}:${pad(ss)}${dif}${pad(tzo / 60)}:${pad(tzo % 60)}`;
        }
        return dateString;
    }

    static isoDateNormalized(dateString) {
        let availDate;
        if (typeof dateString === 'string'
            && (dateString.match(/^\d{4}-\d{2}-\d{2}$/) || dateString.match(/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/))) {
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

    static displayDate(dt) {
        if (typeof dt === 'number') {
            dt = new Date(dt);
        } else {
            return 'n/a';
        }
        const now = new Date();
        const nowEpoch = parseInt(now.getTime() / 1000, 10);
        const epoch = parseInt(dt.getTime() / 1000, 10);
        const msDiff = nowEpoch - epoch;
        const nowDay = Utilities.pad(now.getDate());
        const day = Utilities.pad(dt.getDate());
        if (msDiff > 86000) {
            const month = Utilities.pad(dt.getMonth() + 1);
            const year = Utilities.pad(dt.getFullYear());
            return `${year}-${month}-${day} `;
        }
        return '';
    }
    static displayTime(dt, human = true, showSec = false) {
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
            return `just now`;
        // } else if (msDiff < 60) {
        //     return `${msDiff} sec ago`;
        } else if (human && msDiff < 3600) {
            return `${parseInt(msDiff / 60, 10)} min ago`;
        } else if (human && msDiff < 86400) {
            return `${parseInt(msDiff / 3600, 10)} hours ago`;
        } else {
            if (showSec) {
                const hour = dt.getHours() < 10 ? `0${dt.getHours()}` : dt.getHours();
                const min = dt.getMinutes() < 10 ? `0${dt.getMinutes()}` : dt.getMinutes();
                const sec = dt.getSeconds() < 10 ? `0${dt.getSeconds()}` : dt.getSeconds();
                return `${hour}:${min}:${sec}`;
            } else {
                const hour = dt.getHours() < 10 ? `0${dt.getHours()}` : dt.getHours();
                const min = dt.getMinutes() < 10 ? `0${dt.getMinutes()}` : dt.getMinutes();
                return `${hour}:${min}`;
            }
        }
    }

    static fetchApi(endpoint, $opts, main, settings = {}) {
        const opts = $opts;
        if (typeof settings.skipSettingState === 'undefined' || settings.skipSettingState === false) {
            main.setState({
                infoStatus: 'loading...',
                loadingProgress: 0,
            });
        }
        const fetchOpt = {
            credentials: 'omit',
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {},
        };
        if (main.props.jwtToken) {
            fetchOpt.headers = {
                Authorization: `Bearer ${main.props.jwtToken}`,
            };
        }
        if (main.props.jwtTokenUser) {
            fetchOpt.headers.jwtUser = main.props.jwtTokenUser;
        }
        let qs = '';
        if (opts.method === 'POST' || opts.method === 'PUT' || opts.method === 'PATCH' || opts.method === 'DELETE') {
            fetchOpt.method = opts.method;
            delete opts.method;
            fetchOpt.body = JSON.stringify(opts);
            fetchOpt.headers['Content-Type'] = 'application/json';
        } else {
            qs = querystring.stringify(opts);
        }
        if (typeof settings.skipSettingState === 'undefined' || settings.skipSettingState === false) {
            if (typeof settings.skipSettingState === 'undefined' || settings.skipSettingState === false) {
                main.setState({
                    infoStatus: 'loading...',
                    loadingProgress: 25,
                });
            }
        }
        // console.log('fetchOpt', fetchOpt);
        // console.log(`${main.props.apiServer}${endpoint}${qs ? `?${qs}` : ''}`);
        return fetch(`${main.props.apiServer}${endpoint}${qs ? `?${qs}` : ''}`, fetchOpt)
            .then((response) => {
                if (typeof settings.skipSettingState === 'undefined' || settings.skipSettingState === false) {
                    main.setState({
                        infoStatus: '',
                        loadingProgress: 100,
                    });
                }
                return response;
            })
            .then(response => response.json())
            .catch((error) => {
                if (typeof settings.skipSettingState === 'undefined' || settings.skipSettingState === false) {
                    main.setState({
                        infoStatus: 'Error!',
                    });
                }
                throw (error);
            });
    }

    static format($number, $decimals, $decPoint, $thousandsSep) {
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

    static uc(str) {
        return String(str).toUpperCase();
    }

    static deepCopyObject($obj) {
        return JSON.parse(JSON.stringify($obj));
    }

    static getResetState(currentState, $initialState) {
        const initialState = Utilities.deepCopyObject($initialState);
        const newState = Object.assign({}, initialState);
        return newState;
    }

    static sortByDepth(a, b) {
        if (a.depth < b.depth) {
            return -1;
        }
        if (a.depth > b.depth) {
            return 1;
        }
        return 0;
    }

    static isString($obj, ...$args) {
        let args = $args;
        if (Array.isArray(args[0])) {
            args = args[0];
        }
        let obj = $obj;
        for (let i = 0; i < args.length; i += 1) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
                return false;
            }
            obj = obj[args[i]];
        }
        return true;
    }

    static getString($obj, ...$args) {
        let args = $args;
        if (Array.isArray(args[0])) {
            args = args[0];
        }
        let obj = $obj;
        for (let i = 0; i < args.length; i += 1) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
                return '';
            }
            obj = obj[args[i]];
        }
        return obj;
    }

    static formatBytes($bytes, decimals) {
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

    static formatDim(input) {
        const parts = String(input).split('x');
        const width = Utilities.format(parts[0], 0);
        const height = Utilities.format(parts[1], 0);
        return `${width} x ${height}`;
    }

    static formatPosition(input) {
        const pos = parseFloat(input);
        return Utilities.format(pos, 5, '.');
    }

    static htmlIdSafe($string) {
        if (typeof $string === 'string') {
            const string = $string.toLowerCase().replace(/[^a-z0-9]/gi, '-');
            return string;
        }
        return $string;
    }

    static getStatus(status) {
        if (status === 1) {
            return 'in progress';
        } else if (status === 2) {
            return 'live';
        } else if (status === 3) {
            return 'offline';
        }
        return 'unknown';
    }

    static getStatusClass(status) {
        if (status === 1) {
            return 'warning';
        } else if (status === 2) {
            return 'success';
        } else if (status === 3) {
            return 'danger';
        }
        return '';
    }

    static isNumber(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }

    static asInteger(num) {
        return parseInt(num, 10);
    }

    static isInteger(num) {
        return Number.isInteger(num);
    }

    static isPositiveInteger(num) {
        return isInteger(num) && num > 0;
    }

    static asUniqArray(array, parseToInteger = false) {
        const temp = {};
        for (let i = 0; i < array.length; i += 1) {
            temp[array[i]] = true;
        }
        const result = [];
        const keys = Object.keys(temp);
        for (let i = 0; i < keys.length; i += 1) {
            let key = keys[i];
            if (parseToInteger) {
                key = parseInt(key, 10);
            }
            result.push(key);
        }
        return result;
    }
}

module.exports = Utilities;
