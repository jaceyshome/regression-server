const joi = require('joi');
const helpers = require('./../../../helpers');
const spec = require('./../../spec/');
const nedb = require('./../../../models/nedb');

const schemaNewReference = joi.object().keys({
    instance: joi.string().required(),
    server: joi.string().required(),
    historyId: joi.string().required(),
    browser: joi.string().required(),
    url: joi.string().required(),
    name: joi.string().optional(),
    visualScreenshot: joi.string().required(),
    visualScreenshotPath: joi.string().required()
}).without('createdAt', '_id');

const schemaVisualTestResult = joi.object().keys({
    historyId: joi.string().required(),
    visualReferenceId: joi.string().required(),
    browser: joi.string().required(),
    url: joi.string().required(),
    name: joi.string().required(),
    visualScreenshot: joi.string().required(),
    visualScreenshotPath: joi.string().required(),
    isSameDimensions: joi.boolean().optional(),
    misMatchPercentage: joi.number().optional(),
    visualDiffer: joi.string().optional(),
    visualDifferPath: joi.string().optional()
}).without('createdAt', 'approvedAt');

const schemaSearchReference = joi.object().keys({
    historyId: joi.string().required(),
    visualScreenshot: joi.string().required(),
    resourceType: joi.string().allow(spec.definitions.Record.properties.resourceType.enum[1]).required(),
    isArchived: joi.boolean().optional(),
    instance: joi.string().optional(),
    server: joi.string().optional()
}).without('createdAt', '_id');

const schemaArchiveReference = joi.object().keys({
    _id: joi.string().required()
});

const schemaListReference = joi.object().keys({
    instance: joi.string().allow(spec.definitions.History.properties.instance.enum).required(),
    server: joi.string().allow(spec.definitions.History.properties.server.enum).required()
});

let visualModel = {

    saveVisualTestResult(candidate) {

        return new Promise((resolve, reject)=> {

            const {error, value: data} = joi.validate(candidate, schemaVisualTestResult);
            if (error) {
                console.log("AAAADASDA", error);
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

    listVisualReferences(candidate) {

        return new Promise((resolve, reject)=> {

            const {error, value: data} = joi.validate(candidate, schemaListReference);
            if (error) {
                return reject(helpers.logger.error(`Invalid options for listing reference: ${error.message}`));
            }

            nedb.datastore.records.find({
                resourceType: spec.definitions.Record.properties.resourceType.enum[1],
                instance: data.instance,
                server: data.server,
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