'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var monq = require('monq'),
    moment = require('moment'),
    math = require('mathjs'),
    mongoose = require('mongoose'),
    logger = require('../../common/setup/logger'),
    config = require('../../common/setup/config'),
    queueDb = monq(config.merchantDb),
    modelsPath = config.root + '/server/common/models',
    dbYip = mongoose.createConnection(config.db),
    dbMerchant = mongoose.createConnection(config.merchantDb);

require('../../common/setup/models')(modelsPath);

var User = dbYip.model('User'),
    Payment = dbMerchant.model('Payment'),
    Refund = dbMerchant.model('Refund'),
    Account = dbYip.model('Account'),
    Merchant = dbYip.model('Merchant'),
    subscription = require('../../common/services/subscription');

var worker = queueDb.worker(['api-requests']);
worker.register({

    makePayment: function (params, callback) {
        try {
            makePaymentInputValidation(params, function (err) {
                if (err) {
                    logger.logError('merchantProcessorMain - makePayment - validation error');
                    logger.logError(err);
                    savePayment(params, 'failure', err, function () {
                        callback(new Error(err));
                    });
                } else {
                    params.currency = 'USD';
                    User.findOne({email: params.username.toLowerCase()}).populate('account').exec(function (err, dbUser) {
                        if (err) {
                            logger.logError('merchantProcessorMain - makePayment - error fetching user: ' + params.username);
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
                            } else if (dbUser.account.type === 'comp') {
                                savePayment(params, 'failure', 'account-error', function () {
                                    callback(new Error('account-error'));
                                });
                            } else {
                                updateAccountForPayment(dbUser.email, dbUser.account._id, params.merchantId, function (err, merchant, firstMerchantPaymentDate, billingDate) {
                                    if (err) {
                                        logger.logError('merchantProcessorMain - makePayment - error updating user merchant: ' + params.username);
                                        logger.logError(err);
                                        savePayment(params, 'failure', 'server-error', function () {
                                            callback(err);
                                        });
                                    } else {
                                        if (dbUser.account.type === 'free') {
                                            subscription.upgradeSubscription(params.username.toLowerCase(), {}, function (err) {
                                                if (err) {
                                                    logger.logError('merchantProcessorMain - makePayment - error upgrading user: ' + params.username);
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
                                        } else {
                                            subscription.processCashPayment(params.username.toLowerCase(), function (err) {
                                                if (err) {
                                                    logger.logError('merchantProcessorMain - makePayment - error in update to merchant billing: ' + params.username);
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
    },

    makeRefund: function (params, callback) {
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
                    User.findOne({email: params.username.toLowerCase()}).populate('account').exec(function (err, dbUser) {
                        if (err) {
                            logger.logError('merchantProcessorMain - makeRefund - error fetching user: ' + params.username);
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
                                    subscription.endPaidSubscription(params.username.toLowerCase(), function (err) {
                                        if (err) {
                                            logger.logError('merchantProcessorMain - makeRefund - error in canceling subscription: ' + params.username);
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
});

worker.start();
logger.logInfo('merchantProcessorMain - merchant processor daemon has started');

function makePaymentInputValidation(params, cb) {
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
    if (!params.username || !emailRegex.test(params.username) || params.username.trim().length > 50 || params.username.trim().length <= 0) {
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
    payment.username = params.username;
    payment.status = isSuccess;
    payment.reason = reason;
    payment.processTime = processTime;
    payment.amount = (!params.amount || typeof params.amount !== 'number') ? 0 : params.amount;
    payment.submitTime = (!params.submitTime || !moment(params.submitTime).isValid()) ? '0' : params.submitTime;
    payment.currency = params.currency;
    payment.payload = params;
    payment.save(function (err) {
        if (err) {
            logger.logError('merchantProcessorMain - savePayment - error saving Payment');
            logger.logError(err);
        }
        cb(err);
    });
}

function makeRefundInputValidation(params, cb) {
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
    if (!params.username || !emailRegex.test(params.username) || params.username.trim().length > 50 || params.username.trim().length <= 0) {
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
    refund.username = params.username;
    refund.status = isSuccess;
    refund.reason = reason;
    refund.processTime = processTime;
    refund.amount = (!params.amount || typeof params.amount !== 'number') ? 0 : params.amount;
    refund.submitTime = (!params.submitTime || !moment(params.submitTime).isValid()) ? '0' : params.submitTime;
    refund.currency = params.currency;
    refund.payload = params;
    refund.save(function (err) {
        if (err) {
            logger.logError('merchantProcessorMain - saveRefund - error saving Refund');
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
                    logger.logError('merchantProcessorMain - updateAccountForPayment - error fetching account');
                    logger.logError(err);
                    cb(err);
                } else if (!account) {
                    logger.logError('merchantProcessorMain - updateAccountForPayment - account not found');
                    cb(new Error('Account not found'));
                } else {
                    Merchant.findOne({_id: merchantId}, function (err, merchant) {
                        if (err) {
                            logger.logError('merchantProcessorMain - updateAccountForPayment - error fetching merchant');
                            logger.logError(err);
                            cb(err);
                        } else if (!merchant) {
                            logger.logError('merchantProcessorMain - updateAccountForPayment - merchant not found');
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
                                    logger.logError('merchantProcessorMain - updateAccountForPayment - error updating account');
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
            logger.logError('merchantProcessorMain - rollbackAccountForPayment - error fetching account');
            logger.logError(err);
        } else if (!account) {
            logger.logError('merchantProcessorMain - rollbackAccountForPayment - account not found');
        } else {
            account.merchant = merchant;
            account.firstMerchantPaymentDate = firstMerchantPaymentDate;
            account.billingDate = billingDate;
            account.save(function (err) {
                if (err) {
                    logger.logError('merchantProcessorMain - rollbackAccountForPayment - error saving account');
                    logger.logError(err);
                }
            });
        }
    });
}
