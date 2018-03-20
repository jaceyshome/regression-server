const _ = require('lodash');
const FactoryGirl = require('factory_girl');
const ipsum = require('lorem-ipsum');
const spec = require('./../../spec');

module.exports = {

    getNewFunctionalTestInstance({historyId, functionalResult}) {
        let data = JSON.parse(JSON.stringify(spec.externalDocs["x-mocks"].newFunctionalTest));
        data.historyId = historyId;
        data.functionalResult = functionalResult || data.functionalResult;
        return data;
    },
};