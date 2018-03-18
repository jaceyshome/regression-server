'use strict';

const Koa = require('koa');
const supertest = require('supertest');
const web = require('./../../../index');
const support = require('./../../../test/support');

describe('spec get', () => {
    let request;
    let app;
    beforeEach(() => {
        app = web.setup(new Koa());
        request = supertest(app.listen());
    });

    describe('Spec get', () => {
        test('<200> get spec info', async() => {
            const res = await request
                .get('/')
                .expect('Content-Type', /json/)
                .expect(200);

            const spec = res.body;
            expect(spec).toHaveProperty('info',);
            expect(spec).toHaveProperty('tags',);
            expect(spec).toHaveProperty('paths',);
            expect(spec).toHaveProperty('definitions');
            expect(spec).toHaveProperty('externalDocs');
        });
    });

});
