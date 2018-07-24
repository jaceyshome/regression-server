const _ = require('lodash');
const historyModel = require('./model');
const visualModel = require('../visual/model');
const functionModel = require('../functional/model');

let historyService = {

    async createHistory(candidate) {
        let count = await historyModel.countHistories();
        let history =  await historyModel.saveNewHistory(Object.assign({}, candidate, {weight: (count + 1) * 10}));
        history.functionalTest = {};
        history.visualTests = [];
        history.visualReferences = await visualModel.listVisualReferences({
            instance: history.instance,
            server: history.server
        });
        return history;
    },

    async findHistory(candidate) {
        let option = JSON.parse(JSON.stringify(candidate));
        if(candidate.id) {
            option._id = candidate.id;
            delete option.id;
        }
        let history = await historyModel.findHistory(option);
        if(!history) {
            return history;
        }
        history.functionalTest = await functionModel.getFunctionalTestResult(history._id);
        history.visualTests = await visualModel.listHistoryVisualTests(history._id);
        history.visualReferences = await visualModel.listVisualReferences({
            instance: history.instance,
            server: history.server
        });
        return history;
    },

    async listHistories(candidate) {
        let histories = await historyModel.listHistories(candidate);
        let requests = histories.map((history)=> historyService.getHistoryAllPassObject(history));
        let results = await Promise.all(requests);
        return results;
    },

    async getHistoryAllPassObject(history) {
        let result = await visualModel.getHistoryAllPassObject(history._id);
        return Object.assign(history, result);
    }
};

module.exports = historyService;