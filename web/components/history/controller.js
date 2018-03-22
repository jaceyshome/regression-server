const service = require('./service');

let historyController = {

    createHistory(ctx) {
        return service.createHistory(ctx.request.body);
    },

    get(ctx) {
        if(ctx.request.query.id) {
            return service.findHistory(ctx.request.query);
        } else {
            return  service.listHistories(ctx.request.query);

        }
    }

};

module.exports = historyController;