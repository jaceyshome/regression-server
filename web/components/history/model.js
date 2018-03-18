const joi = require('joi');
const helpers = require('./../../../helpers');
const spec = require('./../../spec/');
const nedb = require('./../../../models/nedb');

const schemaNewHistory = joi.object().keys({
    instance: joi.string().allow(spec.definitions.History.properties.instance.enum).required(),
    server: joi.string().allow(spec.definitions.History.properties.server.enum).required()
}).without('createdAt', '_id');


let historyModel = {

    saveNewHistory(candidate) {

        const {error, value: data} = joi.validate(candidate, schemaNewHistory);
        if (error) {
            throw new Error(`Invalid new history data: ${error.message}`)
        }

        data.createdAt = helpers.dates.getDateTime();

        return new Promise((resolve, reject)=> {
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
            nedb.datastore.histories.findOne({}).sort({}).limit(1).exec((err, result) => {
                if(err){
                    throw new Error(`Failed to find the latest history: ${err}`);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
};

module.exports = historyModel;