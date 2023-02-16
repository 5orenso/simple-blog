/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2020 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const tc = require('fast-type-check');
const https = require('https');
const querystring = require('querystring');
const HTMLParser = require('node-html-parser');
const URL = require('url');

const { routeName, routePath, run, webUtil, utilHtml, util } = require('../../../middleware/init')({ __filename, __dirname });

function getHtmlPage(pageUrl) {
    // console.log('getHtmlPage', pageUrl)
    return new Promise((resolve, reject) => {
        let htmlData = '';
        const options = {
            headers: {
                'User-Agent': 'some app v1.3 (sorenso@gmail.com)',
            },
        };
        https.get(`${pageUrl}`, options, (res) => {
            // console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);

            res.on('data', (chunk) => {
                htmlData += chunk.toString('utf8');
            });

            res.on('end', () => {
                try {
                    resolve(htmlData);
                } catch (error) {
                    resolve({});
                }
            });
        }).on('error', (e) => {
            console.error(e);
        });
    });
}

module.exports = async (req, res) => {
    const { runOpt } = run(req);

    // const requiredFields = ['lat', 'lon'];
    // if (!webUtil.hasAllRequiredFields(req, res, 'query', requiredFields)) {
    //     return false;
    // }
    const { url } = req.params;
    if (!url) {
        const response = {
            status: 400,
            message: `Missing input. You must have at least: url.`,
        };
        return utilHtml.renderApi(req, res, 400, { ...response });
    }
    const parsedURL = URL.parse(url);
    console.log('parsedURL', parsedURL);
    const data = await getHtmlPage(url);
    const root = HTMLParser.parse(data);
    // console.log(root.querySelector('head'));
    // Get all head tags from the page.
    const headTags = root.querySelectorAll('head > meta, head > title, head > link, head > description');
    // Loop through all head tags.
    const meta = {};
    headTags.forEach((headTag) => {
        // Get the tag name.
        const tagName = headTag.tagName;
        // Get the tag attributes.
        const tagAttributes = headTag.rawAttributes;
        // Get the tag content.
        const tagContent = headTag.text;
        // Log the tag name, attributes and content.

        if (
            tagName === 'META'
            && tagAttributes.property
            && (
                tagAttributes.property.startsWith('og:')
                || tagAttributes.property.startsWith('twitter:')
            )
        ) {
            meta[tagAttributes.property] = tagAttributes.content;
        }
        if (tagName === 'TITLE') {
            meta.title = tagContent;
        }
        if (tagName === 'DESCRIPTION') {
            meta.description = tagContent;
        }
        if (tagName === 'LINK' && tagAttributes.rel === 'apple-touch-icon'
            && (
                tagAttributes.sizes === '114x114'
                || tagAttributes.sizes === '72x72'
            )
        ) {
            meta.icon = tagAttributes.href;
        }

        console.log(tagName, tagAttributes, tagContent);
    });

    console.log('meta', meta);
    // meta {
    //     icon: '/cnp-assets/favicon-29bc799f/coast-228x228.png',
    //     title: 'Økte bøter er snakkis innad i politiet: – Kan være ubehagelig - VG',
    //     'og:type': 'article',
    //     'og:url': 'https://www.vg.no/i/zE619K',
    //     'og:title': 'Økte bøter er snakkis innad i politiet: – Kan være ubehagelig',
    //     'twitter:title': 'Økte bøter er snakkis innad i politiet: – Kan være ubehagelig',
    //     'og:description': 'Nå svir det å bli tatt i trafikken. Politiet forstår at enkelte politibetjenter kan kvie seg mot å gi bøter.',
    //     'twitter:description': 'Nå svir det å bli tatt i trafikken. Politiet forstår at enkelte politibetjenter kan kvie seg mot å gi bøter.',
    //     'og:image': 'https://akamai.vgc.no/v2/images/547ab74f-e2f7-4466-b884-580393c1f77f?fit=crop&amp;format=auto&amp;h=1069&amp;w=1900&amp;s=818027431fa79186ec4d26ee881927ee9fa6a41d',
    //     'og:image:width': '1900',
    //     'og:image:height': '1069',
    //     'twitter:image': 'https://akamai.vgc.no/v2/images/547ab74f-e2f7-4466-b884-580393c1f77f?fit=crop&amp;format=auto&amp;h=1069&amp;w=1900&amp;s=818027431fa79186ec4d26ee881927ee9fa6a41d',
    //     'twitter:card': 'summary_large_image'
    // }

    const response = {
        status: 200,
        message: 'Page data',
        // data: tc.getNestedValue(data, 'properties.timeseries'),
        data: {
            icon: meta.icon,
            title: meta.title || meta['og:title'] || meta['twitter:title'],
            description: meta.description || meta['og:description'] || meta['twitter:description'],
            image: meta['og:image'] || meta['twitter:image'],
            baseUrl: `${parsedURL.protocol}//${parsedURL.host}`,
        },
    };
    if (req.isGraphql) {
        // req.mongoFields
        return response.data;
    }
    return utilHtml.renderApi(req, res, 200, { ...response }, { cacheTime: 3600 });
};
