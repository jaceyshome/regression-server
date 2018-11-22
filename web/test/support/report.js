const _ = require('lodash');
const FactoryGirl = require('factory_girl');
const ipsum = require('lorem-ipsum');
const spec = require('./../../spec');

module.exports = {

    getNewReport({historyId, report}) {
        let data = JSON.parse(JSON.stringify(spec.externalDocs["x-mocks"].newCucumberReport));
        data.historyId = historyId;
        data.report = report || data.report;
        return data;
    },
};
