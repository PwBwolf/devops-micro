'use strict';

var mongoose = require('mongoose'),
    logger = require('../../common/setup/logger'),
    config = require('../../common/setup/config'),
    db = mongoose.createConnection(config.db),
    NotificationClient = db.model('NotificationClient'),
    NotificationLog = db.model('NotificationLog'),
    monq = require('monq'),
    queueDb = monq(config.db),
    queue = queueDb.queue('notification-api-requests');

module.exports = {

    executeDunning: function (req, res) {
        var log = new NotificationLog();
        log.name = 'execute-dunning';
        log.requestTime = (new Date()).toUTCString();
        log.notificationClientId = req.query.clientId;
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
                queue.enqueue('executeDunning', req.body, function (err) {
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
        var log = new NotificationLog();
        log.name = 'payment-received';
        log.requestTime = (new Date()).toUTCString();
        log.notificationClientId = req.query.clientId;
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
                queue.enqueue('paymentReceived', req.body, function (err) {
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
            NotificationClient.findOne({_id: clientId}, function (err, client) {
                if (err) {
                    logger.logError('notificationController - validateCredentials - error fetching notification client: ' + clientId);
                    logger.logError(err);
                    cb(err);
                } else {
                    cb(null, (client && client.apiKey === apiKey));
                }
            });
        }
    } else {
        cb(null, false);
    }
}
