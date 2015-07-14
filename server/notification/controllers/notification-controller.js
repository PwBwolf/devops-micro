'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    logger = require('../../common/setup/logger'),
    config = require('../../common/setup/config'),
    billing = require('../../common/services/billing'),
    db = mongoose.createConnection(config.db),
    User = db.model('User'),
    Notification = db.model('Notification'),
    monq = require('monq'),
    queueDb = monq(config.merchantDb),
    queue = queueDb.queue('api-requests');

module.exports = {

    executeDunning: function (req, res) {
        var apiLog = new ApiLog();
        apiLog.name = 'make-payment';
        apiLog.requestTime = (new Date()).toUTCString();
        apiLog.merchantId = req.query.merchantId;
        apiLog.apiKey = req.query.apiKey;
        apiLog.body = req.body;
        try {
            validateCredentials(req.query.merchantId, req.query.apiKey, function (err, result) {
                if (err) {
                    logger.logError('merchantController - makePayment - error validating credentials');
                    logger.logError(err);
                    return res.status(200).send({error: 'server-error'});
                }
                if (!result) {
                    return res.status(200).send({error: 'unauthorized'});
                }
                req.body.merchantId = req.query.merchantId;
                queue.enqueue('makePayment', req.body, function (err) {
                    if (err) {
                        logger.logError('merchantController - makePayment - error adding job to queue');
                        logger.logError(err);
                        return res.status(200).send({error: 'server-error'});
                    } else {
                        return res.status(200).send({error: '', result: 'success'});
                    }
                });
            });
        } catch (ex) {
            logger.logError('merchantController - makePayment - exception');
            logger.logError(ex);
            return res.status(200).send({error: 'server-error'});
        } finally {
            apiLog.responseTime = (new Date()).toUTCString();
            apiLog.save(function (err) {
                if (err) {
                    logger.logError('merchantController - makePayment - error saving api log');
                    logger.logError(err);
                }
            });
        }
    }
};

function validateCredentials(merchantId, apiKey, cb) {
    if (merchantId && apiKey) {
        if (!(/^[0-9a-fA-F]{24}$/.test(merchantId))) {
            cb(null, false);
        } else {
            Merchant.findOne({_id: merchantId}, function (err, merchant) {
                if (err) {
                    logger.logError('merchantController - validateCredentials - error fetching merchant: ' + merchantId);
                    logger.logError(err);
                    cb(err);
                } else {
                    cb(null, (merchant && merchant.apiKey === apiKey));
                }
            });
        }
    } else {
        cb(null, false);
    }
}
