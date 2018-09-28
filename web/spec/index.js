'use strict';

let spec = require('./swagger.json');
const packageObject = require('./../../package.json');

spec.info.version = packageObject.version;

module.exports = spec;
