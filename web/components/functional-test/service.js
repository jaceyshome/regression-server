const _ = require('lodash');
const functionalModel = require('./model');

let functionalService = {

    addFunctionalTestResult(candidate) {
        return functionalModel.addFunctionalTestResult(candidate);
    }


};

module.exports = functionalService;