const _ = require('lodash');
const historyModel = require('./model');
const visualModel = require('./../visual/model');

let historyService = {

    async createHistory(candidate) {
        let history =  await historyModel.saveNewHistory(candidate);
        history.visualTests = [];
        history.visualReferences = await visualModel.listVisualReferences();
        return history;
    },

    async getLatestHistory(candidate) {
        let history = await historyModel.getTheLatestHistory();
        history.visualTests = await visualModel.listHistoryVisualTests(history._id);
        history.visualReferences = await visualModel.listVisualReferences();
        return history;
    }

};

module.exports = historyService;