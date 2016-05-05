'use strict';

var mongoose = require('mongoose'),
    math = require('mathjs'),
    moment = require('moment'),
    logger = require('../../common/setup/logger'),
    config = require('../../common/setup/config'),
    billing = require('../../common/services/billing'),
    subscription = require('../../common/services/subscription'),
    validation = require('../../common/services/validation'),
    db = mongoose.createConnection(config.db),
    User = db.model('User'),
    ApiClient = db.model('ApiClient'),
    ApiLog = db.model('ApiLog'),
    Payment = db.model('Payment'),
    Refund = db.model('Refund'),
    Account = db.model('Account'),
    Merchant = db.model('Merchant');

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
                            result: (user !== null && user.status !== 'suspended'),
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
                req.body.agentNumber = config.freeSideAgentNumbers[clientName];
                req.body.merchantId = req.query.merchantId;
                req.body.merchantName = clientName;
                makePaymentService(req.body, function (err) {
                    if (err) {
                        logger.logError('merchantController - makePayment - error adding job to queue');
                        logger.logError(err);
                        return res.status(200).send({error: err.message});
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
                req.body.merchantId = req.query.merchantId;
                makeRefundService(req.body, function (err) {
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

function makePaymentService(params, callback) {
    try {
        makePaymentInputValidation(params, function (err) {
            if (err) {
                logger.logError('merchantGateway - makePayment - validation error');
                logger.logError(err);
                savePayment(params, 'failure', err, function () {
                    callback(new Error(err));
                });
            } else {
                params.currency = 'USD';
                var username = validation.getUsername(params.username);
                User.findOne({email: username}).populate('account').exec(function (err, dbUser) {
                    if (err) {
                        logger.logError('merchantGateway - makePayment - error fetching user: ' + params.username);
                        logger.logError(err);
                        savePayment(params, 'failure', 'server-error', function () {
                            callback(err);
                        });
                    } else if (!dbUser) {
                        savePayment(params, 'failure', 'username-not-found', function () {
                            callback(new Error('username-not-found'));
                        });
                    } else {
                        if (dbUser.status === 'failed') {
                            savePayment(params, 'failure', 'account-error', function () {
                                callback(new Error('account-error'));
                            });
                        } else if (dbUser.status === 'suspended') {
                            savePayment(params, 'failure', 'account-error', function () {
                                callback(new Error('account-error'));
                            });
                        } else if (dbUser.account.type === 'comp') {
                            savePayment(params, 'failure', 'account-error', function () {
                                callback(new Error('account-error'));
                            });
                        } else {
                            updateAccountForPayment(dbUser.email, dbUser.account._id, params.merchantId, function (err, merchant, firstMerchantPaymentDate, billingDate) {
                                if (err) {
                                    logger.logError('merchantGateway - makePayment - error updating user merchant: ' + params.username);
                                    logger.logError(err);
                                    savePayment(params, 'failure', 'server-error', function () {
                                        callback(err);
                                    });
                                } else {
                                    var payBy = '';
                                    if (params.merchantName === 'IDT') {
                                        payBy = 'IDTP';
                                    }
                                    if (dbUser.account.type === 'free') {
                                        billing.updateAgent(dbUser.account.freeSideCustomerNumber, params.agentNumber, function (err) {
                                            if (err) {
                                                logger.logError('merchantProcessorMain - makePayment - error updating agent ' + dbUser.account.freeSideCustomerNumber);
                                                logger.logError(err);
                                                rollbackAccountForPayment(dbUser.account._id, merchant, firstMerchantPaymentDate, billingDate);
                                                savePayment(params, 'failure', 'server-error', function () {
                                                    callback(err);
                                                });
                                            } else {
                                                subscription.upgradeSubscription(username, {}, function (err) {
                                                    if (err) {
                                                        logger.logError('merchantProcessorMain - updateAgent - error upgrading user: ' + params.username);
                                                        logger.logError(err);
                                                        rollbackAccountForPayment(dbUser.account._id, merchant, firstMerchantPaymentDate, billingDate);
                                                        savePayment(params, 'failure', 'server-error', function () {
                                                            callback(err);
                                                        });
                                                    } else {
                                                        billing.makePayment(dbUser.account.freeSideCustomerNumber, params.amount, payBy, function (err) {
                                                            if (err) {
                                                                logger.logError('merchantProcessorMain - makePayment - error updating payment 1 ' + dbUser.account.freeSideCustomerNumber);
                                                                logger.logError(err);
                                                                rollbackAccountForPayment(dbUser.account._id, merchant, firstMerchantPaymentDate, billingDate);
                                                                savePayment(params, 'failure', 'server-error', function () {
                                                                    callback(err);
                                                                });
                                                            } else {
                                                                savePayment(params, 'success', '', function () {
                                                                    callback(null, 'success');
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        billing.updateAgent(dbUser.account.freeSideCustomerNumber, params.agentNumber, function (err) {
                                            if (err) {
                                                logger.logError('merchantGateway - makePayment - error updating agent ' + dbUser.account.freeSideCustomerNumber);
                                                logger.logError(err);
                                                rollbackAccountForPayment(dbUser.account._id, merchant, firstMerchantPaymentDate, billingDate);
                                                savePayment(params, 'failure', 'server-error', function () {
                                                    callback(err);
                                                });
                                            } else {
                                                subscription.processCashPayment(username, function (err) {
                                                    if (err) {
                                                        logger.logError('merchantGateway - makePayment - error in update to merchant billing: ' + params.username);
                                                        logger.logError(err);
                                                        rollbackAccountForPayment(dbUser.account._id, merchant, firstMerchantPaymentDate, billingDate);
                                                        savePayment(params, 'failure', 'server-error', function () {
                                                            callback(err);
                                                        });
                                                    } else {
                                                        billing.makePayment(dbUser.account.freeSideCustomerNumber, params.amount, payBy, function (err) {
                                                            if (err) {
                                                                logger.logError('merchantGateway - makePayment - error updating payment 1 ' + dbUser.account.freeSideCustomerNumber);
                                                                logger.logError(err);
                                                                rollbackAccountForPayment(dbUser.account._id, merchant, firstMerchantPaymentDate, billingDate);
                                                                savePayment(params, 'failure', 'server-error', function () {
                                                                    callback(err);
                                                                });
                                                            } else {
                                                                savePayment(params, 'success', '', function () {
                                                                    callback(null, 'success');
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    } catch (err) {
        logger.logError('merchantProcessorMain - makePayment - error in make payment');
        logger.logError(err);
        callback(err);
    }
}

function makeRefundService(params, callback) {
    try {
        makeRefundInputValidation(params, function (err) {
            if (err) {
                logger.logError('merchantProcessorMain - makeRefund - validation error');
                logger.logError(err);
                saveRefund(params, 'failure', err, function () {
                    callback(new Error(err));
                });
            } else {
                params.currency = 'USD';
                var username = validation.getUsername(params.username);
                User.findOne({email: username}).populate('account').exec(function (err, dbUser) {
                    if (err) {
                        logger.logError('merchantGateway - makeRefund - error fetching user: ' + params.username);
                        logger.logError(err);
                        saveRefund(params, 'failure', 'server-error', function () {
                            callback(err);
                        });
                    } else if (!dbUser) {
                        saveRefund(params, 'failure', 'username-not-found', function () {
                            callback(new Error('username-not-found'));
                        });
                    } else {
                        if (dbUser.status === 'failed') {
                            saveRefund(params, 'failure', 'account-error', function () {
                                callback(new Error('account-error'));
                            });
                        } else if (dbUser.account.type === 'comp' || dbUser.account.type === 'free') {
                            saveRefund(params, 'failure', 'account-error', function () {
                                callback(new Error('account-error'));
                            });
                        } else if (dbUser && dbUser.account && !dbUser.account.firstCardPaymentDate && dbUser.account.firstMerchantPaymentDate) {
                            var refundLastDate = moment(dbUser.account.firstMerchantPaymentDate).add(config.refundPeriodInDays, 'days').utc();
                            if (refundLastDate.isAfter(moment.utc())) {
                                subscription.endPaidSubscription(username, function (err) {
                                    if (err) {
                                        logger.logError('merchantGateway - makeRefund - error in canceling subscription: ' + params.username);
                                        logger.logError(err);
                                        saveRefund(params, 'failure', 'server-error', function () {
                                            callback(err);
                                        });
                                    } else {
                                        billing.updateAgent(dbUser.account.freeSideCustomerNumber, 1, function (err) {
                                            if (err) {
                                                logger.logError('merchantGateway - makeRefund - error updating agent back to 1 ' + dbUser.account.freeSideCustomerNumber);
                                                logger.logError(err);
                                                saveRefund(params, 'failure', 'server-error', function () {
                                                    callback(err);
                                                });
                                            } else {
                                                billing.makeRefund(dbUser.account.freeSideCustomerNumber, params.amount, payBy, function (err) {
                                                    if (err) {
                                                        logger.logError('merchantProcessorMain - makeRefund - error refunding payment ' + dbUser.account.freeSideCustomerNumber);
                                                        logger.logError(err);
                                                        saveRefund(params, 'failure', 'server-error', function () {
                                                            callback(err);
                                                        });
                                                    } else {
                                                        saveRefund(params, 'success', '', function () {
                                                            callback(null, 'success');
                                                        });
                                                    }
                                                });
                                            }
                                        });

                                    }
                                });
                            } else {
                                saveRefund(params, 'failure', 'refund-not-allowed', function () {
                                    callback(new Error('refund-not-allowed'));
                                });
                            }
                        } else {
                            saveRefund(params, 'failure', 'refund-not-allowed', function () {
                                callback(new Error('refund-not-allowed'));
                            });
                        }
                    }
                });
            }
        });
    } catch (err) {
        logger.logError('merchantProcessorMain - makeRefund - error in make refund');
        logger.logError(err);
        callback(err);
    }
}

function makePaymentInputValidation(params, cb) {
    var emailRegex = config.regex.email;
    var phoneRegex = config.regex.telephone;
    if (!params.username || (!emailRegex.test(params.username) && !phoneRegex.test(params.username)) || params.username.trim().length > 50 || params.username.trim().length <= 0) {
        cb('invalid-username');
    } else if (!params.amount || typeof params.amount !== 'number') {
        cb('invalid-amount');
    } else if (math.mod(params.amount, 14.99) !== 0) {
        cb('invalid-amount');
    } else if (!params.submitTime || !moment(params.submitTime).isValid()) {
        cb('invalid-submit-time');
    } else if (params.currency && params.currency !== 'USD') {
        cb('invalid-currency');
    } else {
        cb(null);
    }
}

function savePayment(params, isSuccess, reason, cb) {
    var processTime = (new Date()).toUTCString();
    var payment = new Payment();
    payment.merchant = params.merchantId;
    payment.merchantPopId = params.merchantPopId;
    payment.merchantReferenceId = params.merchantReferenceId;
    payment.username = validation.getUsername(params.username);
    payment.status = isSuccess;
    payment.reason = reason;
    payment.processTime = processTime;
    payment.amount = (!params.amount || typeof params.amount !== 'number') ? 0 : params.amount;
    payment.submitTime = (!params.submitTime || !moment(params.submitTime).isValid()) ? '0' : params.submitTime;
    payment.currency = params.currency;
    payment.payload = params;
    payment.save(function (err) {
        if (err) {
            logger.logError('merchantGateway - savePayment - error saving Payment');
            logger.logError(err);
        }
        cb(err);
    });
}

function makeRefundInputValidation(params, cb) {
    var emailRegex = config.regex.email;
    var phoneRegex = config.regex.telephone;
    if (!params.username || (!emailRegex.test(params.username) && !phoneRegex.test(params.username)) || params.username.trim().length > 50 || params.username.trim().length <= 0) {
        cb('invalid-username');
    } else if (!params.amount || typeof params.amount !== 'number') {
        cb('invalid-amount');
    } else if (math.mod(params.amount, 14.99) !== 0) {
        cb('invalid-amount');
    } else if (!params.submitTime || !moment(params.submitTime).isValid()) {
        cb('invalid-submit-time');
    } else if (params.currency && params.currency !== 'USD') {
        cb('invalid-currency');
    } else {
        cb(null);
    }
}

function saveRefund(params, isSuccess, reason, cb) {
    var processTime = (new Date()).toUTCString();
    var refund = new Refund();
    refund.merchant = params.merchantId;
    refund.merchantPopId = params.merchantPopId;
    refund.merchantReferenceId = params.merchantReferenceId;
    refund.username = validation.getUsername(params.username);
    refund.status = isSuccess;
    refund.reason = reason;
    refund.processTime = processTime;
    refund.amount = (!params.amount || typeof params.amount !== 'number') ? 0 : params.amount;
    refund.submitTime = (!params.submitTime || !moment(params.submitTime).isValid()) ? '0' : params.submitTime;
    refund.currency = params.currency;
    refund.payload = params;
    refund.save(function (err) {
        if (err) {
            logger.logError('merchantGateway - saveRefund - error saving Refund');
            logger.logError(err);
        }
        cb(err);
    });
}

function updateAccountForPayment(email, accountId, merchantId, cb) {
    var firstMerchantPaymentDate;
    Payment.find({username: email, status: 'success'}, function (err, payments) {
        if (err) {
            logger.logError('merchantProcessorMain - updateAccountForPayment - error fetching payment history');
            logger.logError(err);
            cb(err);
        } else {
            if (payments && payments.length === 0) {
                firstMerchantPaymentDate = (new Date()).toUTCString();
            }
            Account.findOne({_id: accountId}, function (err, account) {
                if (err) {
                    logger.logError('merchantGateway - updateAccountForPayment - error fetching account');
                    logger.logError(err);
                    cb(err);
                } else if (!account) {
                    logger.logError('merchantGateway - updateAccountForPayment - account not found');
                    cb(new Error('Account not found'));
                } else {
                    Merchant.findOne({_id: merchantId}, function (err, merchant) {
                        if (err) {
                            logger.logError('merchantGateway - updateAccountForPayment - error fetching merchant');
                            logger.logError(err);
                            cb(err);
                        } else if (!merchant) {
                            logger.logError('merchantGateway - updateAccountForPayment - merchant not found');
                            cb(new Error('Merchant not found'));
                        } else {
                            var oldMerchant = account.merchant;
                            var oldFirstMerchantPaymentDate = account.firstMerchantPaymentDate;
                            var oldBillingDate = account.billingDate;
                            account.merchant = merchant.name;
                            if (!account.firstMerchantPaymentDate && firstMerchantPaymentDate) {
                                account.firstMerchantPaymentDate = firstMerchantPaymentDate;
                            }
                            if (!account.billingDate) {
                                account.billingDate = (new Date()).toUTCString();
                            }
                            account.save(function (err) {
                                if (err) {
                                    logger.logError('merchantGateway - updateAccountForPayment - error updating account');
                                    logger.logError(err);
                                    cb(err);
                                } else {
                                    cb(null, oldMerchant, oldFirstMerchantPaymentDate, oldBillingDate);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

function rollbackAccountForPayment(accountId, merchant, firstMerchantPaymentDate, billingDate) {
    Account.findOne({_id: accountId}, function (err, account) {
        if (err) {
            logger.logError('merchantGateway - rollbackAccountForPayment - error fetching account');
            logger.logError(err);
        } else if (!account) {
            logger.logError('merchantGateway - rollbackAccountForPayment - account not found');
        } else {
            account.merchant = merchant;
            account.firstMerchantPaymentDate = firstMerchantPaymentDate;
            account.billingDate = billingDate;
            account.save(function (err) {
                if (err) {
                    logger.logError('merchantGateway - rollbackAccountForPayment - error saving account');
                    logger.logError(err);
                }
            });
        }
    });
}
