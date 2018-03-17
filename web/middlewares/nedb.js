'use strict';
const fs = require('fs-extra');
const Datastore = require('nedb');
const schemaNames = ["histories", "records"];

let datastore = {};

function initPersistentDataStore(options) {
    const dbExists = fs.exists(options.filename);
    let store;
    if (!dbExists) {
        store = new Datastore(options);
    } else {
        store = new Datastore(options.filename);
    }
    store.loadDatabase();
    return store;
}

function initInMemoryDataStore() {
    return new Datastore();
}

function nedb(options = {}) {

    if (options.inMemoryOnly === null) {
        throw new TypeError('Nedb options required');
    }

    return async (ctx, next) => {

        schemaNames.forEach((schemaName) => {
            if(options.inMemoryOnly){
                datastore[schemaName] = initInMemoryDataStore(options);
            } else {
                datastore[schemaName] = initPersistentDataStore(Object.assign({}, options, {
                    filename: `${options.filename}${schemaName}.ds`
                }));
            }
        });

        ctx.datastore = datastore;
        await next();
    };
}

module.exports = nedb;
