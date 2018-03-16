'use strict';
const bunyan = require('bunyan');

const common = require('./components/common');
const logger = bunyan.createLogger(require('./components/logger'));
const nedb = require('./components/nedb');

module.exports = {
    common,
    logger,
    nedb
};
