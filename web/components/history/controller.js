const model = require('./model');
const service = require('./service');

let historyController = {

    createHistory(ctx) {
        return model.saveNewHistory(ctx);
    },

    getLatestHistory() {

    }

};

module.exports = historyController;