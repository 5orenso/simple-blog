/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const tc = require('fast-type-check');

const { routeName, routePath, run, webUtil } = require('../../middleware/init')({ __filename, __dirname });

const Category = require('../../../lib/class/category');
const Iot = require('../../../lib/class/iot');
const Es = require('../../../lib/class/elasticsearch');

function fixIotResults(iotResults) {
    const finalResult = {};
    const resultKeys = Object.keys(iotResults);
    for (let i = 0, l = resultKeys.length; i < l; i += 1) {
        const type = resultKeys[i];
        const mainBucket = iotResults[type].aggregations[2].buckets;
        if (tc.isArray(mainBucket)) {
            // Graph
            // eslint-disable-next-line no-loop-func
            mainBucket.forEach((bucket) => {
                if (tc.isObject(bucket[3].buckets)) {
                    const dataBuckets = bucket[3].buckets;
                    // console.log('dataBuckets', dataBuckets);
                    // dataBuckets {
                    //     Kontor: { '1': { value: 49.56250031789144 }, doc_count: 72 },
                    //     Soverom: { '1': { value: 58.35000038146973 }, doc_count: 8 },
                    //     Stue: { '1': { value: 52.29999923706055 }, doc_count: 5 },
                    //     Ute: { '1': { value: 65.9000015258789 }, doc_count: 6 }
                    // }
                    Object.keys(dataBuckets).forEach((device) => {
                        const dataBucket = dataBuckets[device];
                        // console.log('dataBucket', dataBucket);

                        if (!tc.isObject(finalResult[device])) {
                            finalResult[device] = {};
                        }
                        if (!tc.isArray(finalResult[device][type])) {
                            finalResult[device][type] = [];
                            finalResult[device][`${type}SimpleGraph`] = [];
                        }
                        let value;
                        if (tc.isNumber(dataBucket[1].value)) {
                            value = dataBucket[1].value;
                        } else if (tc.isObject(dataBucket[1])
                            && tc.isArray(dataBucket[1].values)
                            && tc.isNumber(dataBucket[1].values[0].value)) {
                            value = dataBucket[1].values[0].value;
                        }
                        finalResult[device][type].push([bucket.key, value]);
                        if (tc.isNumber(value)) {
                            finalResult[device][`${type}SimpleGraph`].push({
                                x: finalResult[device][`${type}SimpleGraph`].length,
                                y: value,
                            });
                        }
                    });
                }
            });
        } else {
            // Gauge
            Object.keys(mainBucket).forEach((device) => {
                const val = mainBucket[device];
                if (!tc.isObject(finalResult[device])) {
                    finalResult[device] = {};
                }
                finalResult[device][type] = val[1].value;
            });
        }
        // console.log('finalResult', JSON.stringify(finalResult, null, 4));
    }

    return finalResult;
}

module.exports = async (req, res) => {
    const { hrstart, runId } = run(req);

    const cat = new Category();
    const iot = new Iot();

    const iotlist = await iot.find();

    const es = new Es(req.config.elasticsearch);
    es.connect();

    const iotResults = {};
    const promises = iotlist.map(async (iotEntry) => {
        iotResults[iotEntry.alias] = await es.search(JSON.parse(iotEntry.esQuery));
    });
    await Promise.all(promises);
    const iotResultsFixed = fixIotResults(iotResults);

    const category = await cat.findOne({ title: req.params.category });
    const catlist = await cat.find();

    const template = '/bootstrap4/iot_v2.html';

    webUtil.sendResultResponse(req, res, {
        category,
        catlist,
        iotlist,
        iotResultsFixed,
    }, { runId, routePath, routeName, hrstart, useTemplate: template });
};