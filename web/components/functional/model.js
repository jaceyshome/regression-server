const joi = require('joi');
const helpers = require('./../../../helpers');
const spec = require('./../../spec/');
const nedb = require('./../../../models/nedb');

const schemaNewFunctionalTestResult = joi.object().keys({
    historyId: joi.string().required(),
    functionalResult: joi.string().required()
}).without('createdAt', '_id');

let functionalModel = {

    addFunctionalTestResult(candidate) {

        return new Promise((resolve, reject)=> {

            const {error, value: data} = joi.validate(candidate, schemaNewFunctionalTestResult);
            if (error) {
                return reject(helpers.logger.error(`Invalid data for the new functional test: ${error.message}`));
            }
            data.createdAt = helpers.dates.getDateTime();
            data.resourceType = spec.definitions.Record.properties.resourceType.enum[2];

            nedb.datastore.records.insert(data, (err, result)=> {
                if(err){
                    return reject(helpers.logger.error(`Failed to insert a new functional test result: ${err}`));
                } else {
                    return resolve(result);
                }
            });

        });
    },

    getFunctionalTestResult(historyId) {
        return new Promise((resolve, reject)=> {
            let data = {
                historyId: historyId,
                resourceType: spec.definitions.Record.properties.resourceType.enum[2]
            };
            nedb.datastore.records.findOne(data, (err, result)=> {
                if(err){
                    return reject(helpers.logger.error(`Failed to find the matched functional test result: 
                                                        ${err} for ${JSON.stringify(data)}`));
                } else {
                    resolve(result);
                }
            });
        });
    },
};

module.exports = functionalModel;