'use strict';

const supertest = require('supertest');
const app = require('../../../index');

describe('History', () => {
  const request = supertest(app.listen());

  describe('GET /', () => {
    it('<200> should always return with the API server information', async () => {
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