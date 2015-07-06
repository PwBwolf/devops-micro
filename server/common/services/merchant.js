'use strict';

var async = require('async'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    uuid = require('node-uuid'),
    aio = require('./aio'),
    billing = require('./billing'),
    config = require('../setup/config'),
    email = require('./email'),
    logger = require('../setup/logger'),
    dbYip = mongoose.createConnection(config.db),
    User = dbYip.model('User'),
    Account = dbYip.model('Account'),
    Visitor = dbYip.model('Visitor'),
    userRoles = require('../../../client/scripts/config/routing').userRoles,
    sf = require('sf');

module.exports = {

    newPaidUser: function (user, cb) {
        var errorType, aioAccountId, freeSideCustomerNumber, freeSideSessionId;
        async.waterfall([
            // create user in db
            function (callback) {
                createUser(user, null, function (err, userObj) {
                    if (err) {
                        logger.logError('merchant - newPaidUser - error creating user: ' + user.email);
                    }
                    callback(err, userObj);
                });
            },
            // create account in db
            function (userObj, callback) {
                createAccount(user, userObj, 'paid', function (err, accountObj) {
                    if (err) {
                        logger.logError('merchant - newPaidUser - error creating account: ' + user.email);
                        errorType = 'db-account-insert';
                    }
                    callback(err, userObj, accountObj);
                });
            },
            // update user with account
            function (userObj, accountObj, callback) {
                userObj.account = accountObj;
                userObj.save(function (err) {
                    if (err) {
                        logger.logError('merchant - newPaidUser - error updating user with account details: ' + user.email);
                        errorType = 'db-user-update';
                    }
                    callback(err, userObj, accountObj);
                });
            },
            // create user in aio
            function (userObj, accountObj, callback) {
                aio.createUser(userObj.email, userObj._id, userObj.firstName + ' ' + userObj.lastName, userObj.password, userObj.email, config.aioUserPin, config.aioPaidPackages, function (err, data) {
                    if (err) {
                        logger.logError('merchant - newPaidUser - error creating user in aio: ' + userObj.email);
                        errorType = 'aio-user-insert';
                    }
                    if (data) {
                        aioAccountId = data.account;
                    }
                    callback(err, userObj, accountObj);
                });
            },
            // set aio account id in account
            function (userObj, accountObj, callback) {
                accountObj.aioAccountId = aioAccountId;
                accountObj.save(function (err) {
                    if (err) {
                        logger.logError('merchant - newPaidUser - error updating aio account id in account: ' + userObj.email);
                        logger.logError(err);
                    }
                });
                callback(null, userObj, accountObj);
            },
            // set aio user inactive
            function (userObj, accountObj, callback) {
                aio.updateUserStatus(userObj.email, false, function (err) {
                    if (err) {
                        logger.logError('merchant - newPaidUser - error setting aio user inactive: ' + userObj.email);
                        logger.logError(err);
                    }
                    callback(null, userObj, accountObj);
                });
            },
            // create user in freeside
            function (userObj, accountObj, callback) {
                var password = userObj.createdAt.getTime();
                billing.newCustomer(userObj.firstName, userObj.lastName, 'Merchant', 'West Palm Beach', 'FL', '00000', 'US', userObj.email, password, userObj.telephone, 'BILL', '', '', '', '', function (err, customerNumber, sessionId) {
                    if (err) {
                        logger.logError('merchant - newPaidUser - error creating user in freeside: ' + userObj.email);
                        errorType = 'freeside-user-insert';
                    }
                    freeSideCustomerNumber = customerNumber;
                    freeSideSessionId = sessionId;
                    callback(err, userObj, accountObj);
                });
            },
            // update freeside customer number in account
            function (userObj, accountObj, callback) {
                accountObj.freeSideCustomerNumber = freeSideCustomerNumber;
                accountObj.save(function (err) {
                    if (err) {
                        logger.logError('merchant - newPaidUser - error updating billing system customer number in account: ' + userObj.email);
                        logger.logError(err);
                    }
                });
                callback(null, userObj, accountObj);
            },
            // add locale
            function (userObj, accountObj, callback) {
                billing.updateLocale(freeSideSessionId, userObj.preferences.defaultLanguage + '_US', function (err) {
                    if (err) {
                        logger.logError('subscription - newFreeUser - error updating locale in freeside: ' + userObj.email);
                    }
                    callback(null, userObj, accountObj);
                });
            },
            // send verification email
            function (userObj, accountObj, callback) {
                sendVerificationEmail(userObj, function (err) {
                    if (err) {
                        logger.logError('merchant - newPaidUser - error sending verification email: ' + userObj.email);
                        logger.logError(err);
                    } else {
                        logger.logInfo('merchant - newPaidUser - verification email sent: ' + userObj.email);
                    }
                });
                callback(null, userObj, accountObj);
            },
            // delete user from visitor
            function (userObj, accountObj, callback) {
                deleteVisitor(userObj.email, function (err) {
                    if (err) {
                        logger.logError('merchant - newPaidUser - error deleting visitor: ' + userObj.email);
                        logger.logError(err);
                    }
                });
                callback(null, userObj, accountObj);
            }
        ], function (err, userObj, accountObj) {
            if (err) {
                logger.logError(err);
                switch (errorType) {
                    case 'freeside-user-insert':
                        setDbUserFailed(userObj);
                        break;
                    case 'aio-user-insert':
                    case 'db-user-update':
                        removeDbAccount(accountObj);
                        removeDbUser(userObj);
                        break;
                    case 'db-account-insert':
                        removeDbUser(userObj);
                }
            }
            if (cb) {
                cb(err);
            }
        });
    },

    upgradeSubscriptionSignUp: function (userEmail, newUser, cb) {
        var currentValues, currentUser, errorType;
        async.waterfall([
            // update user and account
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('merchant - upgradeSubscriptionSignUp - error fetching user: ' + userEmail);
                        callback(err);
                    } else {
                        if (!userObj) {
                            logger.logError('merchant - upgradeSubscriptionSignUp - user not found: ' + userEmail);
                            callback('UserNoFound');
                        } else if (userObj.status === 'failed') {
                            callback('FailedUser');
                        } else if (userObj.account.type === 'paid') {
                            callback('PaidUser');
                        } else if (userObj.account.type === 'comp' && (userObj.status === 'active' || userObj.status === 'registered')) {
                            callback('ActiveCompUser');
                        } else {
                            currentValues = {
                                type: userObj.account.type,
                                complimentaryCode: userObj.account.complimentaryCode,
                                billingDate: userObj.account.billingDate,
                                paymentPending: userObj.account.paymentPending,
                                status: userObj.status,
                                cancelDate: userObj.cancelDate,
                                upgradeDate: userObj.upgradeDate,
                                validTill: userObj.validTill
                            };
                            userObj.account.type = 'paid';
                            userObj.account.complimentaryCode = undefined;
                            userObj.account.billingDate = undefined;
                            userObj.account.paymentPending = true;
                            userObj.status = currentValues.status === 'registered' ? 'registered' : 'active';
                            userObj.upgradeDate = (new Date()).toUTCString();
                            userObj.cancelDate = undefined;
                            userObj.validTill = undefined;
                            if (newUser.firstName) {
                                currentUser = {
                                    firstName: userObj.firstName,
                                    lastName: userObj.lastName,
                                    telephone: userObj.telephone,
                                    hashedPassword: userObj.hashedPassword,
                                    salt: userObj.salt
                                };
                                userObj.firstName = newUser.firstName;
                                userObj.lastName = newUser.lastName;
                                userObj.telephone = newUser.telephone;
                                userObj.password = newUser.password;
                            }
                            userObj.save(function (err) {
                                if (err) {
                                    logger.logError('merchant - upgradeSubscriptionSignUp - error saving user: ' + userEmail);
                                    callback(err, userObj);
                                } else {
                                    userObj.account.save(function (err) {
                                        if (err) {
                                            logger.logError('merchant - upgradeSubscriptionSignUp - error saving account: ' + userEmail);
                                            errorType = 'db-account-update';
                                        }
                                        callback(err, userObj);
                                    });
                                }
                            });
                        }
                    }
                });
            },
            // change status to active in aio if user status is trial-ended or comp-ended
            function (userObj, callback) {
                if (currentValues.status === 'trial-ended' || currentValues.status === 'comp-ended') {
                    aio.updateUserStatus(userObj.email, true, function (err) {
                        if (err) {
                            logger.logError('merchant - upgradeSubscriptionSignUp - error setting status to active in aio: ' + userObj.email);
                            errorType = 'aio-status-update';
                        }
                        callback(err, userObj);
                    });
                } else {
                    callback(null, userObj);
                }
            },
            // change packages in aio to paid ones
            function (userObj, callback) {
                aio.updateUserPackages(userObj.email, config.aioPaidPackages, function (err) {
                    if (err) {
                        logger.logError('merchant - upgradeSubscriptionSignUp - error updating user packages to paid in aio: ' + userObj.email);
                        errorType = 'aio-package-update';
                    }
                    callback(err, userObj);
                });
            },
            // if password has changed set new password in aio
            function (userObj, callback) {
                if (newUser.password) {
                    aio.updatePassword(userObj.email, newUser.password, function (err) {
                        if (err) {
                            logger.logError('merchant - upgradeSubscriptionSignUp - error updating password in aio: ' + userObj.email);
                            errorType = 'aio-password-update';
                        }
                        callback(err, userObj);
                    });
                } else {
                    callback(null, userObj);
                }
            },
            // login to freeside
            function (userObj, callback) {
                billing.login(userObj.email, userObj.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('merchant - upgradeSubscriptionSignUp - error logging into billing system: ' + userObj.email);
                        errorType = 'freeside-login';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // update user information in freeside
            function (userObj, sessionId, callback) {
                billing.updateCustomer(sessionId, userObj.firstName, userObj.lastName, 'Merchant', 'West Palm Beach', 'FL', '00000', 'US', userObj.email, userObj.telephone, 'BILL', '', '', '', '', function (err) {
                    if (err) {
                        logger.logError('merchant - upgradeSubscriptionSignUp - error updating user in billing system: ' + userObj.email);
                        errorType = 'freeside-user-update';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // cancel existing package
            function (userObj, sessionId, callback) {
                billing.cancelPackageByType(sessionId, currentValues.type, function (err) {
                    if (err) {
                        logger.logError('merchant - upgradeSubscriptionSignUp - error removing active package: ' + userObj.email);
                        errorType = 'freeside-cancel-package';
                    }
                    callback(err, userObj);
                });
            },
            // send verification email if registered
            function (userObj, callback) {
                if (userObj.status === 'registered') {
                    sendVerificationEmail(userObj, function (err) {
                        if (err) {
                            logger.logError('merchant - upgradeSubscriptionSignUp - error sending verification email: ' + userObj.email);
                            logger.logError(err);
                        } else {
                            logger.logInfo('merchant - upgradeSubscriptionSignUp - verification email sent: ' + userObj.email);
                        }
                    });
                } else {
                    sendUpgradeEmail(userObj, function (err) {
                        if (err) {
                            logger.logError('merchant - upgradeSubscriptionSignUp - error sending upgrade email: ' + userObj.email);
                            logger.logError(err);
                        } else {
                            logger.logInfo('merchant - upgradeSubscriptionSignUp - upgrade email sent: ' + userObj.email);
                        }
                    });
                }
                callback(null, userObj);
            },
            // delete user from visitor
            function (userObj, callback) {
                deleteVisitor(userObj.email, function (err) {
                    if (err) {
                        logger.logError('merchant - upgradeSubscriptionSignUp - error deleting visitor: ' + userObj.email);
                        logger.logError(err);
                    }
                });
                callback(null, userObj);
            }
        ], function (err, userObj) {
            if (err) {
                logger.logError(err);
                switch (errorType) {
                    case 'db-account-update':
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        break;
                    case 'aio-status-update':
                        revertAccountChangesForUpgrade(userObj, currentValues);
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        break;
                    case 'aio-package-update':
                        setUserInactiveInAio(userObj.email, currentValues.status);
                        revertAccountChangesForUpgrade(userObj, currentValues);
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        break;
                    case 'aio-password-update':
                        revertUserPackagesInAio(userObj.email, currentValues.type);
                        setUserInactiveInAio(userObj.email, currentValues.status);
                        revertAccountChangesForUpgrade(userObj, currentValues);
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        break;
                    case 'freeside-user-update':
                    case 'freeside-login':
                    case 'freeside-cancel-package':
                        revertUserPackagesInAio(userObj.email, currentValues.type);
                        setUserInactiveInAio(userObj.email, currentValues.status);
                        revertAccountChangesForUpgrade(userObj, currentValues);
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        break;
                }
            }
            if (cb) {
                if (userObj) {
                    cb(err, userObj.status);
                } else {
                    cb(err);
                }
            }
        });
    },

    reactivateSubscriptionSignUp: function (userEmail, newUser, cb) {
        var currentValues, currentUser, errorType;
        async.waterfall([
            // update user and account
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('merchant - reactivateSubscriptionSignUp - error fetching user: ' + userEmail);
                        callback(err);
                    } else {
                        if ((userObj.status === 'active' || userObj.status === 'registered') && userObj.account.type === 'paid') {
                            callback('PaidActiveUser');
                        } else if (userObj.account.type === 'free' || userObj.account.type === 'comp') {
                            callback('NonPaidUser');
                        } else if (userObj.status === 'failed') {
                            callback('FailedUser');
                        } else {
                            currentValues = {
                                billingDate: userObj.account.billingDate,
                                paymentPending: userObj.account.paymentPending,
                                status: userObj.status,
                                cancelDate: userObj.cancelDate
                            };
                            userObj.account.billingDate = undefined;
                            userObj.account.paymentPending = true;
                            userObj.status = 'active';
                            userObj.cancelDate = undefined;
                            if (newUser.firstName) {
                                currentUser = {
                                    firstName: userObj.firstName,
                                    lastName: userObj.lastName,
                                    telephone: userObj.telephone,
                                    hashedPassword: userObj.hashedPassword,
                                    salt: userObj.salt
                                };
                                userObj.firstName = newUser.firstName;
                                userObj.lastName = newUser.lastName;
                                userObj.telephone = newUser.telephone;
                                userObj.password = newUser.password;
                            }
                            userObj.save(function (err) {
                                if (err) {
                                    logger.logError('merchant - reactivateSubscriptionSignUp - error saving user: ' + userEmail);
                                    callback(err, userObj);
                                } else {
                                    userObj.account.save(function (err) {
                                        if (err) {
                                            logger.logError('merchant - reactivateSubscriptionSignUp - error saving account: ' + userEmail);
                                            errorType = 'db-account-update';
                                        }
                                        callback(err, userObj);
                                    });
                                }
                            });
                        }
                    }
                });
            },
            // change status to active in aio
            function (userObj, callback) {
                aio.updateUserStatus(userObj.email, true, function (err) {
                    if (err) {
                        logger.logError('merchant - reactivateSubscriptionSignUp - error setting status to active in aio: ' + userObj.email);
                        errorType = 'aio-status-update';
                    }
                    callback(err, userObj);
                });
            },
            // if password has changed set new password in aio
            function (userObj, callback) {
                if (newUser.password) {
                    aio.updatePassword(userObj.email, newUser.password, function (err) {
                        if (err) {
                            logger.logError('merchant - reactivateSubscriptionSignUp - error updating password in aio: ' + userObj.email);
                            errorType = 'aio-password-update';
                        }
                        callback(err, userObj);
                    });
                } else {
                    callback(null, userObj);
                }
            },
            // login to freeside
            function (userObj, callback) {
                billing.login(userObj.email, userObj.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('merchant - reactivateSubscriptionSignUp - error logging into billing system: ' + userObj.email);
                        errorType = 'freeside-login';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // update user information in freeside
            function (userObj, sessionId, callback) {
                billing.updateCustomer(sessionId, userObj.firstName, userObj.lastName, 'Merchant', 'West Palm Beach', 'FL', '00000', 'US', userObj.email, userObj.telephone, 'BILL', '', '', '', '', function (err) {
                    if (err) {
                        logger.logError('merchant - reactivateSubscriptionSignUp - error updating user in billing system: ' + userObj.email);
                        errorType = 'freeside-user-update';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // cancel existing package
            function (userObj, sessionId, callback) {
                billing.cancelPackageByType(sessionId, 'paid', function (err) {
                    if (err) {
                        logger.logError('merchant - reactivateSubscriptionSignUp - error removing active package: ' + userObj.email);
                        errorType = 'freeside-cancel-package';
                    }
                    callback(err, userObj);
                });
            },
            // send email
            function (userObj, callback) {
                sendReactivateEmail(userObj, function (err) {
                    if (err) {
                        logger.logError('merchant - reactivateSubscriptionSignUp - error sending reactivated email: ' + userObj.email);
                        logger.logError(err);
                    } else {
                        logger.logInfo('merchant - reactivateSubscriptionSignUp - reactivated email sent: ' + userObj.email);
                    }
                });
                callback(null, userObj);
            },
            // delete user from visitor
            function (userObj, callback) {
                deleteVisitor(userObj.email, function (err) {
                    if (err) {
                        logger.logError('merchant - reactivateSubscriptionSignUp - error deleting visitor: ' + userObj.email);
                        logger.logError(err);
                    }
                });
                callback(null, userObj);
            }
        ], function (err, userObj) {
            if (err) {
                logger.logError(err);
                switch (errorType) {
                    case 'db-account-update':
                        revertUserChangesForReactivate(userObj, currentValues, currentUser);
                        break;
                    case 'aio-status-update':
                        revertAccountChangesForReactivate(userObj, currentValues);
                        revertUserChangesForReactivate(userObj, currentValues, currentUser);
                        break;
                    case 'aio-password-update':
                        setUserInactiveInAio(userObj.email, currentValues.status);
                        revertAccountChangesForReactivate(userObj, currentValues);
                        revertUserChangesForReactivate(userObj, currentValues, currentUser);
                        break;
                    case 'freeside-user-update':
                    case 'freeside-login':
                    case 'freeside-cancel-package':
                        setUserInactiveInAio(userObj.email, currentValues.status);
                        revertAccountChangesForReactivate(userObj, currentValues);
                        revertUserChangesForReactivate(userObj, currentValues, currentUser);
                        break;
                }
            }
            if (cb) {
                if (userObj) {
                    cb(err, userObj.status);
                } else {
                    cb(err);
                }
            }
        });
    },

    upgradeSubscription: function (userEmail, newUser, cb) {
        var currentValues, currentUser, errorType;
        async.waterfall([
            // update user and account
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('merchant - upgradeSubscription - error fetching user: ' + userEmail);
                        callback(err);
                    } else {
                        if (!userObj) {
                            logger.logError('merchant - upgradeSubscription - user not found: ' + userEmail);
                            callback('UserNoFound');
                        } else if (userObj.status === 'failed') {
                            callback('FailedUser');
                        } else if (userObj.account.type === 'paid') {
                            callback('PaidUser');
                        } else if (userObj.account.type === 'comp' && (userObj.status === 'active' || userObj.status === 'registered')) {
                            callback('ActiveCompUser');
                        } else {
                            currentValues = {
                                type: userObj.account.type,
                                complimentaryCode: userObj.account.complimentaryCode,
                                billingDate: userObj.account.billingDate,
                                paymentPending: userObj.account.paymentPending,
                                status: userObj.status,
                                cancelDate: userObj.cancelDate,
                                upgradeDate: userObj.upgradeDate,
                                validTill: userObj.validTill
                            };
                            userObj.account.type = 'paid';
                            userObj.account.complimentaryCode = undefined;
                            userObj.account.billingDate = (new Date()).toUTCString();
                            userObj.account.paymentPending = false;
                            userObj.status = currentValues.status === 'registered' ? 'registered' : 'active';
                            userObj.upgradeDate = (new Date()).toUTCString();
                            userObj.cancelDate = undefined;
                            userObj.validTill = undefined;
                            userObj.save(function (err) {
                                if (err) {
                                    logger.logError('merchant - upgradeSubscription - error saving user: ' + userEmail);
                                    callback(err, userObj);
                                } else {
                                    userObj.account.save(function (err) {
                                        if (err) {
                                            logger.logError('merchant - upgradeSubscription - error saving account: ' + userEmail);
                                            errorType = 'db-account-update';
                                        }
                                        callback(err, userObj);
                                    });
                                }
                            });
                        }
                    }
                });
            },
            // change status to active in aio if user status is trial-ended or comp-ended
            function (userObj, callback) {
                if (currentValues.status === 'trial-ended' || currentValues.status === 'comp-ended') {
                    aio.updateUserStatus(userObj.email, true, function (err) {
                        if (err) {
                            logger.logError('merchant - upgradeSubscription - error setting status to active in aio: ' + userObj.email);
                            errorType = 'aio-status-update';
                        }
                        callback(err, userObj);
                    });
                } else {
                    callback(null, userObj);
                }
            },
            // change packages in aio to paid ones
            function (userObj, callback) {
                aio.updateUserPackages(userObj.email, config.aioPaidPackages, function (err) {
                    if (err) {
                        logger.logError('merchant - upgradeSubscription - error updating user packages to paid in aio: ' + userObj.email);
                        errorType = 'aio-package-update';
                    }
                    callback(err, userObj);
                });
            },
            // if password has changed set new password in aio
            function (userObj, callback) {
                if (newUser.password) {
                    aio.updatePassword(userObj.email, newUser.password, function (err) {
                        if (err) {
                            logger.logError('merchant - upgradeSubscription - error updating password in aio: ' + userObj.email);
                            errorType = 'aio-password-update';
                        }
                        callback(err, userObj);
                    });
                } else {
                    callback(null, userObj);
                }
            },
            // login to freeside
            function (userObj, callback) {
                billing.login(userObj.email, userObj.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('merchant - upgradeSubscription - error logging into billing system: ' + userObj.email);
                        errorType = 'freeside-login';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // update user information in freeside
            function (userObj, sessionId, callback) {
                billing.updateCustomer(sessionId, userObj.firstName, userObj.lastName, userObj.account.merchant, 'West Palm Beach', 'FL', '00000', 'US', userObj.email, userObj.telephone, 'BILL', '', '', '', '', function (err) {
                    if (err) {
                        logger.logError('merchant - upgradeSubscription - error updating user in billing system: ' + userObj.email);
                        errorType = 'freeside-user-update';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // cancel existing package
            function (userObj, sessionId, callback) {
                billing.cancelPackageByType(sessionId, currentValues.type, function (err) {
                    if (err) {
                        logger.logError('merchant - upgradeSubscription - error removing active package: ' + userObj.email);
                        errorType = 'freeside-cancel-package';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // order paid package
            function (userObj, sessionId, callback) {
                billing.hasPaidActivePackage(sessionId, function (err, result) {
                    if (err) {
                        logger.logError('merchant - upgradeSubscription - error getting current packages: ' + userObj.email);
                        callback(err, userObj);
                    } else if (!result) {
                        billing.orderPackage(sessionId, config.freeSidePaidPackagePart, function (err) {
                            if (err) {
                                if (err === '_decline') {
                                    logger.logError('merchant - upgradeSubscription - credit card declined: ' + userObj.email);
                                    errorType = 'payment-declined';
                                } else {
                                    logger.logError('merchant - upgradeSubscription - error ordering package in freeside: ' + userObj.email);
                                    errorType = 'freeside-order-package';
                                }
                            }
                            callback(err, userObj);
                        });
                    } else {
                        callback(err, userObj);
                    }
                });
            },
            // send verification email if registered
            function (userObj, callback) {
                if (userObj.status === 'registered') {
                    sendVerificationEmail(userObj, function (err) {
                        if (err) {
                            logger.logError('merchant - upgradeSubscription - error sending verification email: ' + userObj.email);
                            logger.logError(err);
                        } else {
                            logger.logInfo('merchant - upgradeSubscription - verification email sent: ' + userObj.email);
                        }
                    });
                } else {
                    sendUpgradeEmail(userObj, function (err) {
                        if (err) {
                            logger.logError('merchant - upgradeSubscription - error sending upgrade email: ' + userObj.email);
                            logger.logError(err);
                        } else {
                            logger.logInfo('merchant - upgradeSubscription - upgrade email sent: ' + userObj.email);
                        }
                    });
                }
                callback(null, userObj);
            }
        ], function (err, userObj) {
            if (err) {
                logger.logError(err);
                switch (errorType) {
                    case 'db-account-update':
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        break;
                    case 'aio-status-update':
                        revertAccountChangesForUpgrade(userObj, currentValues);
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        break;
                    case 'aio-package-update':
                        setUserInactiveInAio(userObj.email, currentValues.status);
                        revertAccountChangesForUpgrade(userObj, currentValues);
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        break;
                    case 'aio-password-update':
                        revertUserPackagesInAio(userObj.email, currentValues.type);
                        setUserInactiveInAio(userObj.email, currentValues.status);
                        revertAccountChangesForUpgrade(userObj, currentValues);
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        break;
                    case 'freeside-user-update':
                    case 'freeside-login':
                    case 'freeside-cancel-package':
                    case 'freeside-order-package':
                        revertUserPackagesInAio(userObj.email, currentValues.type);
                        setUserInactiveInAio(userObj.email, currentValues.status);
                        revertAccountChangesForUpgrade(userObj, currentValues);
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        break;
                }
            }
            if (cb) {
                if (userObj) {
                    cb(err, userObj.status);
                } else {
                    cb(err);
                }
            }
        });
    },

    reactivateSubscription: function (userEmail, newUser, cb) {
        var currentValues, currentUser, errorType;
        async.waterfall([
            // update user and account
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('merchant - reactivateSubscription - error fetching user: ' + userEmail);
                        callback(err);
                    } else {
                        if ((userObj.status === 'active' || userObj.status === 'registered') && userObj.account.type === 'paid') {
                            callback('PaidActiveUser');
                        } else if (userObj.account.type === 'free' || userObj.account.type === 'comp') {
                            callback('NonPaidUser');
                        } else if (userObj.status === 'failed') {
                            callback('FailedUser');
                        } else {
                            currentValues = {
                                billingDate: userObj.account.billingDate,
                                paymentPending: userObj.account.paymentPending,
                                status: userObj.status,
                                cancelDate: userObj.cancelDate
                            };
                            userObj.status = 'active';
                            userObj.cancelDate = undefined;
                            userObj.account.billingDate = (new Date()).toUTCString();
                            userObj.account.paymentPending = false;
                            userObj.save(function (err) {
                                if (err) {
                                    logger.logError('merchant - reactivateSubscription - error saving user: ' + userEmail);
                                    callback(err, userObj);
                                } else {
                                    userObj.account.save(function (err) {
                                        if (err) {
                                            logger.logError('merchant - reactivateSubscription - error saving account: ' + userEmail);
                                            errorType = 'db-account-update';
                                        }
                                        callback(err, userObj);
                                    });
                                }
                            });
                        }
                    }
                });
            },
            // change status to active in aio
            function (userObj, callback) {
                aio.updateUserStatus(userObj.email, true, function (err) {
                    if (err) {
                        logger.logError('merchant - reactivateSubscription - error setting status to active in aio: ' + userObj.email);
                        errorType = 'aio-status-update';
                    }
                    callback(err, userObj);
                });
            },
            // if password has changed set new password in aio
            function (userObj, callback) {
                if (newUser.password) {
                    aio.updatePassword(userObj.email, newUser.password, function (err) {
                        if (err) {
                            logger.logError('merchant - reactivateSubscription - error updating password in aio: ' + userObj.email);
                            errorType = 'aio-password-update';
                        }
                        callback(err, userObj);
                    });
                } else {
                    callback(null, userObj);
                }
            },
            // login to freeside
            function (userObj, callback) {
                billing.login(userObj.email, userObj.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('merchant - reactivateSubscription - error logging into billing system: ' + userObj.email);
                        errorType = 'freeside-login';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // update user information in freeside
            function (userObj, sessionId, callback) {
                billing.updateCustomer(sessionId, userObj.firstName, userObj.lastName, userObj.account.merchant, 'West Palm Beach', 'FL', '00000', 'US', userObj.email, userObj.telephone, 'BILL', '', '', '', '', function (err) {
                    if (err) {
                        logger.logError('merchant - reactivateSubscription - error updating user in billing system: ' + userObj.email);
                        errorType = 'freeside-user-update';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // cancel existing package
            function (userObj, sessionId, callback) {
                billing.cancelPackageByType(sessionId, 'paid', function (err) {
                    if (err) {
                        logger.logError('merchant - reactivateSubscription - error removing active package: ' + userObj.email);
                        errorType = 'freeside-cancel-package';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // order paid package
            function (userObj, sessionId, callback) {
                billing.hasPaidActivePackage(sessionId, function (err, result) {
                    if (err) {
                        logger.logError('merchant - reactivateSubscription - error getting current packages: ' + userObj.email);
                        callback(err, userObj);
                    } else if (!result) {
                        billing.orderPackage(sessionId, config.freeSidePaidPackagePart, function (err) {
                            if (err) {
                                if (err === '_decline') {
                                    logger.logError('merchant - reactivateSubscription - credit card declined: ' + userObj.email);
                                    errorType = 'payment-declined';
                                } else {
                                    logger.logError('merchant - reactivateSubscription - error ordering package in freeside: ' + userObj.email);
                                    errorType = 'freeside-order-package';
                                }
                            }
                            callback(err, userObj);
                        });
                    } else {
                        callback(err, userObj);
                    }
                });
            },
            // send email
            function (userObj, callback) {
                sendReactivateEmail(userObj, function (err) {
                    if (err) {
                        logger.logError('merchant - reactivateSubscription - error sending reactivated email: ' + userObj.email);
                        logger.logError(err);
                    } else {
                        logger.logInfo('merchant - reactivateSubscription - reactivated email sent: ' + userObj.email);
                    }
                });
                callback(null, userObj);
            }
        ], function (err, userObj) {
            if (err) {
                logger.logError(err);
                switch (errorType) {
                    case 'db-account-update':
                        revertUserChangesForReactivate(userObj, currentValues, currentUser);
                        break;
                    case 'aio-status-update':
                        revertAccountChangesForReactivate(userObj, currentValues);
                        revertUserChangesForReactivate(userObj, currentValues, currentUser);
                        break;
                    case 'aio-password-update':
                        setUserInactiveInAio(userObj.email, currentValues.status);
                        revertAccountChangesForReactivate(userObj, currentValues);
                        revertUserChangesForReactivate(userObj, currentValues, currentUser);
                        break;
                    case 'freeside-user-update':
                    case 'freeside-login':
                    case 'freeside-cancel-package':
                    case 'freeside-order-package':
                        setUserInactiveInAio(userObj.email, currentValues.status);
                        revertAccountChangesForReactivate(userObj, currentValues);
                        revertUserChangesForReactivate(userObj, currentValues, currentUser);
                        break;
                }
            }
            if (cb) {
                if (userObj) {
                    cb(err, userObj.status);
                } else {
                    cb(err);
                }
            }
        });
    },

    endPaidSubscription: function (userEmail, cb) {
        var currentValues, errorType;
        async.waterfall([
            // set user status to 'canceled' and set canceledDate to current date
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error fetching user: ' + userEmail);
                        callback(err);
                    } else if (userObj.status === 'canceled' || userObj.status === 'failed') {
                        callback('NonActiveUser');
                    } else if (userObj.account.type === 'free') {
                        callback('FreeUser');
                    } else {
                        currentValues = {
                            status: userObj.status,
                            cancelDate: userObj.cancelDate,
                            cancelOn: userObj.cancelOn,
                            billingDate: userObj.account.billingDate,
                            paymentPending: userObj.account.paymentPending
                        };
                        userObj.account.billingDate = undefined;
                        userObj.account.paymentPending = false;
                        userObj.status = 'canceled';
                        userObj.cancelDate = (new Date()).toUTCString();
                        userObj.cancelOn = undefined;
                        userObj.save(function (err) {
                            if (err) {
                                logger.logError('subscription - cancelSubscription - error saving user with canceled status: ' + userObj.email);
                                callback(err);
                            } else {
                                userObj.account.save(function (err) {
                                    if (err) {
                                        logger.logError('subscription - cancelSubscription - error updating account: ' + userObj.email);
                                        errorType = 'db-account-update';
                                    }
                                    callback(err, userObj);
                                });
                            }
                        });
                    }
                });
            },
            // change status to inactive in aio
            function (userObj, callback) {
                aio.updateUserStatus(userObj.email, false, function (err) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error updating aio customer to inactive: ' + userObj.email);
                        errorType = 'aio-status-update';
                    }
                    callback(err, userObj);
                });
            },
            // login to freeside
            function (userObj, callback) {
                billing.login(userObj.email, userObj.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error logging into billing system: ' + userObj.email);
                        errorType = 'freeside-login';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // change credit card to dummy and modify billing address
            function (userObj, sessionId, callback) {
                var address = 'Canceled by user on ' + moment(userObj.cancelDate).format('MM/DD/YYYY');
                billing.updateCreditCard(sessionId, address, 'West Palm Beach', 'FL', '00000', 'US', 'CARD', '4242424242424242', '12/2035', '123', '', function (err) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error setting canceled address in billing system: ' + userObj.email);
                        errorType = 'freeside-user-update';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // cancel existing package
            function (userObj, sessionId, callback) {
                billing.cancelPackageByType(sessionId, 'paid', function (err) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error removing active package: ' + userObj.email);
                        errorType = 'freeside-cancel-package';
                    }
                    callback(err, userObj);
                });
            },
            // send email
            function (userObj, callback) {
                sendPaidSubscriptionEndedEmail(userObj, function (err) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error sending canceled email: ' + userObj.email);
                        logger.logError(err);
                    }
                });
                callback(null, userObj);
            }
        ], function (err, userObj) {
            if (err) {
                logger.logError(err);
                switch (errorType) {
                    case 'db-account-update':
                        revertUserChangesForCancel(userObj, currentValues);
                        break;
                    case 'aio-status-update':
                        revertAccountChangesForCancel(userObj, currentValues);
                        revertUserChangesForCancel(userObj, currentValues);
                        break;
                    case 'freeside-user-update':
                    case 'freeside-login':
                    case 'freeside-cancel-package':
                        setUserActiveInAio(userObj.email, currentValues.status);
                        revertAccountChangesForCancel(userObj, currentValues);
                        revertUserChangesForCancel(userObj, currentValues);
                        break;
                }
            }
            if (cb) {
                cb(err);
            }
        });
    },

    makeCashPayment: function (email, cb) {
        User.findOne({email: email}).populate('account').exec(function (err, userObj) {
            if (err) {
                logger.logError('merchant - updateToMerchantBilling - error fetching user: ' + email);
                cb(err);
            } else {
                billing.login(userObj.email, userObj.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('merchant - updateToMerchantBilling - error fetching user: ' + email);
                        cb(err);
                    } else {
                        billing.updateCustomer(sessionId, userObj.firstName, userObj.lastName, userObj.account.merchant, 'West Palm Beach', 'FL', '00000', 'US', userObj.email, userObj.telephone, 'BILL', '', '', '', '', function (err) {
                            if (err) {
                                logger.logError('merchant - updateToMerchantBilling - error updating user in billing system: ' + userObj.email);
                            }
                            cb(err);
                        });
                    }
                });
            }
        });
    }
};

function createUser(user, cc, cb) {
    var userObj = new User(user);
    userObj.role = userRoles.user;
    userObj.createdAt = (new Date()).toUTCString();
    userObj.verificationCode = uuid.v4();
    userObj.status = 'registered';
    if (cc) {
        userObj.validTill = moment(userObj.createdAt).add(cc.duration, 'days').utc();
    }
    userObj.save(function (err) {
        if (cb) {
            cb(err, userObj);
        }
    });
}

function createAccount(user, userObj, type, cb) {
    var now = (new Date()).toUTCString();
    var accountObj = new Account({
        type: type,
        merchant: 'YIPTV',
        paymentPending: true,
        primaryUser: userObj,
        users: [userObj],
        createdAt: now
    });
    accountObj.referredBy = user.referredBy;
    accountObj.save(function (err) {
        if (cb) {
            cb(err, accountObj);
        }
    });
}

function setDbUserFailed(user, cb) {
    user.status = 'failed';
    user.save(function (err) {
        if (cb) {
            cb(err);
        }
    });
}

function removeDbAccount(account, cb) {
    account.remove(function (err) {
        if (cb) {
            cb(err);
        }
    });
}

function removeDbUser(user, cb) {
    user.remove(function (err) {
        if (cb) {
            cb(err);
        }
    });
}

function sendVerificationEmail(user, cb) {
    var verificationUrl = config.url + 'verify-user?code=' + user.verificationCode;
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.accountVerificationEmailSubject[user.preferences.defaultLanguage],
        html: sf(config.accountVerificationEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, verificationUrl)
    };
    email.sendEmail(mailOptions, function (err) {
        if (cb) {
            cb(err);
        }
    });
}

function deleteVisitor(email, cb) {
    Visitor.findOne({email: email.toLowerCase()}, function (err, visitor) {
        if (visitor) {
            visitor.remove(function (err) {
                if (err) {
                    logger.logError('merchant - deleteVisitor - error removing visitor: ' + email);
                    logger.logError(err);
                }
            });
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertUserChangesForUpgrade(user, currentValues, currentUser, cb) {
    user.status = currentValues.status;
    user.cancelDate = currentValues.cancelDate;
    user.upgradeDate = currentValues.upgradeDate;
    user.validTill = currentValues.validTill;
    if (currentUser) {
        user.firstName = currentUser.firstName;
        user.lastName = currentUser.lastName;
        user.telephone = currentUser.telephone;
        user.hashedPassword = currentUser.hashedPassword;
        user.salt = currentUser.salt;
    }
    user.save(function (err) {
        if (err) {
            logger.logError('merchant - revertUserChangesForUpgrade - error reverting user changes: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertUserChangesForReactivate(user, currentValues, currentUser, cb) {
    user.status = currentValues.status;
    user.cancelDate = currentValues.cancelDate;
    if (currentUser) {
        user.firstName = currentUser.firstName;
        user.lastName = currentUser.lastName;
        user.telephone = currentUser.telephone;
        user.hashedPassword = currentUser.hashedPassword;
        user.salt = currentUser.salt;
    }
    user.save(function (err) {
        if (err) {
            logger.logError('merchant - revertUserChangesForReactivate - error reverting user changes: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertAccountChangesForUpgrade(user, currentValues, cb) {
    user.account.type = currentValues.type;
    user.account.complimentaryCode = currentValues.complimentaryCode;
    user.account.billingDate = currentValues.billingDate;
    user.account.paymentPending = currentValues.paymentPending;
    user.account.save(function (err) {
        if (err) {
            logger.logError('merchant - revertAccountChangesForUpgrade - error reverting account changes: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertAccountChangesForReactivate(user, currentValues, cb) {
    user.account.billingDate = currentValues.billingDate;
    user.account.paymentPending = currentValues.paymentPending;
    user.account.save(function (err) {
        if (err) {
            logger.logError('merchant - revertAccountChangesForReactivate - error reverting account changes: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertUserPackagesInAio(email, type, cb) {
    var packages = type === 'free' ? config.aioFreePackages : config.aioPaidPackages;
    aio.updateUserPackages(email, packages, function (err) {
        if (err) {
            logger.logError('merchant - revertPackagesInAio - error setting back package in aio: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function setUserInactiveInAio(email, status, cb) {
    if (status === 'trial-ended' || status === 'comp-ended' || status === 'canceled') {
        aio.updateUserStatus(email, false, function (err) {
            if (err) {
                logger.logError('merchant - setUserInactiveInAio - error setting user status to inactive in aio: ' + email);
                logger.logError(err);
            }
            if (cb) {
                cb(err);
            }
        });
    } else {
        if (cb) {
            cb();
        }
    }
}

function sendReactivateEmail(user, cb) {
    var signInUrl = config.url + 'sign-in?email=' + encodeURIComponent(user.email);
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.reactivateSubscriptionEmailSubject[user.preferences.defaultLanguage],
        html: sf(config.reactivateSubscriptionEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, signInUrl)
    };
    email.sendEmail(mailOptions, function (err) {
        if (err) {
            logger.logError('merchant - sendReactivateEmail - error sending email: ' + user.email);
            logger.logError(err);
        } else {
            logger.logInfo('merchant - sendReactivateEmail - email sent successfully: ' + user.email);
        }
        if (cb) {
            cb(err);
        }
    });
}

function sendUpgradeEmail(user, cb) {
    var signInUrl = config.url + 'sign-in?email=' + encodeURIComponent(user.email);
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.upgradeSubscriptionEmailSubject[user.preferences.defaultLanguage],
        html: sf(config.upgradeSubscriptionEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, signInUrl)
    };
    email.sendEmail(mailOptions, function (err) {
        if (err) {
            logger.logError('merchant - sendUpgradeEmail - error sending email: ' + user.email);
            logger.logError(err);
        } else {
            logger.logInfo('merchant - sendUpgradeEmail - email sent successfully: ' + user.email);
        }
        if (cb) {
            cb(err);
        }
    });
}

function sendPaidSubscriptionEndedEmail(user, cb) {
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.subscriptionCanceledEmailSubject[user.preferences.defaultLanguage],
        html: sf(config.subscriptionCanceledEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.url + 'reactivate-subscription')
    };
    email.sendEmail(mailOptions, function (err) {
        if (err) {
            logger.logError('merchant - sendPaidSubscriptionEndedEmail - error sending email: ' + user.email);
            logger.logError(err);
        } else {
            logger.logInfo('merchant - sendPaidSubscriptionEndedEmail - email sent successfully: ' + user.email);
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertUserChangesForCancel(user, currentValues, cb) {
    user.status = currentValues.status;
    user.cancelDate = currentValues.cancelDate;
    user.cancelOn = currentValues.cancelOn;
    user.save(function (err) {
        if (err) {
            logger.logError('merchant - revertUserChangesForCancel - error reverting user changes: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertAccountChangesForCancel(user, currentValues, cb) {
    user.account.billingDate = currentValues.billingDate;
    user.account.paymentPending = currentValues.paymentPending;
    user.account.save(function (err) {
        if (err) {
            logger.logError('merchant - revertAccountChangesForCancel - error reverting account changes: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function setUserActiveInAio(email, status, cb) {
    if (status === 'active' || status === 'registered') {
        aio.updateUserStatus(email, true, function (err) {
            if (err) {
                logger.logError('merchant - setUserActiveInAio - error setting user status to active in aio: ' + email);
                logger.logError(err);
            }
            if (cb) {
                cb(err);
            }
        });
    } else {
        if (cb) {
            cb();
        }
    }
}
