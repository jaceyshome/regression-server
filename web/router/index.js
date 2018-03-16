'use strict';

const Router = require('koa-router');
const router = new Router();

router.get('/', require('./api/home/get'));
router.get('/spec', require('./api/spec/get'));

module.exports = router;

