/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2020 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const tc = require('fast-type-check');
const https = require('https');
const fetch = require('node-fetch');
const querystring = require('querystring');
const HTMLParser = require('node-html-parser');
const URL = require('url');

const isDevelopment = process.env.NODE_ENV !== 'production';

const { routeName, routePath, run, webUtil, utilHtml, util } = require('../../../middleware/init')({ __filename, __dirname });

async function getHtmlPage(pageUrl, parsedURL) {
    // return new Promise((resolve, reject) => {
    const options = {
        headers: {
            Host: parsedURL.host,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/110.0',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            Referer: 'https://www.komplett.no/cart',
            Connection: 'keep-alive',
            // Cookie: _abck=C02770AD87C4AD63E52AF5CE98029A83~0~YAAQ100kFzswODCGAQAADZQqXwlLBfd6pV5k1LurHajDrWhP1I3umx+FhUXzEoIDRALXdW3Q1yQLEhXOx/Is5peZFzDaxJ6FWYBrDVfsnGngwu9Obr6nbNFEEQK3UcBzkhs6VCHjFjmTfeeW93AggG4ZSCoqBw71gVfVWqOSQ1cPLZ7ruBqbV6857MRzrt1XxaiMWM5kxhn2TDtxmomuKuj+4OuMXzEW5CZH4pnkvTF0FtFnqFK1M6KdyPpdNxq9pN6fIUeU8IvzPw1f/lxOtWS/TiOB1AbsrgPSPyMH7e5HiKYUdzo4DX81LhBqSdOtFumO3IhP4+tPEtDDZB4rAVDTxfIQijAe08elOr9eCvVEMNjfmgAM9XnwEpNb2a3JnUiZ0yCABRPsSNEvujtx7OMypOo2sUW2jyU=~-1~-1~1676637419; basicCookiesConsent=1; marketingCookiesConsent=1; personalizationCookiesConsent=1; migrationConsentCookie=1; Komplett.Caas.Session=eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDc4MzU5MjUsImFubiI6dHJ1ZSwidXIiOjUsInZnIjoiMGJiZjQ0MGUtZWJjMy00MzliLWJhZmItZjBmMzhjMjcwN2FjIiwiY2F0dHIiOltdfQ.ALDaf9MOMwAQoZ9EAAeqiTo4bWAAIO6wMUH8IFd3KYoq_gxkl1qdPLVjCE8V0yBn6JTKkDCnrpD5t6gnQ4LHG4sXAHKMYyuYOCpgtAa4JSHp0PDAWLq0nKi65xzF5qP6E5rpQnT9j-8eeFhKp5DdqooR_R8pIdGH3PRDNfa8xgqMfzW5; rr_rcs=eF5j4cotK8lM4TM3NNQFQpbSZA9jM3NjM2MTI91EszQTXRPj1DRdI_PkRF1jIzNDS6PktFTjRCMAeHENyw; bm_sz=70704A2920C857C0B74381B64E0D9BB0~YAAQ1k0kF+D3/CeGAQAAK5XfXhIbaRJjtlwLwWphL2BYjpbhhJDvlCI1EAMkANQ5u27wpcXk/4k0sEm2M02J2csUeKEbDwGbFbfrjrjeNlxI1IdDVZvEMpcvZWs+sXYpB5UBC3A79eZoOfFIuIVLiqO/EVwfQCxNkI5Ey8lrMfBlnRihhIP/lve1OE9Pwu1xhfcfeTdcqKtePKkX7qOLO8kI4v8NuMvmPcgjO1s3OyJhjE2JANLq6GTuvB4SYri2dzBcGcL0oFdmAa3zUltguuaiJbt4vloqT0CEM64mDRVeN0ng~4534595~4342837; Komplett.ShoppingCartId=2c27c886-5a33-4f5b-ad29-393e569fb178; .ASPXANONYMOUS=1liM72F1K2mGW16LllQtcGVHPKbs_w7LVq8rEy8hZqt4GE0ooQSpdfWO0kYhqofa8YYwlXfmV3jBdHdaQfz8x0jJcTqFZxaTGE3ijsDhK22ySIKMnPSmA4-eI9kjlUZu2bvgq5e-pMWXHXtDYlaCNA2; ak_bmsc=2C832BF0B1351930F443E13F0B57EF5D~000000000000000000000000000000~YAAQ100kFxrkOTCGAQAALWBWXxKes9eoZoSdIUcmOjxcgBUOaO9bCK3QriYaBnXN2AC9naAGgONo7bVpAbT9zbJz2unDj3FNK5aIb2KIhPUUeDPd3R+Ta27y5g8KPDAvmGgRTivk9wABf+K5EGc/4qC6BPNAG41Z0wBL7QNSAtnTISKtiUKhf4aa7nRkI78gX9MyRwuy1giTQ7tDFEbKuErV9Y/G6lt0d9AF4rQEU18PSI8SL7UktuYgGYn35OWasLgZoMDoU4TzGxXZXzXbNx+C6S5uKGnHrbD4oUYClKUJmtszHe8/QqQBMQxHfTiTMDXRBe2B3+AvHLJ9v3mwIwFDDXChae2G8itEkHMIaLojJQQ4hKDzrLAx1j12tCqOUxt0OlvdjII+/Wla; bm_sv=38567D03096D3FAEAA657A811106A003~YAAQ100kFzDkOTCGAQAACmJWXxKVil6MG7DF3U1RaUN03d0nGkGiWQ91YxinKG6XFinFL/fEjvIm3vNwinUmB5CvCtrTd44AwYpFRIl3TppGe7cZuF0pzi1R9gLnKxCC9pNrF06AZ+x5V48P66XGyskKPqwgoTo9nigDUmT0maP+r5pYn2+pCrs7r5pVZ6SLUm6k0VaT2eyF0mMzkrEgbqkAAAT9GAx8iFq15+qyuCIeJl7an0ScWmrEuCO/jSvt7w==~1
            'Upgrade-Insecure-Requests': 1,
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            // 'Sec-Fetch-User': ?1,
        },
        method: 'GET',
        redirect: 'follow',
        follow: 20,
        compress: true,
    };
    console.log('getHtmlPage.fetch()', pageUrl, options);

    const response = await fetch(pageUrl, options);
    const htmlData = await response.text();
    return htmlData;
    // console.log('htmlData', htmlData);
        // https.get(`${pageUrl}`, options, (res) => {
        //     console.log('statusCode:', res.statusCode);
        //     console.log('headers:', res.headers);

        //     res.on('data', (chunk) => {
        //         htmlData += chunk.toString('utf8');
        //     });

        //     res.on('end', () => {
        //         try {
        //             resolve(htmlData);
        //         } catch (error) {
        //             resolve({});
        //         }
        //     });
        // }).on('error', (e) => {
        //     console.error(e);
        // });
    // });
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
    const data = await getHtmlPage(url, parsedURL);
    // console.log('data', data);
    const root = HTMLParser.parse(data);
    // console.log(root.querySelector('head'));
    // Get all head tags from the page.

    // <meta name="theme-color" content="#171716">

    const headTags = root.querySelectorAll('head > meta, head > title, head > link, head > description');
    // const headTags = root.querySelectorAll('head > meta, ');
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

        if (tagName === 'META'
            && tagAttributes.property
            && (
                tagAttributes.property.startsWith('og:')
                || tagAttributes.property.startsWith('twitter:')
            )
        ) {
            meta[tagAttributes.property] = tagAttributes.content;
        }
        if (tagName === 'META' && tagAttributes.name === 'theme-color') {
            meta.themeColor = tagAttributes.content;
        }
        if (tagName === 'TITLE') {
            meta.title = tagContent;
        }
        if (tagName === 'DESCRIPTION') {
            meta.description = tagContent;
        }
        if (tagName === 'LINK' && tagAttributes.rel === 'shortcut icon' && tagAttributes.href) {
            meta.icon = tagAttributes.href;
        }
        if (tagName === 'LINK' && tagAttributes.rel === 'icon' && tagAttributes.href) {
            meta.icon = tagAttributes.href;
        }
        if (tagName === 'LINK' && tagAttributes.rel === 'apple-touch-icon' && tagAttributes.href) {
            meta.icon = tagAttributes.href;
        }

        // console.log(tagName, tagAttributes, tagContent);
        // console.log(tagName);
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
            themeColor: meta.themeColor,
        },
    };
    if (req.isGraphql) {
        // req.mongoFields
        return response.data;
    }
    return utilHtml.renderApi(req, res, 200, { ...response }, { cacheTime: isDevelopment ? 0 : 60 });
};
