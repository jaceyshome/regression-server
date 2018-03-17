const FactoryGirl = require('factory_girl');
const ipsum = require('lorem-ipsum');
const spec = require('./../../spec');
const helpers = require('./../../../helpers');

module.exports = {

    createNewHistoryObject() {
        let data = JSON.parse(JSON.stringify(spec.externalDocs["x-mocks"].history));
        delete data._id;
        delete data.createdAt;
        return data;
    },

    createHistoryRecordList() {

    }

};