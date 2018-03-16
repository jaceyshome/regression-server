'use strict';
const fs= require('fs-extra');
const Datastore = require('nedb');
const schemaNames = ["histories", "records"];

let datastore = {};

async function initPersistentDataStore(options) {
    const dbExists = await fs.exists(options.filename);
    let store;
    if(!dbExists) {
        store = new Datastore({ filename: options.filename });
    } else {
        store = new Datastore(options.filename);
    }
    store.loadDatabase();
    return store;
}

async function initInMemoryDataStore() {
    return new Datastore();
}

function nedb(options = {}) {

    if (options.inMemoryOnly === null) {
        throw new TypeError('Nedb options required');
    }

    schemaNames.forEach((schemaName)=> {
        datastore[schemaName] = (options.inMemoryOnly) ?
                        initInMemoryDataStore(options) :
                        initPersistentDataStore(Object.assign({}, options, {
                            filename: `${options.filename}${schemaName}.ds`
                        }));
    });

    return async (ctx, next) => {
        ctx.datastore = datastore;
        await next();
    };
}

module.exports = nedb;
