'use strict';

const Koa = require('koa');
const supertest = require('supertest');
const web = require('./../../../index');
const support = require('./../../../test/support');

describe('Report post', () => {
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
        expect(history).toHaveProperty('report');
        expect(history).toHaveProperty('visualTests', []);
        expect(history).toHaveProperty('visualReferences', []);
    });

    it('should add cucumber report file link ', async() => {
        let res = await request
            .post('/report')
            .send(support.report.getNewReport({historyId: history._id}))
            .expect('Content-Type', /json/)
            .expect(200);


        let report = res.body.data;
        expect(report).toHaveProperty('_id');
        expect(report).toHaveProperty('report');

        res = await request
            .get(`/history?id=${history._id}`)
            .expect('Content-Type', /json/)
            .expect(200);

        let latestHistory = res.body.data;
        expect(latestHistory).toHaveProperty('report');
        expect(latestHistory.report).toEqual(report);

    });

});
