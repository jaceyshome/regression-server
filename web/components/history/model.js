const joi = require('joi');
const helpers = require('./../../../helpers');
const spec = require('./../../spec/');
const nedb = require('./../../../models/nedb');

const schemaNewHistory = joi.object().keys({
    instance: joi.string().allow(spec.definitions.History.properties.instance.enum).required(),
    weight: joi.number().integer().min(1).required(),
    server: joi.string().allow(spec.definitions.History.properties.server.enum).required()
}).without('createdAt', '_id');


let historyModel = {

    countHistories() {
        return new Promise((resolve, reject)=> {
            nedb.datastore.histories.count({}, (err, result)=> {
                if(err){
                    throw new Error(`Failed to insert a new history: ${err}`);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    saveNewHistory(candidate) {

        const {error, value: data} = joi.validate(candidate, schemaNewHistory);
        if (error) {
            throw new Error(`Invalid new history data: ${error.message}`)
        }

        return new Promise((resolve, reject)=> {
            data.createdAt = helpers.dates.getDateTime();

            nedb.datastore.histories.insert(data, (err, result)=> {
                if(err){
                    throw new Error(`Failed to insert a new history: ${err}`);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    getTheLatestHistory() {
        return new Promise((resolve, reject)=> {
            nedb.datastore.histories.find({}).sort({weight: -1}).limit(1).exec((err, result) => {
                if(err){
                    throw new Error(`Failed to find the latest history: ${err}`);
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
    }
};

module.exports = historyModel;