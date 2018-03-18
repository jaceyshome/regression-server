const historyModel = require('./model');

let historyService = {

    createHistory(ctx) {
        return historyModel.saveNewHistory(ctx);
    },

};

module.exports = historyService;