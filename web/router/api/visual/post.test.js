'use strict';

const Koa = require('koa');
const supertest = require('supertest');
const web = require('./../../../index');
const support = require('./../../../test/support');

describe('Visual post', () => {
    let request;
    let app;
    beforeEach(() => {
        app = web.setup(new Koa());
        request = supertest(app.listen());
    });

    test('<200> should create a record of the visual regression test', async() => {
        const res = await request
            .post('/history')
            .send(support.history.createNewHistoryObject())
            .expect('Content-Type', /json/)
            .expect(200);

        const resData = res.body.data;
        expect(resData).toHaveProperty('_id');


    });

});
