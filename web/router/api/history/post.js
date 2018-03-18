'use strict';
const bunyan = require('bunyan');

const controller = require('./../../../components/history/controller');
const log = bunyan.createLogger({name: "myapp"});

async function post(ctx, next) {
    let data = await controller.createHistory(ctx);
    ctx.res.success(data, "Success");
    await next();
}

module.exports = post;