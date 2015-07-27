'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var monq = require('monq'),
    moment = require('moment'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    logger = require('../../common/setup/logger'),
    config = require('../../common/setup/config'),
    queueDb = monq(config.db),
    modelsPath = config.root + '/server/common/models',
    db = mongoose.createConnection(config.db);

require('../../common/setup/models')(modelsPath);

var User = db.model('User');
var Dunning = db.model('Dunning');
var subscription = require('../../common/services/subscription');
var worker = queueDb.worker(['notification-api-requests']);

worker.register({

    executeDunning: function (params, callback) {
        try {
            executeDunningInputValidation(params, function (err) {
                if (err) {
                    logger.logError('notificationProcessorMain - executeDunning - validation error');
                    logger.logError(err);
                    saveDunning(params, 'failure', err, function () {
                        callback(err);
                    });
                } else {
                    User.findOne({email: params.username.toLowerCase()}).populate('account').exec(function (err, dbUser) {
                        if (err) {
                            logger.logError('notificationProcessorMain - executeDunning - error fetching user: ' + params.username);
                            logger.logError(err);
                            callback(err);
                        } else if (!dbUser) {
                            saveDunning(params, 'failure', 'username-not-found', function () {
                                callback(new Error('username-not-found'));
                            });
                        } else if (dbUser.status === 'failed') {
                            saveDunning(params, 'failure', 'account-error', function () {
                                callback(new Error('account-error'));
                            });
                        } else if (dbUser.account.type === 'comp' || dbUser.account.type === 'free') {
                            saveDunning(params, 'failure', 'account-error', function () {
                                callback(new Error('account-error'));
                            });
                        } else {
                            switch (params.days) {
                                case 5:
                                    subscription.dunning5Days(params.username, function (err) {
                                        if (err) {
                                            logger.logError('notificationProcessorMain - executeDunning - error executing dunning 5 days: ' + params.username);
                                            logger.logError(err);
                                            saveDunning(params, 'failure', err, function () {
                                                callback(err);
                                            });
                                        } else {
                                            saveDunning(params, 'success', '', function () {
                                                callback(null, 'success');
                                            });
                                        }
                                    });
                                    break;
                                case 10:
                                    subscription.dunning10Days(params.username, function (err) {
                                        if (err) {
                                            logger.logError('notificationProcessorMain - executeDunning - error executing dunning 10 days: ' + params.username);
                                            logger.logError(err);
                                            saveDunning(params, 'failure', err, function () {
                                                callback(err);
                                            });
                                        } else {
                                            saveDunning(params, 'success', '', function () {
                                                callback(null, 'success');
                                            });
                                        }
                                    });
                                    break;
                                default:
                                    saveDunning(params, 'success', '', function () {
                                        callback(null, 'success');
                                    });
                                    break;
                            }
                        }
                    });
                }
            });
        } catch (err) {
            logger.logError('notificationProcessorMain - executeDunning - error in executing dunning');
            logger.logError(err);
            callback(err);
        }
    }
});

worker.start();
logger.logInfo('notificationProcessorMain - notification processor daemon has started');

function executeDunningInputValidation(params, cb) {
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
    if (!params.username || !emailRegex.test(params.username) || params.username.trim().length > 50 || params.username.trim().length <= 0) {
        cb('invalid-username');
    } else if (!params.days || typeof params.days !== 'number' || !_.contains([1, 3, 5, 7, 10], params.days)) {
        cb('invalid-days');
    } else if (!params.submitTime || !moment(params.submitTime).isValid()) {
        cb('invalid-submit-time');
    } else {
        cb(null);
    }
}

function saveDunning(params, status, reason, cb) {
    var processTime = (new Date()).toUTCString();
    var log = new Dunning();
    log.username = params.username;
    log.days = (!params.days || typeof params.days !== 'number') ? 0 : params.days;
    log.submitTime = (!params.submitTime || !moment(params.submitTime).isValid()) ? '0' : params.submitTime;
    log.status = status;
    log.reason = reason;
    log.processTime = processTime;
    log.payload = params;
    log.save(function (err) {
        if (err) {
            logger.logError('notificationProcessorMain - saveDunning - error in saving dunning');
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}