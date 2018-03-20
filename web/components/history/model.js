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
                    return reject(helpers.logger.error(`Failed to insert a new history: ${err}`));
                } else {
                    resolve(result);
                }
            });
        });
    },

    saveNewHistory(candidate) {

        return new Promise((resolve, reject)=> {
            const {error, value: data} = joi.validate(candidate, schemaNewHistory);
            if (error) {
                return reject(helpers.logger.error(`Invalid new history data: ${error.message}`));
            }
            data.createdAt = helpers.dates.getDateTime();

            nedb.datastore.histories.insert(data, (err, result)=> {
                if(err){
                    return reject(helpers.logger.error(`Failed to insert a new history: ${err}`));
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
                    return reject(helpers.logger.error(`Failed to find the latest history: ${err}`));
                } else {
                    resolve(result[0]);
                }
            });
        });
    },

    /**
     * Get reference by search object
     * @param {Object} candidate
     * @param {string} candidate._id
     */
    findOneHistory(candidate) {
        return new Promise((resolve, reject)=> {
            nedb.datastore.records.findOne(candidate, (err, result)=> {
                if(err){
                    return reject(helpers.logger.error(`Failed to find the matched reference: ${err} for ${JSON.stringify(candidate)}`));
                } else {
                    resolve(result);
                }
            });
        });
    }


};

module.exports = historyModel;