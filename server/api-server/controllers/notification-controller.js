'use strict';

var mongoose = require('mongoose'),
    logger = require('../../common/setup/logger'),
    config = require('../../common/setup/config'),
    db = mongoose.createConnection(config.db),
    ApiClient = db.model('ApiClient'),
    ApiLog = db.model('ApiLog');

module.exports = {

    verifyCredentials: function (req, res) {
        var apiLog = new ApiLog();
        apiLog.name = 'verify-credentials';
        apiLog.type = 'notification';
        apiLog.requestTime = (new Date()).toUTCString();
        apiLog.clientId = req.query.clientId;
        apiLog.apiKey = req.query.apiKey;
        try {
            validateCredentials(req.query.clientId, req.query.apiKey, function (err, result) {
                if (err) {
                    logger.logError('notificationController - verifyCredentials - error validating credentials');
                    logger.logError(err);
                    return res.status(200).send({error: 'server-error'});
                }
                return res.status(200).send({result: result});
            });
        } catch (ex) {
            logger.logError('notificationController - verifyCredentials - exception');
            logger.logError(ex);
            return res.status(200).send({error: 'server-error'});
        } finally {
            apiLog.responseTime = (new Date()).toUTCString();
            apiLog.save(function (err) {
                if (err) {
                    logger.logError('notificationController - verifyCredentials - error saving api log');
                    logger.logError(err);
                }
            });
        }
    },

    executeDunning: function (req, res) {
        var log = new ApiLog();
        log.name = 'execute-dunning';
        log.type = 'notification';
        log.requestTime = (new Date()).toUTCString();
        log.clientId = req.query.clientId;
        log.apiKey = req.query.apiKey;
        log.body = req.body;
        try {
            validateCredentials(req.query.clientId, req.query.apiKey, function (err, result) {
                if (err) {
                    logger.logError('notificationController - executeDunning - error validating credentials');
                    logger.logError(err);
                    return res.status(200).send({error: 'server-error'});
                }
                if (!result) {
                    return res.status(200).send({error: 'unauthorized'});
                }
                req.body.clientId = req.query.clientId;
                dummy('executeDunning', req.body, function (err) {
                    if (err) {
                        logger.logError('notificationController - executeDunning - error adding job to queue');
                        logger.logError(err);
                        return res.status(200).send({error: 'server-error'});
                    } else {
                        return res.status(200).send({error: '', result: 'success'});
                    }
                });
            });
        } catch (ex) {
            logger.logError('notificationController - executeDunning - exception');
            logger.logError(ex);
            return res.status(200).send({error: 'server-error'});
        } finally {
            log.responseTime = (new Date()).toUTCString();
            log.save(function (err) {
                if (err) {
                    logger.logError('notificationController - executeDunning - error saving notification log');
                    logger.logError(err);
                }
            });
        }
    },

    paymentReceived: function (req, res) {
        var log = new ApiLog();
        log.name = 'payment-received';
        log.type = 'notification';
        log.requestTime = (new Date()).toUTCString();
        log.clientId = req.query.clientId;
        log.apiKey = req.query.apiKey;
        log.body = req.body;
        try {
            validateCredentials(req.query.clientId, req.query.apiKey, function (err, result) {
                if (err) {
                    logger.logError('notificationController - paymentReceived - error validating credentials');
                    logger.logError(err);
                    return res.status(200).send({error: 'server-error'});
                }
                if (!result) {
                    return res.status(200).send({error: 'unauthorized'});
                }
                req.body.clientId = req.query.clientId;
                dummy('paymentReceived', req.body, function (err) {
                    if (err) {
                        logger.logError('notificationController - paymentReceived - error adding job to queue');
                        logger.logError(err);
                        return res.status(200).send({error: 'server-error'});
                    } else {
                        return res.status(200).send({error: '', result: 'success'});
                    }
                });
            });
        } catch (ex) {
            logger.logError('notificationController - paymentReceived - exception');
            logger.logError(ex);
            return res.status(200).send({error: 'server-error'});
        } finally {
            log.responseTime = (new Date()).toUTCString();
            log.save(function (err) {
                if (err) {
                    logger.logError('notificationController - paymentReceived - error saving notification log');
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
                    logger.logError('notificationController - validateCredentials - error fetching api client: ' + clientId);
                    logger.logError(err);
                    cb(err);
                } else {
                    cb(null, (client !== null && client.apiKey === apiKey && client.apiType === 'NOTIFICATION'));
                }
            });
        }
    } else {
        cb(null, false);
    }
}

function dummy(one, two, cb) {
    cb();
}
