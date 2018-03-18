'use strict';
const controller = require('./../../../components/history/controller');

async function post(ctx, next) {
    let data = await controller.createHistory(ctx);
    ctx.res.success(data, "Success");
    await next();
}

module.exports = post;