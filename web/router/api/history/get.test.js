'use strict';

const Koa = require('koa');
const supertest = require('supertest');
const web = require('./../../../index');
const support = require('./../../../test/support');

describe('History get', () => {

    let request;
    let app;
    beforeEach(() => {
        app = web.setup(new Koa());
        request = supertest(app.listen());
    });

    test('<200> should get the latest history with list of records', async() => {
        let newHistoryResponse = await request
            .post('/history')
            .send(support.history.createNewHistoryObject())
            .expect('Content-Type', /json/)
            .expect(200);

        newHistoryResponse = await request
            .post('/history')
            .send(support.history.createNewHistoryObject())
            .expect('Content-Type', /json/)
            .expect(200);

        newHistoryResponse = await request
            .post('/history')
            .send(support.history.createNewHistoryObject())
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

    });

});
