const joi = require('joi');
const helpers = require('./../../../helpers');
const spec = require('./../../spec/');
const nedb = require('./../../../models/nedb');

const schemaNewFunctionalTestResult = joi.object().keys({
    historyId: joi.string().required(),
    report: joi.string().required()
}).without('createdAt', '_id');

let reportModel = {

    saveReport(candidate) {

        return new Promise((resolve, reject)=> {

            const {error, value: data} = joi.validate(candidate, schemaNewFunctionalTestResult);
            if (error) {
                return reject(helpers.logger.error(`Invalid data for the new report file: ${error.message}`));
            }
            data.createdAt = helpers.dates.getDateTime();
            data.resourceType = spec.definitions.Record.properties.resourceType.enum[2];

            nedb.datastore.records.insert(data, (err, result)=> {
                if(err){
                    return reject(helpers.logger.error(`Failed to save a report result: ${err}`));
                } else {
                    return resolve(result);
                }
            });

        });
    },

    getReport(historyId) {
        return new Promise((resolve, reject)=> {
            let data = {
                historyId: historyId,
                resourceType: spec.definitions.Record.properties.resourceType.enum[2]
            };
            nedb.datastore.records.findOne(data, (err, result)=> {
                if(err){
                    return reject(helpers.logger.error(`Failed to find the matched report:
                                                        ${err} for ${JSON.stringify(data)}`));
                } else {
                    resolve(result);
                }
            });
        });
    },
};

module.exports = reportModel;
