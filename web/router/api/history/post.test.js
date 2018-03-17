'use strict';

const supertest = require('supertest');
const web = require('../../../index');

describe.only('History post', () => {
    let request;
    beforeEach(() => {
        request = supertest(web.listen());
    });

    describe('GET /history', () => {
        it('<200> should always return the latest history', async() => {
            const res = await request
                .get('/')
                .expect('Content-Type', /json/)
                .expect(200);

            const spec = res.body;
            expect(spec).toHaveProperty('info');
            expect(spec).toHaveProperty('swagger', '2.0');
            expect(spec).toHaveProperty('consumes');
            expect(spec).toHaveProperty('produces');
            expect(spec).toHaveProperty('paths');
        });
    });

});
