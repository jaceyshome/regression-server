const joi = require('joi');
const helpers = require('./../../../helpers');
const spec = require('./../../spec/');
const nedb = require('./../../../models/nedb');

const schemaNewVisualTest = joi.object().keys({
    historyId: joi.string().required(),
    referenceId: joi.string().required(),
    visualScreenshot: joi.string().required()
}).without('createdAt', '_id');

const schemaReference = joi.object().keys({
    historyId: joi.string().required(),
    visualScreenshot: joi.string().required()
}).without('createdAt', '_id');

//TODO approveVisualTest add user name
const schemaApprovingVisualTest = joi.object().keys({
    _id: joi.string().required(),
    historyId: joi.string().required()
});


let visualModel = {

    saveNewVisualTest(candidate) {

        const {error, value: data} = joi.validate(candidate, schemaNewVisualTest);
        if (error) {
            throw new Error(`Invalid new visual test data: ${error.message}`)
        }

        data.createdAt = helpers.dates.getDateTime();
        data.resourceType = spec.definitions.Record.properties.resourceType.enum[0];

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

    archiveReference(candidate) {

    },

    approveVisualTest(candidate) {
        const {error, value: data} = joi.validate(candidate, schemaApprovingVisualTest);
        if (error) {
            throw new Error(`Invalid new visual reference data: ${error.message}`)
        }

        data.approvedAt = helpers.dates.getDateTime();
        data.pass = true;

        return new Promise((resolve, reject)=> {
            //Find the visual test
            //validate approved or not
            //If haven't approved, update the record, else return
        });
    }

};

module.exports = visualModel;