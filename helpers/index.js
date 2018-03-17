const strings = require('./strings');
const dates = require('./dates');


/**
 * A collection of the helpers classes: Strings, Booleans, Colors and Numbers
 * @example
 *  Helpers.Numbers.isNumber(0);
 *  // -> true
 *  Helpers.Strings.random(4);
 *  // -> af2d
 * @type {{Booleans: Booleans, Numbers: Numbers, Colors: Colors, Strings: Strings}}
 */
let helpers = {
    dates,
    strings
};

module.exports = helpers;
