const joi = require('joi');
const helpers = require('./../../../helpers');
const spec = require('./../../spec/');

const schemaNewHistory = joi.object().keys({
    instance: joi.string().allow(spec.definitions.History.properties.instance.enum).required(),
    server: joi.string().allow(spec.definitions.History.properties.server.enum).required()
}).without('createdAt', '_id');


let historyModel = {

    saveNewHistory(ctx) {

        const {error, value: data} = joi.validate(ctx.request.body, schemaNewHistory);
        if (error) {
            throw new Error(`Invalid new history data: ${error.message}`)
        }

        data.createdAt = helpers.dates.getDateTime();

        return new Promise((resolve, reject)=> {
            ctx.datastore.histories.insert(data, (err, result)=> {
                if(err){
                    throw new Error(`Failed to insert a new history: ${err}`);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    set(data) {

    }
};

module.exports = historyModel;