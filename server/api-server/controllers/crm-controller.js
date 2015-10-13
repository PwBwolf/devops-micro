'use strict';

var mongoose = require('mongoose'),
    logger = require('../../common/setup/logger'),
    config = require('../../common/setup/config'),
    db = mongoose.createConnection(config.db),
    ApiLog = db.model('ApiLog'),
    ApiClient = db.model('ApiClient');

module.exports = {

    verifyCredentials: function (req, res) {
        var apiLog = new ApiLog();
        apiLog.name = 'verify-credentials';
        apiLog.type = 'crm';
        apiLog.requestTime = (new Date()).toUTCString();
        apiLog.clientId = req.query.clientId;
        apiLog.apiKey = req.query.apiKey;
        try {
            validateCredentials(req.query.clientId, req.query.apiKey, function (err, result) {
                if (err) {
                    logger.logError('clientController - verifyCredentials - error validating credentials');
                    logger.logError(err);
                    return res.status(200).send({error: 'server-error'});
                }
                return res.status(200).send({result: result});
            });
        } catch (ex) {
            logger.logError('clientController - verifyCredentials - exception');
            logger.logError(ex);
            return res.status(200).send({error: 'server-error'});
        } finally {
            apiLog.responseTime = (new Date()).toUTCString();
            apiLog.save(function (err) {
                if (err) {
                    logger.logError('clientController - verifyCredentials - error saving api log');
                    logger.logError(err);
                }
            });
        }
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
                    cb(null, (client !== null && client.apiKey === apiKey && client.apiType === 'CRM'));
                }
            });
        }
    } else {
        cb(null, false);
    }
}
