#!/usr/bin/env node

'use strict';

// Load APM on production environment
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');

const config = require('./../config');
const apm = require('./apm');

const middleWare = require('./middleware');
const webConfig = require('./../config/web');
const logger = webConfig.logger;
const router = require('./router');


function setup(app){

    // Trust proxy
    app.proxy = true;

    // Set middleware
    app.use(
        bodyParser({
            enableTypes: ['json', 'form'],
            formLimit: '10mb',
            jsonLimit: '2mb'
        })
    );

    // Load nedb
    app.use(middleWare.nedb(webConfig.nedb));

    app.use(middleWare.requestId());
    app.use(middleWare.log({logger}));
    app.use(
        cors({
            origin: '*',
            allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
            exposeHeaders: ['X-Request-Id']
        })
    );
    app.use(middleWare.responseHandler());

    // Bootstrap application router
    app.use(router.routes());
    app.use(router.allowedMethods());

    // Handle uncaught errors
    app.on('error', err => {
        if (apm.active)
            apm.captureError(err);
        logger.error({err, event: 'error'}, 'Unhandled exception occured');
    });

    return app;
}

exports.setup = setup;
// Expose app
exports.app = setup(new Koa());
// Start server
if (!module.parent) {
    exports.app.listen(config.port, config.host, () => {
        logger.info({event: 'execute'}, `API server listening on ${config.host}:${config.port}, in ${config.env}`);
    });
}
