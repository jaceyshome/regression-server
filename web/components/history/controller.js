const service = require('./service');

let historyController = {

    createHistory(ctx) {
        return service.createHistory(ctx.request.body);
    },

    getLatestHistory() {

    }

};

module.exports = historyController;