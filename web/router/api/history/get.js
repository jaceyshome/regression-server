'use strict';
const controller = require('./../../../components/history/controller');

async function get(ctx, next) {
    let data = await controller.get(ctx);
    if(data && data.err){
        ctx.res.badRequest({message: data.err.message});
    } else {
        ctx.res.success(data, "Success");
    }

    await next();
}

module.exports = get;
