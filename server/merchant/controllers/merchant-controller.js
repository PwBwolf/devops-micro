'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    logger = require('../../common/setup/logger'),
    config = require('../../common/setup/config'),
    dbYip = mongoose.createConnection(config.db),
    dbMerchant = mongoose.createConnection(config.merchantDb),
    User = dbYip.model('User'),
    Merchant = dbMerchant.model('Merchant'),
    monq = require('monq'),
    queueDb = monq(config.merchantDb),
    queue = queueDb.queue('api-requests');

module.exports = {
    doesUsernameExist: function (req, res) {
        try {
            validateCredentials(req.query.merchantId, req.query.apiKey, function (err, result) {
                if (err) {
                    logger.logError('merchantController - doesUsernameExist - error validating credentials');
                    logger.logError(err);
                    return res.status(200).send({error: 'server-error'});
                }
                if (!result) {
                    return res.status(200).send({error: 'unauthorized'});
                }
                var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
                if (!req.query.username || !emailRegex.test(req.query.username)) {
                    return res.status(200).send({error: 'invalid-username'});
                }
                User.findOne({email: req.query.username.toLowerCase()}, function (err, user) {
                    if (err) {
                        logger.logError('merchantController - doesUsernameExist - error fetching user: ' + req.query.email);
                        logger.logError(err);
                        return res.status(200).send({error: 'server-error'});
                    }
                    var refundLastDate;
                    if(user) {
                        refundLastDate = moment(user.createdAt).add(config.refundPeriodInDays, 'days').utc();
                    }
                    return res.status(200).send({error: '', result: user !== null, refundLastDate: refundLastDate});
                });
            });
        } catch (ex) {
            logger.logError('merchantController - doesUsernameExist - exception');
            logger.logError(ex);
            return res.status(200).send({error: 'server-error'});
        }
    },

    makeRefund: function (req, res) {
        try {
            validateCredentials(req.query.merchantId, req.query.apiKey, function (err, result) {
                if (err) {
                    logger.logError('merchantController - makeRefund - error validating credentials');
                    logger.logError(err);
                    return res.status(200).send({error: 'server-error'});
                }
                if (!result) {
                    return res.status(200).send({error: 'unauthorized'});
                }
                req.body.merchantId = req.query.merchantId;
                queue.enqueue('makeRefund', req.body, function (err) {
                    if (err) {
                        logger.logError('merchantController - makeRefund - error adding job to queue');
                        logger.logError(err);
                        return res.status(200).send({error: 'server-error'});
                    } else {
                        return res.status(200).send({error: '', result: 'success'});
                    }
                });
            });
        } catch (ex) {
            logger.logError('merchantController - makeRefund - exception');
            logger.logError(ex);
            return res.status(200).send({error: 'server-error'});
        }
    },

    makePayment: function (req, res) {
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
