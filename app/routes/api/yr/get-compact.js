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

const { routeName, routePath, run, webUtil, utilHtml, util } = require('../../../middleware/init')({ __filename, __dirname });

function getApi(apiUrl, query) {
    return new Promise((resolve, reject) => {
        let apiData = '';
        const queryString = querystring.stringify(query);
        const options = {
            headers: {
                'User-Agent': 'some app v1.3 (sorenso@gmail.com)',
            }
        };
        https.get(`${apiUrl}?${queryString}`, options, (res) => {
            // console.log('statusCode:', res.statusCode);
            // console.log('headers:', res.headers);

            res.on('data', (chunk) => {
                apiData += chunk.toString('utf8');
            });

            res.on('end', () => {
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
    const { runOpt } = run(req);

    // const requiredFields = ['lat', 'lon'];
    // if (!webUtil.hasAllRequiredFields(req, res, 'query', requiredFields)) {
    //     return false;
    // }
    const { name, altitude, lat, lon } = req.query;
    if (!name && !altitude && !lat && !lon) {
        const response = {
            status: 400,
            message: `Missing input. You must have at least: lat, lon.`,
        };
        return utilHtml.renderApi(req, res, 400, { ...response });
    }

    const data = await getApi(`https://api.met.no/weatherapi/locationforecast/2.0/compact`, {
        altitude: parseInt(altitude, 10) || 0,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
    });
    // console.log(data);

    const timeseries = tc.getNestedValue(data, 'properties.timeseries');
    const weatherdata = timeseries.map(e => ({
        time: e.time,
        date: new Date(e.time),
        name,
        altitude: parseInt(altitude, 10),
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        ...e.data,
    }));

    // console.log('resultInsertMany', resultInsertMany);

    const response = {
        status: 200,
        message: 'Yr data',
        // data: tc.getNestedValue(data, 'properties.timeseries'),
        data: weatherdata,
    };
    if (req.isGraphql) {
        // req.mongoFields
        return response.data;
    }
    return utilHtml.renderApi(req, res, 200, { ...response }, { cacheTime: 3600 });
};
