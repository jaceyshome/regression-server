const moment = require('moment');

module.exports = {

    getDateTime(date= moment()) {
        return date.format();
    }

};