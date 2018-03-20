'use strict';

const Koa = require('koa');
const supertest = require('supertest');
const web = require('./../../../index');
const support = require('./../../../test/support');

describe('History get', () => {

    let request;
    let app;

    beforeEach(async () => {
        app = web.setup(new Koa());
        request = supertest(app.listen());
        await request
            .post('/history')
            .send(support.history.getNewHistoryInstance())
            .expect('Content-Type', /json/)
            .expect(200);
    });

    it('should get the latest history', async() => {
        let newHistoryResponse = await request
            .post('/history')
            .send(support.history.getNewHistoryInstance())
            .expect('Content-Type', /json/)
            .expect(200);

        newHistoryResponse = await request
            .post('/history')
            .send(support.history.getNewHistoryInstance())
            .expect('Content-Type', /json/)
            .expect(200);

        let latestHistoryResponse = await request
            .get('/history')
            .expect('Content-Type', /json/)
            .expect(200);

        const newHistoryData = newHistoryResponse.body.data;
        const latestHistoryData = latestHistoryResponse.body.data;

        expect(latestHistoryData).toHaveProperty('visualTests');
        expect(latestHistoryData).toHaveProperty('visualReferences');
        expect(latestHistoryData._id).toEqual(newHistoryData._id);
        expect(latestHistoryData.weight).toEqual(30);

    });

    it('should get the latest history with a list of visual references', async() => {
        let res = await request
            .get('/history')
            .expect('Content-Type', /json/)
            .expect(200);

        let history = res.body.data;
        expect(history).toHaveProperty('visualTests');
        expect(history).toHaveProperty('visualReferences');
        expect(history.weight).toEqual(10);

        let image1 = 'linux-chrome/train/corporate/image1.png';
        let image2 = 'linux-chrome/train/corporate/image2.png';

        //create the reference for image1
        res = await request
            .post('/visual')
            .send({
                historyId: history._id,
                visualScreenshot: `visual-screenshot/${image1}`
            })
            .expect('Content-Type', /json/)
            .expect(200);

        //create the reference for image2
        res = await request
            .post('/visual')
            .send({
                historyId: history._id,
                visualScreenshot: `visual-screenshot/${image2}`
            })
            .expect('Content-Type', /json/)
            .expect(200);

        //should get the reference for image2
        res = await request
            .post('/visual')
            .send({
                historyId: history._id,
                visualScreenshot: `visual-screenshot/${image2}`
            })
            .expect('Content-Type', /json/)
            .expect(200);

        //list history
        res = await request
            .get('/history')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body.data).toHaveProperty('visualReferences');
        expect(res.body.data.visualReferences.length).toEqual(2);

        //create the pass visual test for image1
        history = res.body.data;
        let reference = history.visualReferences.find((visualReference)=> {
            return visualReference.visualScreenshot.includes(image1);
        });
        res = await request
            .post('/visual')
            .send({
                historyId: history._id,
                visualReferenceId: `${reference._id}`,
                visualScreenshot: `visual-screenshot/${image1}`
            }).expect('Content-Type', /json/)
            .expect(200);

        //create the failed visual test for image2
        reference = history.visualReferences.find((visualReference)=> {
            return visualReference.visualScreenshot.includes(image2);
        });
        let existedReference = reference;
        res = await request
            .post('/visual')
            .send({
                historyId: history._id,
                visualReferenceId: `${reference._id}`,
                visualScreenshot: `visual-screenshot/${image2}`,
                visualDiffer: `visual-differ/${image2}`
            }).expect('Content-Type', /json/)
            .expect(200);

        //list the history to check the visual tests
        res = await request
            .get('/history')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body.data).toHaveProperty('visualTests');
        expect(res.body.data.visualTests.length).toEqual(2);

        //approve the failed visual test
        history = res.body.data;
        let failedTest = history.visualTests.find((visualTest)=> {
            return visualTest.pass == false;
        });

        res = await request
            .put('/visual')
            .send({
                historyId: failedTest.historyId,
                visualReferenceId: failedTest.visualReferenceId,
                visualScreenshot: failedTest.visualScreenshot,
                visualDiffer: failedTest.visualDiffer,
                _id: failedTest._id
            }).expect('Content-Type', /json/)
            .expect(200);

        //list the history
        res = await request
            .get('/history')
            .expect('Content-Type', /json/)
            .expect(200);

        history = res.body.data;
        expect(history.visualTests.length).toEqual(2);
        let approvedTest = history.visualTests.find((visualTest)=> {
            return visualTest.approvedAt !== undefined && visualTest.pass === true;
        });
        expect(approvedTest._id).toEqual(failedTest._id);

        expect(history.visualReferences.length).toEqual(2);
        let newReference = history.visualReferences.find((visualReference)=> {
            return visualReference.visualScreenshot.includes(image2);
        });

        expect(newReference._id).not.toEqual(existedReference._id);
        expect(newReference.visualScreenshot).toEqual(existedReference.visualScreenshot);

    });

});
