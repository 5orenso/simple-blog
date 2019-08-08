'use strict';

const elasticsearch = require('elasticsearch');

class Es {
    constructor(config) {
        this.config = config;
    }

    connect() {
        const client = new elasticsearch.Client({
            hosts: [
                'https://search-iot-nodemcu-iz3plijisu7wcxcn7ay5nai62m.eu-west-1.es.amazonaws.com',
            ],
        });
        this.client = client;
        return client;
    }

    health() {
        return new Promise((resolve, reject) => {
            this.client.cluster.health({}, (err, resp, status) => {
                if (err) {
                    reject(err);
                }
                console.log('-- Client Health --', status, resp);
                resolve(true);
            });
        });
    }

    search(esQuery = {}) {
        return new Promise((resolve, reject) => {
            const rangeInMilliSeconds = 2 * 24 * 3600 * 1000;
            const now = new Date();
            const epochFrom = parseInt(now.getTime(), 10) - rangeInMilliSeconds;
            const epochTo = parseInt(now.getTime(), 10);

            // eslint-disable-next-line no-param-reassign
            esQuery.query.bool.must[1].range.datetime.gte = epochFrom;
            // eslint-disable-next-line no-param-reassign
            esQuery.query.bool.must[1].range.datetime.lte = epochTo;

            this.client.search({
                index: 'iot-nodemcu',
                body: esQuery,
            }, (error, response, status) => {
                if (error) {
                    console.log(`search error: ${status}: ${error}`);
                    reject(error);
                } else {
                    // console.log(JSON.stringify(response, null, 4));
                    resolve(response);
                }
            });
        });
    }
}

module.exports = Es;
