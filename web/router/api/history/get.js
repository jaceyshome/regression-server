'use strict';
const controller = require('./../../../components/history/controller');

async function get(ctx, next) {
    let data = await controller.getLatestHistory(ctx);
    ctx.res.success(data, "Success");
    await next();
}

module.exports = get;
