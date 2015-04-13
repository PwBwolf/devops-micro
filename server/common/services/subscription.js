'use strict';

var async = require('async'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    aio = require('./aio'),
    billing = require('./billing'),
    config = require('../config/config'),
    email = require('./email'),
    logger = require('../config/logger'),
    User = mongoose.model('User'),
    Account = mongoose.model('Account'),
    sf = require('sf');

module.exports = {
    endFreeTrial: function (userEmail, cb) {
        async.waterfall([
            // set user status to 'trial-ended'
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - endFreeTrial - error fetching user: ' + userEmail);
                        callback(err);
                    } else {
                        userObj.status = 'trial-ended';
                        userObj.cancelDate = (new Date()).toUTCString();
                        userObj.save(function (err1) {
                            if (err1) {
                                logger.logError('subscription - endFreeTrial - error saving user to trial-ended status: ' + userObj.email);
                                callback(err1);
                            } else {
                                callback(null, userObj);
                            }
                        });
                    }
                });
            },
            // change status to inactive in AIO
            function (userObj, callback) {
                aio.updateUserStatus(userObj.email, false, function (err) {
                    if (err) {
                        setUserActive(userObj);
                        logger.logError('subscription - endFreeTrial - error updating aio customer status to inactive: ' + userObj.email);
                        callback(err);
                    } else {
                        callback(null, userObj);
                    }
                });
            },
            // change billing address
            function (userObj, callback) {
                var address = 'Trial ended on ' + moment(userObj.cancelDate).format('MM/DD/YYYY');
                var city = 'West Palm Peach';
                var state = 'FL';
                var country = 'US';
                var zip = '00000';
                billing.setTrialOrComplimentaryEnded(userObj.account.freeSideCustomerNumber, address, city, state, country, zip, function (err) {
                    if (err) {
                        setUserActive(userObj);
                        setUserActiveInAio(userObj.email);
                        logger.logError('subscription - endFreeTrial - error updating billing system with trial address: ' + userObj.email);
                        callback(err);
                    } else {
                        callback(null, userObj);
                    }
                });
            },
            // send email
            function (userObj, callback) {
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: userObj.email,
                    subject: config.trialPeriodCompleteEmailSubject[userObj.preferences.defaultLanguage],
                    html: sf(config.trialPeriodCompleteEmailBody[userObj.preferences.defaultLanguage], config.imageUrl, userObj.firstName, userObj.lastName, config.url + 'upgrade-subscription')
                };
                email.sendEmail(mailOptions, function (err) {
                    if (err) {
                        logger.logError('subscription - endFreeTrial - error sending suspension email to ' + mailOptions.to);
                        logger.logError(err);
                        callback(err);
                    } else {
                        logger.logInfo('subscription - endFreeTrial - suspension email sent to ' + mailOptions.to);
                        callback(null, userObj);
                    }
                });
            }
        ], function (err) {
            if (err) {
                logger.logError(err);
            }
            if (cb) {
                cb(err);
            }
        });

        function setUserActive(user, cb) {
            user.status = 'active';
            user.save(function (err) {
                if (err) {
                    logger.logError('subscription - endFreeTrial.setUserActive - error saving user back to active: ' + user.email);
                    logger.logError(err);
                }
                if (cb) {
                    cb();
                }
            });
        }

        function setUserActiveInAio(email, cb) {
            aio.updateUserStatus(email, true, function (err) {
                if (err) {
                    logger.logError('subscription - endFreeTrial.setUserActiveInAio - error updating aio customer back to active: ' + email);
                    logger.logError(err);
                }
                if (cb) {
                    cb();
                }
            });
        }
    },

    endComplimentarySubscription: function (userEmail, cb) {
        async.waterfall([
            // set user status to 'comp-ended'
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - endComplimentarySubscription - error fetching user: ' + userEmail);
                        callback(err);
                    } else {
                        userObj.status = 'comp-ended';
                        userObj.cancelDate = (new Date()).toUTCString();
                        userObj.save(function (err1) {
                            if (err1) {
                                logger.logError('subscription - endComplimentarySubscription - error saving user to comp-ended status: ' + userObj.email);
                                callback(err1);
                            } else {
                                callback(null, userObj);
                            }
                        });
                    }
                });
            },
            // change status to inactive in AIO
            function (userObj, callback) {
                aio.updateUserStatus(userObj.email, false, function (err) {
                    if (err) {
                        setUserActive(userObj);
                        logger.logError('subscription - endComplimentarySubscription - error setting aio customer to inactive: ' + userObj.email);
                        callback(err);
                    } else {
                        callback(null, userObj);
                    }
                });
            },
            // change billing address
            function (userObj, callback) {
                var address = 'Complimentary subscription ended on ' + moment(userObj.cancelDate).format('MM/DD/YYYY');
                var city = 'West Palm Peach';
                var state = 'FL';
                var country = 'US';
                var zip = '00000';
                billing.setTrialOrComplimentaryEnded(userObj.account.freeSideCustomerNumber, address, city, state, country, zip, function (err) {
                    if (err) {
                        setUserActive(userObj);
                        setUserActiveInAio(userObj.email);
                        logger.logError('subscription - endComplimentarySubscription - error setting complimentary address in billing system: ' + userObj.email);
                        callback(err);
                    } else {
                        callback(null, userObj);
                    }
                });
            },
            // send email
            function (userObj, callback) {
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: userObj.email,
                    subject: config.complimentaryAccountEndedEmailSubject[userObj.preferences.defaultLanguage],
                    html: sf(config.complimentayAccountEndedEmailBody[userObj.preferences.defaultLanguage], config.imageUrl, userObj.firstName, userObj.lastName, config.url + 'upgrade-subscription')
                };
                email.sendEmail(mailOptions, function (err) {
                    if (err) {
                        logger.logError('subscription - endComplimentarySubscription - error sending complimentary account ended email to ' + mailOptions.to);
                        logger.logError(err);
                        callback(err);
                    } else {
                        logger.logInfo('subscription - endComplimentarySubscription - complimentary account ended email sent to ' + mailOptions.to);
                        callback(null, userObj);
                    }
                });
            }
        ], function (err) {
            if (err) {
                logger.logError(err);
            }
            if (cb) {
                cb(err);
            }
        });

        function setUserActive(user, cb) {
            user.status = 'active';
            user.save(function (err) {
                if (err) {
                    logger.logError('subscription - endComplimentarySubscription.setUserActive - error saving user back to active: ' + user.email);
                    logger.logError(err);
                }
                if (cb) {
                    cb();
                }
            });
        }

        function setUserActiveInAio(email, cb) {
            aio.updateUserStatus(email, true, function (err) {
                if (err) {
                    logger.logError('subscription - endComplimentarySubscription.setUserActiveInAio - error updating aio customer back to active: ' + email);
                    logger.logError(err);
                }
                if (cb) {
                    cb();
                }
            });
        }
    },

    cancelSubscription: function (userEmail, cb) {
        async.waterfall([
            // set user status to 'canceled' and set canceledDate to current date
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error fetching user: ' + userEmail);
                        callback(err);
                    } else if (userObj.status !== 'active') {
                        callback('NonActiveUser');
                    } else if (userObj.account.type === 'free') {
                        callback('FreeUser');
                    } else {
                        userObj.status = 'canceled';
                        userObj.cancelDate = (new Date()).toUTCString();
                        userObj.save(function (err1) {
                            if (err1) {
                                logger.logError('subscription - cancelSubscription - error saving user with canceled status: ' + userObj.email);
                                callback(err1);
                            } else {
                                callback(null, userObj);
                            }
                        });
                    }
                });
            },
            // change status to inactive in AIO
            function (userObj, callback) {
                aio.updateUserStatus(userObj.email, false, function (err) {
                    if (err) {
                        setUserActiveRemoveCanceledDate(userObj);
                        logger.logError('subscription - cancelSubscription - error updating aio customer to inactive: ' + userObj.email);
                        callback(err);
                    } else {
                        callback(null, userObj);
                    }
                });
            },
            // change credit card to dummy and modify billing address
            function (userObj, callback) {
                var address = 'Canceled by user on ' + moment(userObj.cancelDate).format('MM/DD/YYYY');
                var city = 'West Palm Peach';
                var state = 'FL';
                var country = 'US';
                var zip = '00000';
                billing.setAccountCanceled(userObj.account.freeSideCustomerNumber, address, city, state, country, zip, function (err) {
                    if (err) {
                        setUserActiveRemoveCanceledDate(userObj);
                        setUserActiveInAio(userObj.email);
                        logger.logError('subscription - cancelSubscription - error setting canceled address in billing system: ' + userObj.email);
                        callback(err);
                    } else {
                        callback(null, userObj);
                    }
                });
            }
        ], function (err) {
            if (err) {
                logger.logError(err);
            }
            if (cb) {
                cb(err);
            }
        });

        function setUserActiveRemoveCanceledDate(user, cb) {
            user.cancelDate = undefined;
            user.status = 'active';
            user.save(function (err) {
                if (err) {
                    logger.logError('subscription - cancelSubscription.setUserActiveRemoveCanceledDate - error saving user back to active: ' + user.email);
                    logger.logError(err);
                }
                if (cb) {
                    cb();
                }
            });
        }

        function setUserActiveInAio(email, cb) {
            aio.updateUserStatus(email, true, function (err) {
                if (err) {
                    logger.logError('subscription - cancelSubscription.setUserActiveInAio - error saving user back to active in aio: ' + email);
                    logger.logError(err);
                }
                if (cb) {
                    cb();
                }
            });
        }
    },

    reactivateSubscription: function (userEmail, newUser, cb) {
        var cancelDate;
        async.waterfall([
            // set user status to 'active' and remove canceledDate
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - reactivateSubscription - error fetching user: ' + userEmail);
                        callback(err);
                    } else if (userObj.status === 'active' && userObj.account.type === 'paid') {
                        callback('PaidActiveUser');
                    } else if (userObj.account.type === 'free') {
                        callback('FreeUser');
                    } else {
                        cancelDate = userObj.cancelDate;
                        userObj.status = 'active';
                        userObj.cancelDate = undefined;
                        userObj.save(function (err1) {
                            if (err1) {
                                logger.logError('subscription - reactivateSubscription - error saving user to active: ' + userObj.email);
                                callback(err1);
                            } else {
                                callback(null, userObj);
                            }
                        });
                    }
                });
            },
            // change status to active in AIO
            function (userObj, callback) {
                aio.updateUserStatus(userObj.email, true, function (err) {
                    if (err) {
                        setUserCanceledResetCanceledDate(cancelDate, userObj);
                        logger.logError('subscription - reactivateSubscription - error updating aio customer to active: ' + userObj.email);
                        callback(err);
                    } else {
                        callback(null, userObj);
                    }
                });
            },
            // set credit card and billing address
            function (userObj, callback) {
                var address = newUser.address;
                var city = newUser.city;
                var state = newUser.state;
                var zip = newUser.zipCode;
                var country = 'US';
                var payBy = 'CARD';
                var payInfo = newUser.cardNumber;
                var payDate = newUser.expiryDate;
                var payCvv = newUser.cvv;
                var payName = newUser.cardName;
                billing.updateCreditCard(userObj.account.freeSideCustomerNumber, address, city, state, zip, country, payBy, payInfo, payDate, payCvv, payName, function (err) {
                    if (err) {
                        setUserInactiveInAio(userObj.email);
                        setUserCanceledResetCanceledDate(cancelDate, userObj);
                        logger.logError('subscription - reactivateSubscription - error saving credit card to billing system: ' + userObj.email);
                        callback(err);
                    } else {
                        callback(null, userObj);
                    }
                });
            }
        ], function (err) {
            if (err) {
                logger.logError(err);
            }
            if (cb) {
                cb(err);
            }
        });

        function setUserCanceledResetCanceledDate(cancelDate, user, cb) {
            user.cancelDate = cancelDate;
            user.status = 'canceled';
            user.save(function (err) {
                if (err) {
                    logger.logError('subscription - reactivateSubscription.setUserCanceledResetCanceledDate - error saving user back to canceled: ' + user.email);
                    logger.logError(err);
                }
                if (cb) {
                    cb();
                }
            });
        }

        function setUserInactiveInAio(email, cb) {
            aio.updateUserStatus(email, false, function (err) {
                if (err) {
                    logger.logError('subscription - reactivateSubscription.setUserInactiveInAio - error setting aio customer to inactive: ' + email);
                    logger.logError(err);
                }
                if (cb) {
                    cb();
                }
            });
        }
    },

    upgradeSubscription: function (userEmail, newUser, cb) {
        var status,
            cancelDate;
        async.waterfall([
            // set account type to paid
            function (callback) {
                User.findOne({email: userEmail}, function (err, user) {
                    if (err) {
                        logger.logError('subscription - upgradeSubscription - error fetching user: ' + userEmail);
                        callback(err);
                    } else {
                        Account.findOne({_id: user.account}, function (err1, accountObj) {
                            if (err1) {
                                logger.logError('subscription - upgradeSubscription - error fetching account: ' + userEmail);
                                callback(err1);
                            } else if (accountObj.type !== 'free') {
                                callback('NonFreeUser');
                            } else {
                                accountObj.type = 'paid';
                                accountObj.save(function (err2) {
                                    if (err2) {
                                        logger.logError('subscription - upgradeSubscription - error saving account to paid: ' + userEmail);
                                        callback(err2);
                                    } else {
                                        callback(null, accountObj);
                                    }
                                });
                            }
                        });
                    }
                });
            },
            // set user upgrade date and make status active
            function (accountObj, callback) {
                User.findOne({email: userEmail}, function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - upgradeSubscription - error fetching user: ' + userEmail);
                        callback(err);
                    } else {
                        status = userObj.status;
                        cancelDate = userObj.cancelDate;
                        userObj.status = 'active';
                        userObj.upgradeDate = (new Date()).toUTCString();
                        userObj.cancelDate = undefined;
                        userObj.save(function (err1) {
                            if (err1) {
                                setAccountTypeToFree(accountObj);
                                logger.logError('subscription - upgradeSubscription - error saving user to active: ' + userEmail);
                                callback(err);
                            } else {
                                callback(null, accountObj, userObj);
                            }
                        });
                    }
                });
            },
            // change status to active in AIO if user status is trial-ended
            function (accountObj, userObj, callback) {
                if (status === 'trial-ended') {
                    aio.updateUserStatus(userObj.email, true, function (err) {
                        if (err) {
                            deleteUpgradeDateSetStatusAndCancelDate(userObj, status, cancelDate);
                            setAccountTypeToFree(accountObj);
                            logger.logError('subscription - upgradeSubscription - error setting status to active in aio: ' + userObj.email);
                            callback(err);
                        } else {
                            callback(null, accountObj, userObj);
                        }
                    });
                } else {
                    callback(null, accountObj, userObj);
                }
            },
            // change packages in AIO to paid ones
            function (accountObj, userObj, callback) {
                var packages = config.aioPaidPackages;
                aio.updateUserPackages(userObj.email, packages, function (err) {
                    if (err) {
                        optionallySetUserInactiveInAio(userObj, status);
                        deleteUpgradeDateSetStatusAndCancelDate(userObj, status);
                        setAccountTypeToFree(accountObj);
                        logger.logError('subscription - upgradeSubscription - error updating user packages to paid in aio: ' + userObj.email);
                        callback(err);
                    } else {
                        callback(null, accountObj, userObj);
                    }
                });
            },
            // set credit card information in FreeSide
            function (accountObj, userObj, callback) {
                var address = newUser.address;
                var city = newUser.city;
                var state = newUser.state;
                var zip = newUser.zipCode;
                var country = 'US';
                var payBy = 'CARD';
                var payInfo = newUser.cardNumber;
                var payDate = newUser.expiryDate;
                var payCvv = newUser.cvv;
                var payName = newUser.cardName;
                billing.updateCreditCard(accountObj.freeSideCustomerNumber, address, city, state, zip, country, payBy, payInfo, payDate, payCvv, payName, function (err) {
                    if (err) {
                        setFreePackagesInAio(userObj.email);
                        optionallySetUserInactiveInAio(userObj, status);
                        deleteUpgradeDateSetStatusAndCancelDate(userObj, status);
                        setAccountTypeToFree(accountObj);
                        logger.logError('subscription - upgradeSubscription - error setting credit card in billing system: ' + userObj.email);
                        callback(err);
                    } else {
                        callback(null, accountObj, userObj);
                    }
                });
            },
        ], function (err) {
            if(err) {
                logger.logError(err);
            }
            if(cb) {
                cb(err);
            }
        });

        function setAccountTypeToFree(account, cb) {
            account.type = 'free';
            account.save(function (err) {
                if (err) {
                    logger.logError('subscription - upgradeSubscription.setAccountTypeToFree - error set account status back to free: ' + userEmail);
                    logger.logError(err);
                }
                if (cb) {
                    cb();
                }
            });
        }

        function deleteUpgradeDateSetStatusAndCancelDate(user, status, cancelDate, cb) {
            user.status = status;
            user.upgradeDate = undefined;
            user.cancelDate = cancelDate;
            user.save(function (err) {
                if (err) {
                    logger.logError('subscription - upgradeSubscription.deleteUpgradeDateSetStatusAndCancelDate - error setting status back to old value: ' + user.email);
                    logger.logError(err);
                }
                if (cb) {
                    cb();
                }
            });
        }

        function setFreePackagesInAio(email, cb) {
            var packages = config.aioFreePackages;
            aio.updateUserPackages(email, packages, function (err) {
                if (err) {
                    logger.logError('subscription - upgradeSubscription.setFreePackagesInAio - error setting back to free package in aio: ' + email);
                    logger.logError(err);
                }
                if (cb) {
                    cb();
                }
            });
        }

        function optionallySetUserInactiveInAio(userObj, status, cb) {
            if (status === 'trial-ended') {
                aio.updateUserStatus(userObj.email, false, function (err) {
                    if (err) {
                        logger.logError('subscription - upgradeSubscription.updateUserStatus - error setting user to inactive in aio: ' + userObj.email);
                        logger.logError(err);
                    }
                    if (cb) {
                        cb();
                    }
                });
            } else {
                if (cb) {
                    cb();
                }
            }
        }
    }
};
