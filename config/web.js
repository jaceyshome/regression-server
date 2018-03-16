'use strict';
const bunyan = require('bunyan');
const logger = bunyan.createLogger(require('./components/logger'));

module.exports = {
    logger
};
