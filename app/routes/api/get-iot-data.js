/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2019 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const tc = require('fast-type-check');

const { run, webUtil, utilHtml, util } = require('../../middleware/init')({ __filename, __dirname });
const Iot = require('../../../lib/class/iot');
const Es = require('../../../lib/class/elasticsearch');

function isInBounds(value) {
    if (value === -127) {
        return false;
    }
    return true;
}

function fixIotResults(iotResults) {
    const finalResult = {};
    const resultKeys = Object.keys(iotResults);
    // console.log(resultKeys);
    for (let i = 0, l = resultKeys.length; i < l; i += 1) {
        const type = resultKeys[i];
        // console.log('==> type', type);
        iotResults[type].forEach((resultSet) => {
            const mainBucket = resultSet.aggregations[2].buckets;
            // if (type === 'moistureGraph') {
            //     console.log('----> mainBucket', JSON.stringify(mainBucket, null, 4));
            // }
            if (tc.isArray(mainBucket)) {
                // Graph
                // eslint-disable-next-line no-loop-func
                mainBucket.forEach((bucket) => {
                    // console.log('===> bucket', bucket);
                    if (util.isDefined(bucket, 3, 'buckets') && tc.isObject(bucket[3].buckets)) {
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
                            if (tc.isNumber(value) && isInBounds(value)) {
                                finalResult[device][`${type}SimpleGraph`].push({
                                    x: finalResult[device][`${type}SimpleGraph`].length,
                                    y: value,
                                });
                            }
                        });
                    } else if (util.isDefined(bucket, 3, 'buckets') && tc.isArray(bucket[3].buckets)) {
                        const dataBuckets = bucket[3].buckets;
                        // console.log('====> bucket[3].buckets array', dataBuckets);
                        // console.log('dataBuckets', dataBuckets);
                        // dataBuckets {
                        //     Kontor: { '1': { value: 49.56250031789144 }, doc_count: 72 },
                        //     Soverom: { '1': { value: 58.35000038146973 }, doc_count: 8 },
                        //     Stue: { '1': { value: 52.29999923706055 }, doc_count: 5 },
                        //     Ute: { '1': { value: 65.9000015258789 }, doc_count: 6 }
                        // }
                        dataBuckets.forEach((dataBucket) => {
                            // console.log('----> dataBucket', dataBucket);
                            const device = dataBucket.key;
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
                            if (tc.isNumber(value) && isInBounds(value)) {
                                finalResult[device][`${type}SimpleGraph`].push({
                                    x: finalResult[device][`${type}SimpleGraph`].length,
                                    y: value,
                                });
                            }
                        });
                    } else if (util.isDefined(bucket) && tc.isObject(bucket)) {
                        // console.log('====> bucket object plain', bucket);
                        const val = bucket[1].value;
                        const device = bucket.key;
                        if (!tc.isObject(finalResult[device])) {
                            finalResult[device] = {};
                        }
                        finalResult[device][type] = val;
                    } else {
                        console.log('====> NO ACTION: bucket', bucket);
                    }
                });
            } else {
                // Gauge
                // console.log('====> mainBucket', mainBucket);
                Object.keys(mainBucket).forEach((device) => {
                    const val = mainBucket[device];
                    if (!tc.isObject(finalResult[device])) {
                        finalResult[device] = {};
                    }
                    finalResult[device][type] = val[1].value;
                });
            }
        });
        // console.log('finalResult', JSON.stringify(finalResult, null, 4));
    }
    return finalResult;
}

module.exports = async (req, res) => {
    run(req);
    const iot = new Iot();

    let query = { id: req.params.id };
    if (!req.params.id && req.query.iot) {
        query = { title: req.query.iot };
    }
    query = webUtil.cleanObject(query);

    let data = {};
    if (query.id) {
        const chipId = parseInt(req.query.chipId, 10);
        const myIot = await iot.findOne(query);
        const es = new Es(req.config.elasticsearch);
        es.connect();
        const iotResults = {};

        if (!tc.isArray(iotResults[myIot.alias])) {
            iotResults[myIot.alias] = [];
        }
        const esQuery = myIot.esQuery;
        const esQueryObj = JSON.parse(esQuery);

        delete esQueryObj.query.bool.must[0].match_all;
        esQueryObj.query.bool.must[0].query_string = {
            query: `chipId: ${chipId}`,
            analyze_wildcard: true,
        };
        // console.log(JSON.stringify(esQueryObj, null, 4));
        iotResults[myIot.alias].push(await es.search(esQueryObj));
        const iotResultsFixed = fixIotResults(iotResults);
        const finalResults = util.asObject(iotResultsFixed, chipId, `${myIot.alias}SimpleGraph`) || [];

        // console.log(iotResultsFixed, chipId, myIot.alias);
        // console.log(iotResultsFixed[chipId][`${myIot.alias}SimpleGraph`]);

        data = finalResults;
    }
    utilHtml.renderApi(req, res, 200, data);
};
