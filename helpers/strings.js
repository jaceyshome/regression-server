module.exports = {
    /**
     * Generate a random string, default is the maximum 12 characters. The toString method of a number type
     * in javascript takes an optional parameter to convert the number into a given base. Similar to hex
     * (base 16), base 36 uses letters to represent digits beyond 9.
     * @see http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
     * @param {number} length - The length of the random string
     * @returns {string} - The random string , default is 12 length
     */
    random(length) {
        return Math.random().toString(36).substr(2, ( length && length <= 12 ) ? length : 12);
    }
};