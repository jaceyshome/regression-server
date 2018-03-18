const model = require('./model');
const service = require('./service');

let visualController = {

    createHistory(ctx) {
        return model.saveNewVisual(ctx);
    },

    getLatestHistory() {

    }

};

module.exports = visualController;