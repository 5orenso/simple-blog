'use strict';

const idb = require('idb');
const util = require('./util');

const debug = false;
const verbose = false;

class IndexDb {
    constructor(config) {
        this.config = config;
    }

    // IndexedDB Stuff
    indexedDBCheckCompability() {
        return new Promise((resolve, reject) => {
            if (!('indexedDB' in window)) {
                return reject('This browser doesn\'t support IndexedDB');
            }
            return resolve('Ok! IndexedDB supported');
        });
    }
    indexedDBCheckOpen(dbName) {
        return new Promise((resolve, reject) => {
            this.dbh = idb.open(dbName, 2, (upgradeDb) => {
                if (debug) {
                    console.log('IndexDbClass.indexedDBCheckOpen: making a new object store');
                }
                if (!upgradeDb.objectStoreNames.contains('events')) {
                    const events = upgradeDb.createObjectStore('events', { keyPath: 'id' });
                    events.createIndex('id', 'id', { unique: true });
                    events.createIndex('time', 'time', { unique: false });
                }
            });
            return resolve(this.dbh);
        });
    }
    indexedDBSave(collection, item) {
        if (debug) {
            if (verbose) {
                console.log('IndexDbClass.indexedDBSave', item);
            } else {
                console.log('IndexDbClass.indexedDBSave', item.id, item.type,
                    util.displayDate(item.time), util.displayTime(item.time, false, true));
            }
        }
        return this.dbh.then((db) => {
            const tx = db.transaction(collection, 'readwrite');
            const store = tx.objectStore(collection);
            store.add(item);
            return tx.complete;
        }).then(function() {
            if (debug) {
                console.log('IndexDbClass.indexedDBSave: added item to the store os!', item.id);
            }
        }).catch(err => console.error('indexedDBSave', collection, item, err));
    }
    indexedDBGet(collection, key) {
        if (debug) {
            console.log('IndexDbClass.indexedDBGet', key);
        }
        return this.dbh.then(function(db) {
            const tx = db.transaction(collection, 'readonly');
            const store = tx.objectStore(collection);
            return store.get(key);
        })
            .then(val => val)
            .catch(err => console.error('indexedDBGet', err));
    }
    indexedDBCount(collection) {
        if (debug) {
            console.log('IndexDbClass.indexedDBCount');
        }
        return this.dbh.then(function(db) {
            const tx = db.transaction(collection, 'readonly');
            const store = tx.objectStore(collection);
            return store.count();
        })
            .catch(err => console.error('indexedDBCount', err));
    }
    indexedDBSearchByTime(collection, lower, upper) {
        if (debug) {
            console.log('IndexDbClass.indexedDBSearchByTime', collection, lower, upper,
                util.displayDate(lower), util.displayTime(lower, false, true),
                util.displayDate(upper), util.displayTime(upper, false, true));
        }
        if (typeof lower === 'undefined' && typeof upper === 'undefined') {
            return;
        }
        let range;
        if (typeof lower === 'number' && typeof upper === 'number') {
            range = IDBKeyRange.bound(lower, upper);
        } else if (typeof upper === 'number') {
            range = IDBKeyRange.upperBound(upper);
        } else {
            range = IDBKeyRange.lowerBound(lower);
        }
        const events = [];
        return this.dbh.then((db) => {
            const tx = db.transaction(collection, 'readonly');
            const store = tx.objectStore(collection);
            const index = store.index('time');
            return index.openCursor(range);
        }).then(function showRange(cursor) {
            if (!cursor) {
                return;
            }
            const event = {};
            for (var field in cursor.value) {
                event[field] = cursor.value[field];
            }
            events.push(event);
            return cursor.continue().then(showRange);
        }).then(() => {
            return events;
        })
        .catch(err => console.error('indexedDBSearchByTime', err));
    }
    indexedDBDeleteOldItemsByTime(collection, upper) {
        if (debug) {
            console.log('IndexDbClass.indexedDBDeleteOldItemsByTime', collection, upper,
                util.displayDate(upper), util.displayTime(upper, false, true));
        }
        if (typeof upper === 'undefined') {
            return;
        }
        let range;
        if (typeof upper === 'number') {
            range = IDBKeyRange.upperBound(upper);
        }
        let tx;
        let store;
        let index;
        return this.dbh.then((db) => {
            tx = db.transaction(collection, 'readwrite');
            store = tx.objectStore(collection);
            index = store.index('time');
            return index.openCursor(range);
        }).then(function showRange(cursor) {
            if (!cursor) {
                return;
            }
            if (debug && verbose) {
                console.log('IndexDbClass.indexedDBDeleteOldItemsByTime.delete:', `${cursor.key}: id=${cursor.value.id}, primaryKey: ${cursor.primaryKey}`);
            }
            store.delete(cursor.primaryKey);
            return cursor.continue().then(showRange);
        })
        // .then(() => {
        //     return tx.complete.then(() => 'done');
        // })
        .catch(err => console.error('indexedDBDeleteOldItemsByTime', err));
    }


};

// return this.indexedDBCheckCompability()
//     .then(() => this.indexedDBCheckOpen('eventViewer'))
//     .then(() => {

// this.indexedDBGet('events', ev.id)
//     .then(dbEvent => {
//         if (typeof dbEvent === 'undefined') {
//             return this.indexedDBSave('events', ev);
//         }
//     })
//     .catch(err => console.error('doHandleMessage', event, err));
