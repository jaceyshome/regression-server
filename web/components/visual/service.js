const visualModel = require('./model');
const _ = require('lodash');

let visualService = {

    async createVisualReference(candidate) {
        //If already have one, return the existed
        let reference = await visualModel.findOneReference({
            historyId: candidate.historyId,
            visualScreenshot: candidate.visualScreenshot});

        //else create a new one
        if(_.isEmpty(reference)) {
            reference = await visualModel.saveNewVisualReference(candidate);
        }
        return reference;
    },

    async createVisualTest(candidate) {
        let reference = await visualModel.findOneRecord({_id: candidate.visualReferenceId});
        if(reference.visualScreenshot !== candidate.visualScreenshot){
            throw new Error("Failed to create visual test as the reference " +
                            "visual test screenshot doesn't match the candidate visual test screenshot");
        }
        return await visualModel.saveNewVisualTest(candidate);
    },

    async archiveReference(candidate) {
        let reference = await visualModel.findOneRecord(candidate);
        if(reference.isArchived) {
            return reference;
        } else {
            return visualModel.archiveReference(candidate);
        }
    },

    async approveVisualTest(candidate) {
        let visualTest = await visualModel.findOneRecord(candidate);
        if(visualTest.approvedAt && visualTest.pass) {
            return visualTest;
        } else {
            return visualModel.approveVisualTest(candidate);
        }
    }
};

module.exports = visualService;