'use strict';
const controller = require('./../../../components/history/controller');

async function post(ctx, next) {
    let data = await controller.createHistory(ctx);
    if(data.err){
        ctx.res.badRequest({message: data.err.message});
    } else {
        ctx.res.success(data, "Success");
    }
    await next();
}

module.exports = post;