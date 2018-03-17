'use strict';
const path = require('path');
const common = require('./common');

let options = {
    // timestampData: true, //FIXME: timestampData true not working
    inMemoryOnly: false
};
if (common.env === "test") {
    options.inMemoryOnly = true;
} else if (common.env === "production") {
    options.filename = path.join(process.cwd(), '/datastore/production-');
} else if (common.env === "development") {
    options.filename = path.join(process.cwd(), '/datastore/development-');
} else {
    throw new Error(`Nedb Config validation error: env is required`)
}

module.exports = options;
