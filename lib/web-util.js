/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2017 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const path = require('path');
const Lynx = require('lynx');
const swig = require('./swig');

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

    function logFunctionTimer($moduleName, $functionName, $path, $hrend) {
        if (typeof $moduleName !== 'string' || typeof $functionName !== 'string' || typeof $hrend !== 'object') {
            return false;
        }
        const moduleName = $moduleName.replace(/\//g, '-');
        const functionName = $functionName.replace(/\//g, '-');
        const runTime = (($hrend[0] * 1e9) + $hrend[1]) / 1000000;
        lynxMetrics.timing(`${moduleName}.${functionName}`, runTime); // time in ms
        lynxMetrics.timing(`${moduleName}.${functionName}.${$path}`, runTime); // time in ms
        if (isDevelopment()) {
            console.log(JSON.stringify([moduleName, functionName, $path, runTime, 'ms']));
        }
        return true;
    }

    function getCommonTemplateValues(req) {
        return {
            session: req.session,
            cookies: req.cookies,
            signedCookies: req.signedCookies,
            queryString: req.query,
            params: req.params,
            requestHeaders: req.headers,
            currentEmail: req.session.email,
            realEmail: req.session.email,
            blog: req.config.blog,
            env: {
                isDevelopment: isDevelopment(),
            },
        };
    }

    function resolveTemplate(req, useTemplate, useTemplatePath) {
        console.log('resolveTemplate', useTemplate, useTemplatePath);
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
            let opt;
            if (typeof $useTemplate === 'object') {
                opt = $useTemplate;
                if (typeof opt.hrstart === 'object') {
                    logFunctionTimer(`router${opt.routePath}`, opt.routeName, req.path, process.hrtime(opt.hrstart));
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

            logFunctionTimer('router/web', 'sendResultResponse-cleanedObjects', req.path, process.hrtime(hrstart));

            // Assign data to final object.
            hrstart = process.hrtime();
            const completeSwigObject = Object.assign(dataObject, getCommonTemplateValues(req));
            logFunctionTimer('router/web', 'sendResultResponse-assignedData', req.path, process.hrtime(hrstart));

            hrstart = process.hrtime();
            res.status(200).send(tpl(completeSwigObject));
            logFunctionTimer('router/web', 'sendResultResponse-compiledAndSend', req.path, process.hrtime(hrstart));
        } catch (err) { // Fail if template don't exists
            res.status(404).send(`Page not found: ${err}`);
        }
        return true;
    }

    return {
        isDevelopment,
        print,
        printIfDev,
        restrict,
        sendResultResponse,
        logFunctionTimer,
    };
}

module.exports = webUtil();
