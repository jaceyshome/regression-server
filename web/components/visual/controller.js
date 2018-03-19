const service = require('./service');

let visualController = {

    createVisualRecord(ctx) {
        //it is a visual reference if it doesn't have the referenceId
        if(!ctx.request.body.visualReferenceId) {
            return service.createVisualReference(ctx.request.body);
        } else {
            return service.createVisualTest(ctx.request.body);
        }
    },

    approveVisualTest(ctx) {

    }

};

module.exports = visualController;