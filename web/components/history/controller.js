const service = require('./service');

let historyController = {

    createHistory(ctx) {
        return service.createHistory(ctx.request.body);
    },

    getLatestHistory(ctx) {
        return service.getLatestHistory(ctx.request.body);
    }

};

module.exports = historyController;