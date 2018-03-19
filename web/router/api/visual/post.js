'use strict';
const controller = require('./../../../components/visual/controller');

async function post(ctx, next) {
    let data = await controller.createVisualRecord(ctx);
    ctx.res.success(data, "Success");
    await next();
}

module.exports = post;