'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    logger = require('../../common/setup/logger'),
    config = require('../../common/setup/config'),
    billing = require('../../common/services/billing'),
    validation = require('../../common/services/validation'),
    db = mongoose.createConnection(config.db),
    User = db.model('User'),
    ApiClient = db.model('ApiClient'),
    ApiLog = db.model('ApiLog'),
    monq = require('monq'),
    queueDb = monq(config.db),
    queue = queueDb.queue('api-requests');

module.exports = {
    verifyCredentials: function (req, res) {
        var apiLog = new ApiLog();
        apiLog.name = 'verify-credentials';
        apiLog.type = 'merchant';
        apiLog.requestTime = (new Date()).toUTCString();
        apiLog.clientId = req.query.merchantId;
        apiLog.apiKey = req.query.apiKey;
        try {
            validateCredentials(req.query.merchantId, req.query.apiKey, function (err, result) {
                if (err) {
                    logger.logError('merchantController - verifyCredentials - error validating credentials');
                    logger.logError(err);
                    return res.status(200).send({error: 'server-error'});
                }
                return res.status(200).send({result: result});
            });
        } catch (ex) {
            logger.logError('merchantController - verifyCredentials - exception');
            logger.logError(ex);
            return res.status(200).send({error: 'server-error'});
        } finally {
            apiLog.responseTime = (new Date()).toUTCString();
            apiLog.save(function (err) {
                if (err) {
                    logger.logError('merchantController - verifyCredentials - error saving api log');
                    logger.logError(err);
                }
            });
        }
    },

    doesUsernameExist: function (req, res) {
        var apiLog = new ApiLog();
        apiLog.name = 'does-username-exist';
        apiLog.type = 'merchant';
        apiLog.requestTime = (new Date()).toUTCString();
        apiLog.clientId = req.query.merchantId;
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
                var emailRegex = config.regex.email;
                var phoneRegex = config.regex.telephone;
                if (!req.query.username || (!emailRegex.test(req.query.username) && !phoneRegex.test(req.query.username))) {
                    return res.status(200).send({error: 'invalid-username'});
                }
                var username = validation.getUsername(req.query.username);
                User.findOne({email: username}).populate('account').exec(function (err, user) {
                    if (err) {
                        logger.logError('merchantController - doesUsernameExist - error fetching user: ' + req.query.email);
                        logger.logError(err);
                        return res.status(200).send({error: 'server-error'});
                    }
                    var billingDate;
                    if (user && user.account.type === 'paid' && (user.status === 'registered' || user.status === 'active')) {
                        billing.login(user.email, user.account.key, user.createdAt.getTime(), function (err, sessionId) {
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
                                        return res.status(200).send({
                                            error: '',
                                            result: user !== null,
                                            billingDate: billingDate
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        return res.status(200).send({
                            error: '',
                            result: user !== null,
                            billingDate: billingDate
                        });
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

    makePayment: function (req, res) {
        var apiLog = new ApiLog();
        apiLog.name = 'make-payment';
        apiLog.type = 'merchant';
        apiLog.requestTime = (new Date()).toUTCString();
        apiLog.clientId = req.query.merchantId;
        apiLog.apiKey = req.query.apiKey;
        apiLog.body = req.body;
        try {
            validateCredentials(req.query.merchantId, req.query.apiKey, function (err, result, clientName) {
                if (err) {
                    logger.logError('merchantController - makePayment - error validating credentials');
                    logger.logError(err);
                    return res.status(200).send({error: 'server-error'});
                }
                if (!result) {
                    return res.status(200).send({error: 'unauthorized'});
                }
                var emailRegex = config.regex.email;
                var phoneRegex = config.regex.telephone;
                if (!req.body.username || (!emailRegex.test(req.body.username) && !phoneRegex.test(req.body.username))) {
                    return res.status(200).send({error: 'invalid-username'});
                }
                var username = validation.getUsername(req.body.username);
                User.findOne({email: username}).populate('account').exec(function (err, user) {
                    if (err) {
                        logger.logError('merchantController - makePayment - error fetching user: ' + req.body.email);
                        logger.logError(err);
                        return res.status(200).send({error: 'server-error'});
                    }
                    if (clientName === 'IDT') {
                        req.body.agentNumber = 2;
                    }
                    req.body.agentNumber = config.freeSideAgentNumbers[clientName];
                    req.body.merchantId = req.query.merchantId;
                    req.body.merchantName = clientName;
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
    },

    makeRefund: function (req, res) {
        var apiLog = new ApiLog();
        apiLog.name = 'make-refund';
        apiLog.type = 'merchant';
        apiLog.requestTime = (new Date()).toUTCString();
        apiLog.clientId = req.query.merchantId;
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
                var emailRegex = config.regex.email;
                var phoneRegex = config.regex.telephone;
                if (!req.body.username || (!emailRegex.test(req.body.username) && !phoneRegex.test(req.body.username))) {
                    return res.status(200).send({error: 'invalid-username'});
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
    }
};

function validateCredentials(merchantId, apiKey, cb) {
    if (merchantId && apiKey) {
        if (!(/^[0-9a-fA-F]{24}$/.test(merchantId))) {
            cb(null, false);
        } else {
            ApiClient.findOne({_id: merchantId}, function (err, client) {
                if (err) {
                    logger.logError('merchantController - validateCredentials - error fetching api client: ' + merchantId);
                    logger.logError(err);
                    cb(err);
                } else {
                    var result = client !== null && client.apiKey === apiKey && client.apiType === 'MERCHANT';
                    var output = result ? client.name : '';
                    cb(null, result, output);
                }
            });
        }
    } else {
        cb(null, false, '');
    }
}
