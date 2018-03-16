/* eslint-disable global-require */

'use strict';

const logger = require('winston');
const type = process.env.PROCESS_TYPE || 'web';

logger.info(`Starting '${type}' process`, { pid: process.pid });

if (type === 'web') {
  require('./web')
} else {
  throw new Error(`
    ${type} is an unsupported process type. 
    Use one of: 'web'!
  `)
}
