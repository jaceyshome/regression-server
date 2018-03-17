'use strict';
const bunyan = require('bunyan');

const controller = require('./../../../components/history/history-controller');
const log = bunyan.createLogger({name: "myapp"});

function post(ctx) {
    log.info("hi!!!!!");
}

module.exports = post;
