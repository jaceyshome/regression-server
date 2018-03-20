const service = require('./service');

let functionalController = {

    addFunctionalTestResult(ctx) {
        return service.addFunctionalTestResult(ctx.request.body);
    },

};

module.exports = functionalController;