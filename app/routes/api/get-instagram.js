/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2014 Øistein Sørensen
 * Licensed under the MIT license.
 */

const https = require('https');
const querystring = require('querystring');

const { routeName, routePath, run, webUtil, utilHtml, util, tc } = require('../../middleware/init')({ __filename, __dirname });

function getApi(apiUrl, query) {
    return new Promise((resolve, reject) => {
        let apiData = '';
        const queryString = tc.isString(query) ? query : querystring.stringify(query);
        const options = {
            headers: {
Host: 'i.instagram.com',
'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:92.0) Gecko/20100101 Firefox/92.0',
'Accept': '*/*',
'Accept-Language': 'en-GB,en;q=0.5',
'Accept-Encoding': 'gzip, deflate, br',
'X-IG-App-ID': '936619743392459',
'X-ASBD-ID': '198387',
'X-IG-WWW-Claim': 'hmac.AR38ZWmzds1ITBsjjcFnyvH1heHe8mt8ibs2a01jrlGyIixJ',
Origin: 'https://www.instagram.com',
'Alt-Used': 'i.instagram.com',
Connection: 'keep-alive',
Referer: 'https://www.instagram.com/',
Cookie: 'mid=YI6KNQAEAAFb4wDvWkc6snz2G1pb; ig_did=F94BE15F-684D-42CB-A5A9-E4AF1279FC4E; fbm_124024574287414=base_domain=.instagram.com; sessionid=15759898%3Ai9tXG8OLOBxIQR%3A5; ds_user_id=15759898; csrftoken=jqE4ZhuimtJdqMo6mw8hlNUoSBnEZwt8; rur="CLN\05415759898\0541663412083:01f73b492135c5f178d7caa31ee38cb2433a67db36f9a0fed61ad8e0a503b12df2b33577"; shbid="13154\05415759898\0541663411740:01f79e2dee30bd8c1c644d1794d7ffc2ff7d089415262d8ca05653bdd8f5ec68b26d284d"; shbts="1631875740\05415759898\0541663411740:01f75da1bcb9f887cd16cf633ddabd402669fa19f524369f94b30a4db2eff42bf553376f"',
'Sec-Fetch-Dest': 'empty',
'Sec-Fetch-Mode': 'cors',
'Sec-Fetch-Site': 'same-site',
'Cache-Control': 'max-age=0',
TE: 'trailers',
            }
        };
        https.get(`${apiUrl}?${queryString}`, options, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);

            res.on('data', (chunk) => {
                console.log(chunk.toString('utf8'));
                apiData += chunk.toString('utf8');
            });

            res.on('end', () => {
                // console.log(apiData);
                try {
                    resolve(JSON.parse(apiData));
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
    const { hrstart, runId } = run(req);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    const results = await getApi('https://i.instagram.com/api/v1/collections/list/', 'collection_types=%5B%22ALL_MEDIA_AUTO_COLLECTION%22%2C%22MEDIA%22%5D&include_public_only=0&get_cover_media_lists=true&max_id=');
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    const data = {
        data: results,
        status: 200,
    };
    return utilHtml.renderApi(req, res, 200, data);
};
