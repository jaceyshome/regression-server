'use strict';

const Router = require('koa-router');
const router = new Router();

router.get('/', require('./api/spec/get'));

module.exports = router;
