const logger = require('./../config/web').logger;

module.exports = {

    error(message) {
        logger.error({message, event: 'error'}, 'Unhandled exception occured');
        return {
            err: {
                message: message
            }
        }
    }

};