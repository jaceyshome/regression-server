'use strict';

const pkginfo = require('../../../../package.json');
const spec = require('../../../spec');


/**
 * @swagger
 * /:
 *   get:
 *     description: Returns API information
 *     tags:
 *       - Public
 *     responses:
 *       200:
 *         description: Describe general API information
 */
function get(ctx) {
    // BUSINESS LOGIC
    const data = {
        name: pkginfo.name,
        version: pkginfo.version,
        description: pkginfo.description,
        author: pkginfo.author
    };

    ctx.res.ok(data, 'Hello, API!');
}

module.exports = get;
