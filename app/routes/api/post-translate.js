/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const { TranslationServiceClient } = require('@google-cloud/translate');
const projectId = 'ffe-dealerweb';
const location = 'global';

const translationClient = new TranslationServiceClient();

const { routeName, routePath, run, webUtil, utilHtml, util } = require('../../middleware/init')({ __filename, __dirname });

async function translateText(text, targetLang = 'en') {
    // Construct request
    const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [text],
        mimeType: 'text/plain', // mime types: text/plain, text/html
        sourceLanguageCode: 'no',
        targetLanguageCode: targetLang,
    };

    try {
        // Run request
        const [response] = await translationClient.translateText(request);
        return response.translations[0];
        // for (const translation of response.translations) {
        //     console.log(`Translation: ${translation.translatedText}`);
        // }
    } catch (error) {
        console.error(error);
    }
    return false;
}

module.exports = async (req, res) => {
    const { hrstart, runId } = run(req);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    const translatedText = await translateText(req.body.data.text, 'en');
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    const data = {
        data: translatedText,
        status: 200,
    };
    return utilHtml.renderApi(req, res, 200, data);
};
