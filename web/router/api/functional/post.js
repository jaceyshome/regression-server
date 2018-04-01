'use strict';
const controller = require('../../../components/functional/controller');

async function post(ctx, next) {
    let data = await controller.addFunctionalTestResult(ctx);
    if(data.err) {
        ctx.res.badRequest({message: data.err.message});
    } else {
        ctx.res.success(data, "Success");
    }
    await next();
}

module.exports = post;