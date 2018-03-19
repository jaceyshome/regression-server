const visualModel = require('./model');
const _ = require('lodash');

let visualService = {

    async createVisualReference(candidate) {
        //If already have one, return the existed
        let reference = await visualModel.findReference({visualScreenshot: candidate.visualScreenshot});

        //else create a new one
        if(_.isEmpty(reference)) {
            reference = await visualModel.saveNewVisualReference(candidate);
        }
        return reference;
    },

    async createVisualTest(candidate) {
        let result = await visualModel.saveNewVisualTest(candidate);

        //Check the reference whether is has been archived or not
        //If it has been archived, still return it
        let reference = await visualModel.findOneRecord(candidate);
        result.referenceIsArchived = reference.isArchived || false;
        return result;
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