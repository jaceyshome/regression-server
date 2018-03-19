const joi = require('joi');
const helpers = require('./../../../helpers');
const spec = require('./../../spec/');
const nedb = require('./../../../models/nedb');

const schemaNewVisualTest = joi.object().keys({
    historyId: joi.string().required(),
    referenceId: joi.string().required(),
    visualScreenshot: joi.string().required()
}).without('createdAt', 'approvedAt');

const schemaReference = joi.object().keys({
    historyId: joi.string().required(),
    visualScreenshot: joi.string().required()
}).without('createdAt', '_id');

//TODO approveVisualTest add user name
const schemaApprovingVisualTest = joi.object().keys({
    _id: joi.string().required(),
    historyId: joi.string().required()
});

const schemaArchiveReference = joi.object().keys({
    _id: joi.string().required()
});

const schemaSearchCandidate = joi.object().keys({
    _id: joi.string().required()
});

let visualModel = {

    saveNewVisualTest(candidate) {

        const {error, value: data} = joi.validate(candidate, schemaNewVisualTest);
        if (error) {
            throw new Error(`Invalid new visual test data: ${error.message}`)
        }

        data.createdAt = helpers.dates.getDateTime();
        data.resourceType = spec.definitions.Record.properties.resourceType.enum[0];
        data.isArchived = false;
        data.pass = data.visualDiffer ? false : true;

        return new Promise((resolve, reject)=> {
            nedb.datastore.records.insert(data, (err, result)=> {
                if(err){
                    throw new Error(`Failed to insert a new history: ${err}`);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    saveNewVisualReference(candidate) {

        const {error, value: data} = joi.validate(candidate, schemaReference);
        if (error) {
            throw new Error(`Invalid new visual reference data: ${error.message}`)
        }

        data.createdAt = helpers.dates.getDateTime();
        data.resourceType = spec.definitions.Record.properties.resourceType.enum[1];
        data.isArchived = false;

        return new Promise((resolve, reject)=> {
            nedb.datastore.records.insert(data, (err, result)=> {
                if(err){
                    throw new Error(`Failed to insert a new history: ${err}`);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    listHistoryVisualTests(historyId) {
        if(!historyId){
            throw new Error("History id is required to list history visual tests");
        }
        return new Promise((resolve, reject)=> {
            nedb.datastore.records.find({historyId}, (err, result)=> {
                if(err){
                    throw new Error(`Failed to list history: ${err}`);
                    reject(err);
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
                    throw new Error(`Failed to insert a new history: ${err}`);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

    },

    /**
     * Get reference by search object
     * @param {Object} candidate
     * @param {string} candidate.referenceId
     * @param {string} candidate.visualScreenshot
     */
    findOneRecord(candidate) {

        const {error, value: data} = joi.validate(candidate, schemaSearchCandidate);
        if (error) {
            throw new Error(`Invalid option for finding the record: ${error.message}`)
        }

        let id = candidate._id;
        return new Promise((resolve, reject)=> {
            nedb.datastore.records.findOne({_id: id}, (err, result)=> {
                if(err){
                    throw new Error(`Failed to find the matched reference: ${err} for ${candidate}`);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    archiveReference(candidate) {

        const {error, value: data} = joi.validate(candidate, schemaArchiveReference);
        if (error) {
            throw new Error(`Invalid archive reference: ${error.message}`)
        }

        return new Promise((resolve, reject)=> {
            nedb.datastore.records.update({_id: candidate._id}, { $set: { isArchived: true } }, (err, result)=> {
                if(err){
                    throw new Error(`Failed to find the matched reference: ${err} for ${candidate}`);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    approveVisualTest(candidate) {
        const {error, value: data} = joi.validate(candidate, schemaApprovingVisualTest);
        if (error) {
            throw new Error(`Invalid new visual reference data: ${error.message}`)
        }

        data.approvedAt = helpers.dates.getDateTime();
        data.pass = true;

        return new Promise((resolve, reject)=> {

            nedb.datastore.records.update({_id: candidate._id}, { $set: { isArchived: true } }, (err, result)=> {
                if(err){
                    throw new Error(`Failed to find the matched reference: ${err} for ${candidate}`);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

};

module.exports = visualModel;