'use strict';

const Koa = require('koa');
const supertest = require('supertest');
const web = require('./../../../index');
const support = require('./../../../test/support');
const spec = require('./../../../spec');

describe('Visual reference', () => {
    let request;
    let app;
    let history;

    beforeEach(async () => {
        app = web.setup(new Koa());
        request = supertest(app.listen());
        const res = await request
            .post('/history')
            .send(support.history.getNewHistoryInstance())
            .expect('Content-Type', /json/)
            .expect(200);
        history = res.body.data;
        expect(history).toHaveProperty('_id');
        expect(history).toHaveProperty('visualTests', []);
        expect(history).toHaveProperty('visualReferences', []);
    });

    it('should create a visual reference for the first run', async() => {

        let res = await request
            .post('/visual')
            .send(support.visual.getNewVisualReference({historyId: history._id}))
            .expect('Content-Type', /json/)
            .expect(200);

        let visualReference = res.body.data;
        expect(visualReference).toHaveProperty('_id');
        expect(visualReference).toHaveProperty('visualScreenshot');
        expect(visualReference).toHaveProperty('instance');
        expect(visualReference).toHaveProperty('server');
        expect(visualReference).toHaveProperty('historyId', history._id);
        expect(visualReference).toHaveProperty('isArchived', false);

        let latestHistoryResponse = await request
            .get(`/history?id=${history._id}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(latestHistoryResponse.body.data.visualReferences[0]._id).toEqual(visualReference._id);
    });

    describe('Visual test', async () => {
        let visualReference;

        beforeEach(async() => {
            let res = await request
                .post('/visual')
                .send(support.visual.getNewVisualReference({historyId: history._id}))
                .expect('Content-Type', /json/)
                .expect(200);
            visualReference = res.body.data;
        });

        it('should create a pass visual test', async() => {

            //Create reference to make sure it has the matched visualScreenshot
            let passTestReference = await request
                .post('/visual')
                .send(support.visual.getNewVisualReference({
                    historyId: history._id,
                    visualScreenshot: support.visual.getNewVisualPassTestInstance({
                        historyId: history._id,
                        visualReferenceId: visualReference._id
                    }).visualScreenshot
                }))
                .expect('Content-Type', /json/)
                .expect(200);

            visualReference = passTestReference.body.data;

            let res = await request
                .post('/visual')
                .send(support.visual.getNewVisualPassTestInstance({
                    historyId: history._id,
                    visualReferenceId: visualReference._id
                }))
                .expect('Content-Type', /json/)
                .expect(200);

            let visualTestResult = res.body.data;
            expect(visualTestResult).toHaveProperty('_id');
            expect(visualTestResult).toHaveProperty('visualScreenshot', visualReference.visualScreenshot);
            expect(visualTestResult).toHaveProperty('historyId', history._id);
            expect(visualTestResult).toHaveProperty('pass', true);
        });


        it('should create a failed visual test', async() => {

            //Create reference to make sure it has the matched visualScreenshot
            let failedTestReference = await request
                .post('/visual')
                .send(support.visual.getNewVisualReference({
                    historyId: history._id,
                    visualScreenshot: support.visual.getNewVisualFailedTestInstance({
                        historyId: history._id,
                        visualReferenceId: visualReference._id
                    }).visualScreenshot
                }))
                .expect('Content-Type', /json/)
                .expect(200);

            visualReference = failedTestReference.body.data;

            let res = await request
                .post('/visual')
                .send(support.visual.getNewVisualFailedTestInstance({
                    historyId: history._id,
                    visualReferenceId: visualReference._id
                }))
                .expect('Content-Type', /json/)
                .expect(200);

            let visualTestResult = res.body.data;
            expect(visualTestResult).toHaveProperty('_id');
            expect(visualTestResult).toHaveProperty('visualScreenshot', visualReference.visualScreenshot);
            expect(visualTestResult).toHaveProperty('historyId', history._id);
            expect(visualTestResult).toHaveProperty('pass', false);
        });

        it('should not create a visual test is the reference is not existed', async() => {

            //Create reference to make sure it has the matched visualScreenshot
            let passTestReference = await request
                .post('/visual')
                .send(support.visual.getNewVisualReference({
                    historyId: history._id,
                    visualScreenshot: support.visual.getNewVisualPassTestInstance({
                        historyId: history._id,
                        visualReferenceId: visualReference._id
                    }).visualScreenshot
                }))
                .expect('Content-Type', /json/)
                .expect(200);

            visualReference = passTestReference.body.data;

            let res = await request
                .post('/visual')
                .send(support.visual.getNewVisualPassTestInstance({
                    historyId: history._id,
                    visualReferenceId: "ABCD"
                }))
                .expect(400);
        });

        it('should not create a visual test is the screenshot does not matched', async() => {

            //Create reference to make sure it has the matched visualScreenshot
            let passTestReference = await request
                .post('/visual')
                .send(support.visual.getNewVisualReference({
                    historyId: history._id,
                    visualScreenshot: support.visual.getNewVisualPassTestInstance({
                        historyId: history._id,
                        visualReferenceId: visualReference._id
                    }).visualScreenshot
                }))
                .expect('Content-Type', /json/)
                .expect(200);

            visualReference = passTestReference.body.data;

            let res = await request
                .post('/visual')
                .send(support.visual.getNewVisualPassTestInstance({
                    historyId: history._id,
                    visualReferenceId: visualReference._id,
                    visualScreenshot: "visual-screenshot/abc.png"
                }))
                .expect(400);
        });

    });
});
