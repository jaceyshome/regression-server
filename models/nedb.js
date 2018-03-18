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

async function setup(options = {}) {

    if (options.inMemoryOnly === null) {
        throw new TypeError('Nedb options required');
    }

    schemaNames.forEach((schemaName) => {
        if(options.inMemoryOnly){
            datastore[schemaName] = initInMemoryDataStore(options);
        } else {
            datastore[schemaName] = initPersistentDataStore(Object.assign({}, options, {
                filename: `${options.filename}${schemaName}.ds`
            }));
        }
    });

    return await datastore;
}

exports.setup = setup;
exports.datastore = datastore;
