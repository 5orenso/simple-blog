'use strict';

const util = require('../../lib/utilities');
const webUtil = require('../../lib/web-util');
const uuidv4 = require('uuid/v4');

module.exports = function(opt) {
    const routeName = opt.__filename.slice(opt.__dirname.length + 1, -3);
    const routePath = opt.__dirname.replace(/.+\/routes/, '');

    const run = function(req) {
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
        return { hrstart, runId }
    };

    return {
        routeName,
        routePath,
        run,
        webUtil,
    };
};
