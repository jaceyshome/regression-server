const _ = require('lodash');
const FactoryGirl = require('factory_girl');
const ipsum = require('lorem-ipsum');
const spec = require('./../../spec');

module.exports = {

    getNewVisualPassTestInstance({visualReferenceId, historyId, visualScreenshot}) {
        let data = JSON.parse(JSON.stringify(spec.externalDocs["x-mocks"].newPassVisualTest));
        data.historyId = historyId;
        data.visualReferenceId = visualReferenceId;
        data.visualScreenshot = visualScreenshot || data.visualScreenshot;
        return data;
    },

    getNewVisualFailedTestInstance({visualReferenceId, historyId, visualScreenshot}) {
        let data = JSON.parse(JSON.stringify(spec.externalDocs["x-mocks"].newFailedVisualTest));
        data.historyId = historyId;
        data.visualReferenceId = visualReferenceId;
        data.visualScreenshot = visualScreenshot || data.visualScreenshot;
        return data;
    },

    getNewVisualReference({historyId, visualScreenshot}) {
        let data = JSON.parse(JSON.stringify(spec.externalDocs["x-mocks"].newVisualReference));
        data.historyId = historyId;
        data.visualScreenshot = visualScreenshot || data.visualScreenshot;
        return data;
    }
};