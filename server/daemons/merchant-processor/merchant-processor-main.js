'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var monq = require('monq'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    logger = require('../../common/config/logger'),
    config = require('../../common/config/config'),
    queueDb = monq(config.merchantDb),
    modelsPath = config.root + '/server/common/models',
    dbYip = mongoose.createConnection(config.db),
    dbMerchant = mongoose.createConnection(config.merchantDb);

require('../../common/config/models')(modelsPath);

var User = dbYip.model('User'),
    NewUser = dbMerchant.model('NewUser'),
    MakePayment = dbMerchant.model('MakePayment'),
    subscription = require('../../common/services/subscription');

var worker = queueDb.worker(['api-requests']);
worker.register({
    addUser: function (params, callback) {
        try {
            addUserInputValidation(params, function (err) {
                if (err) {
                    logger.logError('merchantProcessorMain - addUser - validation error');
                    logger.logError(err);
                    saveToDatabase(params, 'failure', err, function () {
                        callback(new Error(err));
                    });
                } else {
                    params.currency = 'USD';
                    doesUserExist(params.username, function (err, result) {
                        if (err) {
                            callback(err);
                        } else if (result) {
                            saveToDatabase(params, 'failure', 'username-exists', function () {
                                callback(new Error('username-exists'));
                            });
                        } else {
                            subscription.newMerchantUser(params, function (err) {
                                if (err) {
                                    callback(err);
                                } else {
                                    saveToDatabase(params, 'success', '', function () {
                                        callback(null, 'success');
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } catch (err) {
            logger.logError('merchantProcessorMain - addUser - error adding user');
            logger.logError(err);
            callback(err);
        }
    },

    makePayment: function (params, callback) {
        try {
            makePaymentInputValidation(params, function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, 'success');
                }
            });
        } catch (err) {
            logger.logError('merchantProcessorMain - addUser - error adding user');
            logger.logError(err);
            callback(err);
        }
    }
});

worker.start();
logger.logInfo('merchantProcessor - merchant processor daemon has started');

function addUserInputValidation(params, cb) {
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
    var nameRegex = /^[a-zA-Z0-9\s\-,.']+$/;
    var phoneRegex = /^[2-9]{1}[0-9]{2}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
    if (!params.username || !emailRegex.test(params.username)) {
        cb('invalid-username');
    } else if (!params.firstName || !nameRegex.test(params.firstName)) {
        cb('invalid-first-name');
    } else if (!params.lastName || !nameRegex.test(params.lastName)) {
        cb('invalid-last-name');
    } else if (!params.telephone || !phoneRegex.test(params.telephone)) {
        cb('invalid-telephone');
    } else if (!params.amount || typeof params.amount !== 'number') {
        cb('invalid-amount');
    } else if (params.amount % 14.99 !== 0) {
        cb('invalid-amount');
    } else if (!params.submitTime || !moment(params.submitTime).isValid()) {
        cb('invalid-submit-time');
    } else if (params.currency && params.currency !== 'USD') {
        cb('invalid-currency');
    } else {
        cb(null);
    }
}

function makePaymentInputValidation(params, cb) {
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
    if (!params.username || !emailRegex.test(params.username)) {
        cb('invalid-username');
    } else if (!params.amount || typeof params.amount !== 'number') {
        cb('invalid-amount');
    } else if (params.amount % 14.99 !== 0) {
        cb('invalid-amount');
    } else if (!params.submitTime || !moment(params.submitTime).isValid()) {
        cb('invalid-submit-time');
    }
}

function doesUserExist(email, cb) {
    User.findOne({email: email.toLowerCase()}, function (err, user) {
        if (err) {
            logger.logError('merchantProcessor - checkIfUserExists - error fetching user: ' + email);
            logger.logError(err);
            cb(err);
        } else {
            cb(null, user !== null);
        }
    });
}

function saveToDatabase(params, isSuccess, reason, cb) {
    var ownedBy;
    NewUser.find({username: params.username}, function (err, dbUser) {
        if (err) {
            logger.logError('merchantProcessorMain - saveToDatabase - error saving MakePayment');
            logger.logError(err);
            ownedBy = null;
        } else if (dbUser) {
            ownedBy = dbUser.merchant;
        } else {
            ownedBy = null;
        }
        var processTime = (new Date()).toUTCString();
        var payment = new MakePayment(params);
        payment.status = isSuccess;
        payment.reason = reason;
        payment.processTime = processTime;
        payment.isUserOwned = payment.merchant === ownedBy;
        payment.save(function (err) {
            if (err) {
                logger.logError('merchantProcessorMain - saveToDatabase - error saving MakePayment');
                logger.logError(err);
                cb(err);
            } else {
                if (params.firstName) {
                    var user = new NewUser(params);
                    user.status = isSuccess;
                    user.reason = reason;
                    user.processTime = processTime;
                    user.save(function (err1) {
                        if (err1) {
                            logger.logError('merchantProcessorMain - saveToDatabase - error saving NewUser');
                            logger.logError(err);
                            cb(err);
                        } else {
                            cb(null);
                        }
                    });
                } else {
                    cb(null);
                }
            }
        });
    });
}
