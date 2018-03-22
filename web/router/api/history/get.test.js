'use strict';

const Koa = require('koa');
const supertest = require('supertest');
const web = require('./../../../index');
const support = require('./../../../test/support');



describe('History get', () => {

    let request;
    let app;

    async function createHistories(counter=1) {
        let response;

        for(let i=0; i<counter; i++){
            response = await request.post('/history')
                .send(support.history.getNewHistoryInstance())
                .expect('Content-Type', /json/)
                .expect(200);
        }

        return await response;
    }

    beforeEach(async () => {
        app = web.setup(new Koa());
        request = supertest(app.listen());
    });

    it('should list histories', async() => {
        let latestHistoryResponse = await createHistories(3);

        let listHistoriesResponse = await request
            .get('/history')
            .expect('Content-Type', /json/)
            .expect(200);

        const newHistoryData = latestHistoryResponse.body.data;
        const histories = listHistoriesResponse.body.data;

        expect(histories.length).toEqual(3);
        expect(histories[0].weight).toEqual(30);
        expect(histories[0]._id).toEqual(newHistoryData._id);
    });

    it('should be able to list histories for pagination with default 10 limit', async() => {
        let latestHistoryResponse = await createHistories(25);

        let listHistoriesResponse = await request
            .get('/history?skip=10')
            .expect('Content-Type', /json/)
            .expect(200);

        const newHistoryData = latestHistoryResponse.body.data;
        const histories = listHistoriesResponse.body.data;

        expect(histories.length).toEqual(10);
        expect(histories[0].weight).toEqual(250-100);
        expect(histories[histories.length - 1].weight).toEqual(250-200+10);
    });

    it('should get a history with a list of visual references, visual tests and functional results', async() => {
        let latestHistoryResponse = await createHistories(1);

        let res = await request
            .get(`/history?id=${latestHistoryResponse.body.data._id}`)
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

        //get history
        res = await request
            .get(`/history?id=${history._id}`)
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

        res = await request
            .get(`/history?id=${history._id}`)
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

        res = await request
            .get(`/history?id=${history._id}`)
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
