const _ = require('lodash');
const FactoryGirl = require('factory_girl');
const ipsum = require('lorem-ipsum');
const spec = require('./../../web/spec');
const Helpers = require('../../helpers');

function createData() {
    let data = JSON.parse(JSON.stringify(spec.externalDocs.history));
    data.id = Helpers.Strings.random(16);
    data.createdAt = new Date();
    return data;
}

module.exports = {

    createHistory() {

        if (!FactoryGirl.defined('history')) {
            FactoryGirl.define('history', function () {
                let data = createData();
                for (let key of data) {
                    this[key] = {value: data[key], type: 'textInput'}
                }
            });
        }
        return _.omit(FactoryGirl.create('history', createData()), '__name__');

    },

    createHistoryRecordList() {

    }

};