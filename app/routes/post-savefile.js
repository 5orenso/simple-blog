'use strict';

const routeName = __filename.slice(__dirname.length + 1, -3);
const routePath = __dirname.replace(/.+\/routes/, '');
const webUtil = require('../../lib/web-util');
const fs = require('fs');
const path = require('path');

function saveFile(filename, $fileContent) {
    return new Promise((resolve, reject) => {
        const fileContent = $fileContent.replace(/(\r\n|\n|\r)/gm, '\n');
        fs.writeFile(filename, fileContent, (err) => {
            if (err) {
                return reject(err);
            }
            return resolve('saved');
        });
    });
}

module.exports = (req, res) => {
    const hrstart = process.hrtime();
    webUtil.printIfDev(`Route: ${routePath}/${routeName}`, req.query, req.param);
    const uploadResult = true;
    let errorMessage;
    const filesUploaded = [];
    let addToFile = path.normalize(`${req.config.adapter.markdown.contentPath}${req.body.addToFile}`);
    if (req.body.makeNewFile && req.body.filePath) {
        let newFilename = req.body.makeNewFile.toLowerCase();
        newFilename = newFilename.replace(/\.md$/, '');
        newFilename = newFilename.replace(/[^a-z0-9-]/g, '-');
        addToFile =
            path.normalize(`${req.config.adapter.markdown.contentPath}${req.body.filePath}${newFilename}.md`);
    }
    console.log('addToFile:', addToFile);

    return saveFile(addToFile, req.body.body)
        .then(() => {
            console.log('file saved', addToFile);
            webUtil.sendResultResponse(req, res, {
                uploadResult: {
                    success: uploadResult,
                    error: errorMessage,
                    files: filesUploaded,
                },
            }, {
                hrstart,
                routePath,
                routeName,
                useTemplatePath: true,
                useTemplate: '/global/ajax/savefile.html',
            });
        });
};
