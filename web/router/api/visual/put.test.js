'use strict';

const Koa = require('koa');
const supertest = require('supertest');
const web = require('./../../../index');
const support = require('./../../../test/support');
const spec = require('./../../../spec');

describe('Visual test update', () => {
    let request;
    let app;
    let history;
    let visualReference;

    beforeEach(async () => {
        app = web.setup(new Koa());
        request = supertest(app.listen());
        let res = await request
            .post('/history')
            .send(support.history.getNewHistoryInstance())
            .expect('Content-Type', /json/)
            .expect(200);

        history = res.body.data;

        expect(history).toHaveProperty('_id');
        expect(history).toHaveProperty('visualTests', []);
        expect(history).toHaveProperty('visualReferences', []);

        res = await request
            .post('/visual')
            .send(support.visual.getNewVisualReference({historyId: history._id}))
            .expect('Content-Type', /json/)
            .expect(200);

        visualReference = res.body.data;
        expect(visualReference).toHaveProperty('_id');

    });

    it('should approve a failed visual test', async() => {
        let data = spec.externalDocs["x-mocks"].newFailedVisualTest;
        data.historyId = history._id;
        data.visualReferenceId = visualReference._id;

        let res = await request
            .post('/visual')
            .send(data)
            .expect('Content-Type', /json/)
            .expect(200);

        let visualTestResult = res.body.data;
        expect(visualTestResult).toHaveProperty('_id');
        expect(visualTestResult).toHaveProperty('visualScreenshot', visualReference.visualScreenshot);
        expect(visualTestResult).toHaveProperty('visualReferenceId', visualReference._id);
        expect(visualTestResult).toHaveProperty('visualDiffer');
        expect(visualTestResult).toHaveProperty('visualDifferPath');
        expect(visualTestResult).toHaveProperty('historyId', history._id);
        expect(visualTestResult).toHaveProperty('pass', false);

        res = await request
            .put('/visual')
            .send({
                historyId: visualTestResult.historyId,
                visualReferenceId: visualTestResult.visualReferenceId,
                visualScreenshot: visualTestResult.visualScreenshot,
                visualDiffer: visualTestResult.visualDiffer,
                visualDifferPath: visualTestResult.visualDifferPath,
                _id: visualTestResult._id
            })
            .expect('Content-Type', /json/)
            .expect(200);
        let result = res.body.data;

        expect(result).toHaveProperty('approvedVisualTest');
        expect(result).toHaveProperty('archivedReference');
        expect(result).toHaveProperty('newReference');

        expect(result.approvedVisualTest.approvedAt).toBeDefined();
        expect(result.approvedVisualTest.pass).toBeTruthy();
        expect(result.approvedVisualTest.visualReferenceId).toEqual(result.archivedReference._id);
        expect(result.approvedVisualTest.resourceType).toEqual(spec.definitions.Record.properties.resourceType.enum[0]);

        expect(result.archivedReference.isArchived).toBeTruthy();
        expect(result.archivedReference._id).not.toEqual(result.newReference._id);
        expect(result.archivedReference.historyId).toEqual(history._id);
        expect(result.archivedReference.resourceType).toEqual(spec.definitions.Record.properties.resourceType.enum[1]);

        expect(result.newReference.isArchived).toBeFalsy();
        expect(result.newReference.resourceType).toEqual(spec.definitions.Record.properties.resourceType.enum[1]);

    });

});
