const service = require('./service');

let reportController = {

    saveReport(ctx) {
        return service.saveReport(ctx.request.body);
    },

};

module.exports = reportController;
