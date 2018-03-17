const model = require('./history-model');
const service = require('./history-service');

let historyController = {

    createHistory(ctx) {
        return model.saveNewHistory(ctx);
    },

    getLatestHistory() {

    }

};

module.exports = historyController;