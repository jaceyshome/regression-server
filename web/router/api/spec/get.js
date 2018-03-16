'use strict';

const spec = require('../../../spec');

function get(ctx) {
    return ctx.body = spec;
}

module.exports = get;
