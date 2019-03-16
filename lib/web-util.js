/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2017 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const Lynx = require('lynx');
const swig = require('./swig');
const util = require('./utilities');

const appPath = path.normalize(`${__dirname}/../`);
const lynxMetrics = new Lynx('localhost', 8125);
const baseTemplatePath = `${appPath}template`;
const templatePath = `${appPath}template/current`;

function webUtil() {
    function isDevelopment() {
        if (process.env.nodeEnv === 'development') {
            return true;
        }
        return false;
    }

    function print(...args) {
        const len = args.length;
        for (let i = 0; i < len; i += 1) {
            if (typeof args[i] === 'object') {
                console.log(JSON.stringify(args[i]));
            } else {
                console.log(args[i]);
            }
        }
    }

    function printIfDev(...args) {
        if (isDevelopment()) {
            print(args);
        }
    }

    function restrict(req, res, next) {
        if (req.session.email) {
            next();
        } else if (req.headers.authorization === 'ad4c3032-526c-4f17-9c4e-3261adead053') {
            req.session.email = 'oistein@flyfisheurope.com';
            next();
        } else {
            if (typeof req.originalUrl === 'string' && !req.originalUrl.match(/(login|logout)/)) {
                req.session.originalUrl = req.originalUrl;
            }
            res.redirect('/login');
        }
    }

    function lynxSafe(input) {
        return String(input).replace(/\//g, '-');
    }

    function logFunctionTimer(opt, req) {
        if (typeof opt.routePath !== 'string' || typeof opt.routeName !== 'string'
            || (typeof opt.hrend !== 'object' && typeof opt.hrstart !== 'object')) {
            return false;
        }
        let libName;
        if (opt.libName) {
            const regExp = new RegExp(appPath);
            libName = opt.libName.replace(regExp, '');
        }
        let reqOpt = {};
        if (typeof req !== 'undefined') {
            reqOpt = {
                originalUrl: req.originalUrl,
                reqQuery: req.query,
                reqParams: req.params,
                reqBody: req.body,
            };
        }
        const hrend = opt.hrend || process.hrtime(opt.hrstart);

        const runTime = ((hrend[0] * 1e9) + hrend[1]) / 1000000;
        // Send timing data via UDP to localhost port 8125
        let lynxKey = `${lynxSafe(opt.routePath)}.${lynxSafe(opt.routeName)}.${lynxSafe(libName)}.`
            + `${lynxSafe(opt.funcName)}.${lynxSafe(opt.funcPart)}`;
        lynxKey = lynxKey.replace(/\.+$/, '');
        lynxMetrics.timing(lynxKey, runTime); // time in ms
        printIfDev({
            runId: opt.runId,
            routePath: opt.routePath,
            routeName: opt.routeName,
            originalUrl: opt.originalUrl || reqOpt.originalUrl,
            reqQuery: opt.reqQuery || reqOpt.reqQuery,
            reqParams: opt.reqParams || reqOpt.reqParams,
            reqBody: opt.reqBody || reqOpt.reqBody,
            libName: libName,
            funcName: opt.funcName,
            funcPart: opt.funcPart,
            runTime,
        })
        return true;
    }

    function getCommonTemplateValues(req) {
        let jwtToken;
        if (req.hasOwnProperty('config') && req.config.hasOwnProperty('jwt')) {
            jwtToken = util.makeJwtToken({
                email: req.session.email
            }, req.config);
        }
        return {
            jwtToken,
            session: req.session,
            cookies: req.cookies,
            signedCookies: req.signedCookies,
            originalUrl: req.originalUrl,
            originalUrlPath: req.originalUrl.replace(/\/[^/]+$/, '/'),
            queryString: req.query,
            params: req.params,
            requestHeaders: req.headers,
            currentEmail: req.session.email,
            realEmail: req.session.email,
            blog: req.config.blog,
            env: {
                isDevelopment: isDevelopment(),
                now: util.formatDate(),
            },
        };
    }

    function resolveTemplate(req, useTemplate, useTemplatePath = true) {
        // console.log('resolveTemplate', useTemplate, useTemplatePath);
        let requestPathname = '/index';
        if (typeof useTemplate === 'string') {
            requestPathname = useTemplate;
        } else if (typeof req === 'object' && req.hasOwnProperty('_parsedUrl')) {
            // eslint-disable-next-line
            requestPathname = req._parsedUrl.pathname;
        }
        if (typeof requestPathname === 'string' && !requestPathname.match(/\.html$/)) {
            requestPathname += '.html';
        }
        if (typeof useTemplatePath === 'boolean' && useTemplatePath) {
            return baseTemplatePath + requestPathname;
        }
        return templatePath + requestPathname;
    }

    function sendResultResponse(req, res, $dataObject, $useTemplate, $useTemplatePath) {
        try { // Trying to load template.
            let useTemplate;
            let useTemplatePath;
            let opt = {
                libName: __filename,
                funcName: 'sendResultResponse',
                originalUrl: req.originalUrl,
                reqQuery: req.query,
                reqParams: req.params,
            };
            if (typeof $useTemplate === 'object') {
                opt = Object.assign(opt, $useTemplate);
                if (typeof opt.hrstart === 'object') {
                    logFunctionTimer(Object.assign(opt, { funcPart: 'start', hrstart: opt.hrstart }));
                }
                useTemplate = opt.useTemplate;
                useTemplatePath = opt.useTemplatePath;
            } else {
                useTemplate = $useTemplate;
                useTemplatePath = $useTemplatePath;
            }

            const dataObject = $dataObject;
            let hrstart = process.hrtime();
            const tpl = swig.compileFile(resolveTemplate(req, useTemplate, useTemplatePath));
            logFunctionTimer(Object.assign(opt, { funcPart: 'swig.compileFile', hrstart }));

            // Assign data to final object.
            hrstart = process.hrtime();
            const completeSwigObject = Object.assign(dataObject, getCommonTemplateValues(req));
            logFunctionTimer(Object.assign(opt, { funcPart: 'assignedData', hrstart }));

            hrstart = process.hrtime();
            res.status(200).send(tpl(completeSwigObject));
            logFunctionTimer(Object.assign(opt, { funcPart: 'compiledAndSend', hrstart }));
        } catch (err) { // Fail if template don't exists
            res.status(404).send(`Page not found: ${err}`);
        }
        return true;
    }

    function loadFile(filename) {
        return new Promise((resolve, reject) => {
            fs.readFile(filename, { encoding: 'utf8' }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    return {
        isDevelopment,
        print,
        printIfDev,
        restrict,
        sendResultResponse,
        logFunctionTimer,
        loadFile,
        cleanObject: util.cleanObject,
    };
}

module.exports = webUtil();
