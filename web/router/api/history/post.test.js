'use strict';

const Koa = require('koa');
const supertest = require('supertest');
const web = require('./../../../index');
const support = require('./../../../test/support');

describe('History post', () => {
    let request;
    let app;
    beforeEach(() => {
        app = web.setup(new Koa());
        request = supertest(app.listen());
    });

    test('<200> should create a history', async() => {
        const res = await request
            .post('/history')
            .send(support.history.createNewHistoryObject())
            .expect('Content-Type', /json/)
            .expect(200);

        const resData = res.body.data;
        expect(resData).toHaveProperty('_id');
        expect(resData).toHaveProperty('instance', 'linux-chrome');
        expect(resData).toHaveProperty('server', "train");
        expect(resData).toHaveProperty('createdAt');
        expect(resData).toHaveProperty('visualTests');
        expect(resData).toHaveProperty('visualReferences');
    });

});
