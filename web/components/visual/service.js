const visualModel = require('./model');
const _ = require('lodash');
const spec = require('./../../spec');
const helpers = require('./../../../helpers');

let visualService = {

    async createVisualReference(candidate) {
        //If already have activated one, return the existed
        let reference = await visualModel.findOneReference({
            historyId: candidate.historyId,
            visualScreenshot: candidate.visualScreenshot,
            resourceType: spec.definitions.Record.properties.resourceType.enum[1],
            isArchived: false
        });

        //else create a new one
        if(_.isEmpty(reference)) {
            reference = await visualModel.saveNewVisualReference(candidate);
        }
        return reference;
    },

    async createVisualTest(candidate) {
        let reference = await visualModel.findOneRecord({_id: candidate.visualReferenceId});
        if(_.isEmpty(reference) || reference.visualScreenshot !== candidate.visualScreenshot){
            return helpers.logger.error("Failed to create visual test as the reference " +
                "visual test screenshot doesn't match the candidate visual test screenshot");
        }
        return await visualModel.saveNewVisualTest(candidate);
    },

    async archiveReference(candidate) {
        let reference = await visualModel.findOneRecord(candidate);
        if(reference.isArchived) {
            return reference;
        }
        let result = await visualModel.archiveReference(candidate);
        if(result == 1) {
            return await visualModel.findOneRecord(candidate);
        } else {
            return helpers.logger.error(`Failed to archive the visual reference: ${JSON.stringify(candidate)}`);
        }
    },

    async approveVisualTest(candidate) {
        let visualTest = await visualModel.findOneRecord(candidate);
        //validate resourceType
        if(_.isEmpty(visualTest) || visualTest.resourceType !== spec.definitions.Record.properties.resourceType.enum[0]){
            return helpers.logger.error("Invalid visual test to approve");
        }
        if(visualTest.approvedAt && visualTest.pass) {
            return visualTest;
        }
        let result = await visualModel.approveVisualTest(Object.assign({}, candidate, {resourceType: visualTest.resourceType}));
        if(result == 1) {
            return await visualModel.findOneRecord(candidate);
        } else {
            return helpers.logger.error(`Failed to approve the visual test: ${JSON.stringify(candidate)}`);
        }
    }
};

module.exports = visualService;