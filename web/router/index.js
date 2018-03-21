'use strict';

const Router = require('koa-router');
const router = new Router();

router.get('/', require('./api/spec/get'));
router.get('/history', require('./api/history/get'));
router.post('/history', require('./api/history/post'));
router.post('/visual', require('./api/visual-test/post'));
router.put('/visual', require('./api/visual-test/put'));
router.post('/functional', require('./api/functional-test/post'));

module.exports = router;
