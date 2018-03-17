'use strict';

const supertest = require('supertest');
const web = require('../../../index');

describe.only('History post /history', () => {
    let request;
    beforeEach(() => {
        request = supertest(web.listen());
    });

    it('<200> should create a history', async() => {
        const res = await request
            .post('/history')
            .send({
                instance: "linux-chrome",
                server: "train"
            })
            .expect('Content-Type', /json/)
            .expect(200);

        const resData = res.body.data;
        expect(resData).toHaveProperty('_id');
        expect(resData).toHaveProperty('instance', 'linux-chrome');
        expect(resData).toHaveProperty('server', "train");
        expect(resData).toHaveProperty('createdAt');
    });

});
