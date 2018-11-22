const _ = require('lodash');
const reportModel = require('./model');

let reportService = {

    saveReport(candidate) {
        return reportModel.saveReport(candidate);
    }

};

module.exports = reportService;
