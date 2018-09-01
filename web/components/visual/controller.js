const service = require('./service');

let visualController = {

    async createVisualRecord(ctx) {
        //it is a visual reference if it doesn't have the referenceId
        if(!ctx.request.body.visualReferenceId) {
            return await service.createVisualReference(ctx.request.body);
        } else {
            return await service.createVisualTestResult(ctx.request.body);
        }
    },

    async approveVisualTest(ctx) {
        let approvedVisualTest =  await service.approveVisualTest(ctx.request.body);
        if(approvedVisualTest.err) {
            return  {err: approvedVisualTest.err};
        }
        let archivedReference = await service.archiveReference({_id: ctx.request.body.visualReferenceId});
        if(archivedReference.err ) {
            return  {err: archivedReference.err};
        }
        let newReference = await service.createVisualReference(ctx.request.body);
        if(newReference.err) {
            return {err: newReference.err};
        }

        return {
            approvedVisualTest ,
            archivedReference ,
            newReference
        };
    }

};

module.exports = visualController;