'use strict';

const Router = require('koa-router');
const router = new Router();

router.get('/', require('./api/spec/get'));
router.post('/history', require('./api/history/post'));

module.exports = router;
