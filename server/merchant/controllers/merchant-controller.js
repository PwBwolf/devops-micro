'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    logger = require('../../common/setup/logger'),
    config = require('../../common/setup/config'),
    billing = require('../../common/services/billing'),
    dbYip = mongoose.createConnection(config.db),
    dbMerchant = mongoose.createConnection(config.merchantDb),
    User = dbYip.model('User'),
    Merchant = dbMerchant.model('Merchant'),
    ApiLog = dbMerchant.model('ApiLog'),
    monq = require('monq'),
    queueDb = monq(config.merchantDb),
    queue = queueDb.queue('api-requests');

module.exports = {
    doesUsernameExist: function (req, res) {
        var apiLog = new ApiLog();
        apiLog.name = 'does-username-exist';
        apiLog.requestTime = (new Date()).toUTCString();
        apiLog.merchantId = req.query.merchantId;
        apiLog.apiKey = req.query.apiKey;
        apiLog.params = {username: req.query.username};
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
                User.findOne({email: req.query.username.toLowerCase()}).populate('account').exec(function (err, user) {
                    if (err) {
                        logger.logError('merchantController - doesUsernameExist - error fetching user: ' + req.query.email);
                        logger.logError(err);
                        return res.status(200).send({error: 'server-error'});
                    }
                    var refundLastDate, billingDate;
                    if (user && user.account && !user.account.firstCardPaymentDate && user.account.firstMerchantPaymentDate) {
                        refundLastDate = moment(user.account.firstMerchantPaymentDate).add(config.refundPeriodInDays, 'days').utc();
                    }
                    if (user && user.account.type === 'paid' && (user.status === 'registered' || user.status === 'active')) {
                        billing.login(user.email, user.createdAt.getTime(), function (err, sessionId) {
                            if (err) {
                                logger.logError('merchantController - doesUsernameExist - error logging in to billing system: ' + req.query.email);
                                logger.logError(err);
                                return res.status(200).send({error: 'server-error'});
                            } else {
                                billing.getBillingDate(sessionId, function (err, billDate) {
                                    if (err) {
                                        logger.logError('merchantController - doesUsernameExist - error fetching billing date: ' + req.query.email);
                                        logger.logError(err);
                                        return res.status(200).send({error: 'server-error'});
                                    } else {
                                        if (billDate) {
                                            billingDate = billDate;
                                        }
                                        return res.status(200).send({error: '', result: user !== null, refundLastDate: refundLastDate, billingDate: billingDate});
                                    }
                                });
                            }
                        });
                    } else {
                        return res.status(200).send({error: '', result: user !== null, refundLastDate: refundLastDate, billingDate: billingDate});
                    }
                });
            });
        } catch (ex) {
            logger.logError('merchantController - doesUsernameExist - exception');
            logger.logError(ex);
            return res.status(200).send({error: 'server-error'});
        } finally {
            apiLog.responseTime = (new Date()).toUTCString();
            apiLog.save(function (err) {
                if (err) {
                    logger.logError('merchantController - doesUsernameExist - error saving api log');
                    logger.logError(err);
                }
            });
        }
    },

    makeRefund: function (req, res) {
        var apiLog = new ApiLog();
        apiLog.name = 'make-refund';
        apiLog.requestTime = (new Date()).toUTCString();
        apiLog.merchantId = req.query.merchantId;
        apiLog.apiKey = req.query.apiKey;
        apiLog.body = req.body;
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
        } finally {
            apiLog.responseTime = (new Date()).toUTCString();
            apiLog.save(function (err) {
                if (err) {
                    logger.logError('merchantController - makeRefund - error saving api log');
                    logger.logError(err);
                }
            });
        }
    },

    makePayment: function (req, res) {
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
