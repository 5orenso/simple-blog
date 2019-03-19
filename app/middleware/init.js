'use strict';

const uuidv4 = require('uuid/v4');
const path = require('path');
const webUtil = require('../../lib/web-util');
const utilHtml = require('../../lib/util-html');
const util = require('../../lib/utilities');
const appPath = path.normalize(`${__dirname}/../../`);

module.exports = (opt) => {
    // eslint-disable-next-line
    const routeName = opt.__filename.slice(opt.__dirname.length + 1, -3);
    // eslint-disable-next-line
    const routePath = opt.__dirname.replace(/.+\/routes/, '');

    const run = (req) => {
        const hrstart = process.hrtime();
        const runId = uuidv4();

        webUtil.printIfDev({
            runId,
            routePath,
            routeName,
            originalUrl: req.originalUrl,
            reqQuery: req.query,
            reqParams: req.params,
        });
        return { hrstart, runId };
    };

    return {
        routeName,
        routePath,
        appPath,
        run,
        util,
        webUtil,
        utilHtml,
    };
};
