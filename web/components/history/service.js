const _ = require('lodash');
const historyModel = require('./model');
const visualModel = require('../visual/model');
const reportModel = require('../report/model');

let historyService = {

    async createHistory(candidate) {
        let count = await historyModel.countHistories();
        let history =  await historyModel.saveNewHistory(Object.assign({}, candidate, {weight: (count + 1) * 10}));
        history.report = {};
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

        let visualFailedTotal = await visualModel.getHistoryVisualFailedTotalObject(history._id);
        Object.assign(history, visualFailedTotal);
        history.report = await reportModel.getReport(history._id);
        history.visualTests = await visualModel.listHistoryVisualTests(history._id);
        history.visualReferences = await visualModel.listVisualReferences({
            instance: history.instance,
            server: history.server
        });
        return history;
    },

    async listHistories(candidate) {
        let histories = await historyModel.listHistories(candidate);
        let requests = histories.map((history)=> this.getHistoryVisualFailedTotalObject(history));
        return await Promise.all(requests);
    },

    async getHistoryVisualFailedTotalObject(history) {
        let result = await visualModel.getHistoryVisualFailedTotalObject(history._id);
        Object.assign(history, result);
        return history;
    }
};

module.exports = historyService;
