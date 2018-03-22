'use strict';

const Koa = require('koa');
const supertest = require('supertest');
const web = require('./../../../index');
const support = require('./../../../test/support');

describe('Functional post', () => {
    let request;
    let app;
    let history;

    beforeEach(async () => {
        app = web.setup(new Koa());
        request = supertest(app.listen());
        let res = await request
            .post('/history')
            .send(support.history.getNewHistoryInstance())
            .expect('Content-Type', /json/)
            .expect(200);
        history = res.body.data;

        res = await request
            .get(`/history?id=${history._id}`)
            .expect('Content-Type', /json/)
            .expect(200);

        history = res.body.data;

        expect(history).toHaveProperty('_id');
        expect(history).toHaveProperty('functionalTest');
        expect(history).toHaveProperty('visualTests', []);
        expect(history).toHaveProperty('visualReferences', []);
    });

    it('should add the functional test result to the history', async() => {
        let res = await request
            .post('/functional')
            .send(support.functional.getNewFunctionalTestInstance({historyId: history._id}))
            .expect('Content-Type', /json/)
            .expect(200);


        let functionalTest = res.body.data;
        expect(functionalTest).toHaveProperty('_id');
        expect(functionalTest).toHaveProperty('functionalResult');

        res = await request
            .get(`/history?id=${history._id}`)
            .expect('Content-Type', /json/)
            .expect(200);

        let latestHistory = res.body.data;
        expect(latestHistory).toHaveProperty('functionalTest');
        expect(latestHistory.functionalTest).toEqual(functionalTest);

    });

});
