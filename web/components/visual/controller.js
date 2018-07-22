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
            return approvedVisualTest;
        }
        let archivedReference = await service.archiveReference({_id: ctx.request.body.visualReferenceId});
        if(archivedReference.err ) {
            return archivedReference;
        }
        let newReference = await service.createVisualReference({
            historyId: ctx.request.body.historyId,
            visualScreenshot: ctx.request.body.visualScreenshot
        });
        if(newReference.err) {
            return newReference;
        }

        return await {
            approvedVisualTest ,
            archivedReference ,
            newReference
        };
    }

};

module.exports = visualController;