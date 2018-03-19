const FactoryGirl = require('factory_girl');
const ipsum = require('lorem-ipsum');
const spec = require('./../../spec');
const helpers = require('./../../../helpers');

module.exports = {

    getNewHistoryInstance() {
        return JSON.parse(JSON.stringify(spec.externalDocs["x-mocks"].newHistory));
    }


};