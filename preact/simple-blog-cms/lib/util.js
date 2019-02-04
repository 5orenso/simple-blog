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
        if (typeof dateString === 'string') {
            if (dateString.match(/\d{4}-\d{2}-\d{2}/)) {
                // "d.m.y"
                const availDate = new Date(dateString);
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
        }
        return dateString;
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
            credentials: 'same-origin',
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
            fetchOpt.credentials = 'include';
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
}

module.exports = Utilities;
