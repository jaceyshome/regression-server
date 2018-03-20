const joi = require('joi');
const helpers = require('./../../../helpers');
const spec = require('./../../spec/');
const nedb = require('./../../../models/nedb');

const schemaNewVisualTest = joi.object().keys({
    historyId: joi.string().required(),
    visualReferenceId: joi.string().required(),
    visualScreenshot: joi.string().required(),
    visualDiffer: joi.string().optional()
}).without('createdAt', 'approvedAt');

const schemaSearchReference = joi.object().keys({
    historyId: joi.string().required(),
    visualScreenshot: joi.string().required(),
    resourceType: joi.string().allow(spec.definitions.Record.properties.resourceType.enum[1]).required(),
    isArchived: joi.boolean().optional()
}).without('createdAt', '_id');

const schemaNewReference = joi.object().keys({
    historyId: joi.string().required(),
    visualScreenshot: joi.string().required()
}).without('createdAt', '_id');

const schemaArchiveReference = joi.object().keys({
    _id: joi.string().required()
});

let visualModel = {

    saveNewVisualTest(candidate) {

        return new Promise((resolve, reject)=> {

            const {error, value: data} = joi.validate(candidate, schemaNewVisualTest);
            if (error) {
                return reject(helpers.logger.error(`Invalid new visual test data: ${error.message}`));
            }
            if(candidate.visualDiffer) {
                data.visualDiffer = candidate.visualDiffer;
            }
            data.createdAt = helpers.dates.getDateTime();
            data.resourceType = spec.definitions.Record.properties.resourceType.enum[0];
            data.isArchived = false;
            data.pass = data.visualDiffer ? false : true;

            nedb.datastore.records.insert(data, (err, result)=> {
                if(err){
                    return reject(helpers.logger.error(`Failed to insert a new history: ${err}`));
                } else {
                    return resolve(result);
                }
            });
        });
    },

    saveNewVisualReference(candidate) {

        return new Promise((resolve, reject)=> {

            const {error, value: data} = joi.validate(candidate, schemaNewReference);
            if (error) {
                return reject(helpers.logger.error(`Invalid new visual reference data: ${error.message}`));
            }

            data.createdAt = helpers.dates.getDateTime();
            data.resourceType = spec.definitions.Record.properties.resourceType.enum[1];
            data.isArchived = false;

            nedb.datastore.records.insert(data, (err, result)=> {
                if(err){
                    return reject(helpers.logger.error(`Failed to insert a new history: ${err}`));
                } else {
                    resolve(result);
                }
            });
        });
    },

    listHistoryVisualTests(historyId) {

        return new Promise((resolve, reject)=> {
            if(!historyId){
                return reject(helpers.logger.error("History id is required to list history visual tests"));
            }
            nedb.datastore.records.find({
                historyId: historyId,
                resourceType: spec.definitions.Record.properties.resourceType.enum[0]
            }, (err, result)=> {
                if(err){
                    return reject(helpers.logger.error(`Failed to list history: ${err}`));
                } else {
                    resolve(result);
                }
            });
        });

    },

    listVisualReferences() {
        
        return new Promise((resolve, reject)=> {
            nedb.datastore.records.find({
                resourceType: spec.definitions.Record.properties.resourceType.enum[1],
                isArchived: false
            }, (err, result)=> {
                if(err){
                    return reject(helpers.logger.error(`Failed to insert a new history: ${err}`));
                } else {
                    resolve(result);
                }
            });
        });

    },

    /**
     * Get reference by search object
     * @param {Object} candidate
     * @param {string} candidate._id
     */
    findOneRecord(candidate) {
        return new Promise((resolve, reject)=> {
            nedb.datastore.records.findOne(candidate, (err, result)=> {
                if(err){
                    return reject(helpers.logger.error(`Failed to find the matched reference: 
                                                        ${err} for ${JSON.stringify(candidate)}`));
                } else {
                    resolve(result);
                }
            });
        });
    },

    /**
     * Get reference by search object
     * @param {Object} candidate
     */
    findOneReference(candidate) {

        return new Promise((resolve, reject)=> {

            const {error, value: data} = joi.validate(candidate, schemaSearchReference);
            if (error) {
                return reject(helpers.logger.error(`Invalid option for finding the record: ${error.message}`));
            }
            let id = candidate._id;
            nedb.datastore.records.findOne(candidate, (err, result)=> {
                if(err){
                    return reject(helpers.logger.error(`Failed to find the matched reference: ${err} for ${candidate}`));
                } else {
                    resolve(result);
                }
            });
            
        });
    },

    archiveReference(candidate) {

        return new Promise((resolve, reject)=> {

            const {error, value: data} = joi.validate(candidate, schemaArchiveReference);
            if (error) {
                return reject(helpers.logger.error(`Invalid archive reference: ${error.message}`));
            }
            nedb.datastore.records.update({_id: candidate._id}, { $set: { isArchived: true } }, (err, result)=> {
                if(err){
                    return reject(helpers.logger.error(`Failed to find the matched reference: ${err} for ${candidate}`));
                } else {
                    resolve(result);
                }
            });
        });
    },

    approveVisualTest(candidate) {

        return new Promise((resolve, reject)=> {

            let approvedAt = helpers.dates.getDateTime();

            nedb.datastore.records.update(candidate, { $set: {
                pass: true,
                approvedAt: approvedAt
            }}, (err, result)=> {
                if(err){
                    return reject(helpers.logger.error(`Failed to find the matched reference: ${err} for ${candidate}`));
                } else {
                    resolve(result);
                }
            });

        });
    }

};

module.exports = visualModel;