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

    test('<200> should get the latest history with its list of records', async() => {
        let res = await request
            .post('/history')
            .send(support.history.createNewHistoryObject())
            .expect('Content-Type', /json/)
            .expect(200);

        res = await request
            .post('/history')
            .send(support.history.createNewHistoryObject())
            .expect('Content-Type', /json/)
            .expect(200);

        res = await request
            .post('/history')
            .send(support.history.createNewHistoryObject())
            .expect('Content-Type', /json/)
            .expect(200);


    });

});
