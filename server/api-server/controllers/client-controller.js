'use strict';

var mongoose = require('mongoose'),
    logger = require('../../common/setup/logger'),
    config = require('../../common/setup/config'),
    db = mongoose.createConnection(config.db),
    ApiClient = db.model('ApiClient');

module.exports = {

    signIn: function (req, res) {

    },

    signUp: function (req, res) {

    }
};

function validateCredentials(clientId, apiKey, cb) {
    if (clientId && apiKey) {
        if (!(/^[0-9a-fA-F]{24}$/.test(clientId))) {
            cb(null, false);
        } else {
            ApiClient.findOne({_id: clientId}, function (err, client) {
                if (err) {
                    logger.logError('clientController - validateCredentials - error fetching api client: ' + clientId);
                    logger.logError(err);
                    cb(err);
                } else {
                    cb(null, (client && client.apiKey === apiKey && client.apiType === 'CLIENT'));
                }
            });
        }
    } else {
        cb(null, false);
    }
}
