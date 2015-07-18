'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    uuid = require('node-uuid'),
    aio = require('./aio'),
    billing = require('./billing'),
    config = require('../setup/config'),
    email = require('./email'),
    logger = require('../setup/logger'),
    date = require('./date'),
    dbYip = mongoose.createConnection(config.db),
    User = dbYip.model('User'),
    Account = dbYip.model('Account'),
    Visitor = dbYip.model('Visitor'),
    ComplimentaryCode = dbYip.model('ComplimentaryCode'),
    userRoles = require('../../../client/scripts/config/routing').userRoles,
    sf = require('sf');

module.exports = {

    newFreeUser: function (user, cb) {
        var errorType, aioAccountId, freeSideCustomerNumber, freeSideSessionId;
        async.waterfall([
            // create user in db
            function (callback) {
                createUser(user, null, function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - newFreeUser - error creating user: ' + user.email);
                    }
                    callback(err, userObj);
                });
            },
            // create account in db
            function (userObj, callback) {
                createAccount(user, userObj, 'free', function (err, accountObj) {
                    if (err) {
                        logger.logError('subscription - newFreeUser - error creating account: ' + user.email);
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
                        logger.logError('subscription - newFreeUser - error updating user with account details: ' + user.email);
                        errorType = 'db-user-update';
                    }
                    callback(err, userObj, accountObj);
                });
            },
            // create user in aio and add packages
            function (userObj, accountObj, callback) {
                aio.createUser(userObj.email, userObj._id, userObj.firstName + ' ' + userObj.lastName, userObj.password, userObj.email, config.aioUserPin, config.aioFreeUserPackages, function (err, data) {
                    if (err) {
                        logger.logError('subscription - newFreeUser - error creating user in aio: ' + userObj.email);
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
                        logger.logError('subscription - newFreeUser - error updating aio account id in account: ' + userObj.email);
                        logger.logError(err);
                    }
                });
                callback(null, userObj, accountObj);
            },
            // set aio user inactive
            function (userObj, accountObj, callback) {
                aio.updateUserStatus(userObj.email, false, function (err) {
                    if (err) {
                        logger.logError('subscription - newFreeUser - error setting aio user inactive: ' + userObj.email);
                        logger.logError(err);
                    }
                    callback(null, userObj, accountObj);
                });
            },
            // create user in freeside
            function (userObj, accountObj, callback) {
                var password = userObj.createdAt.getTime();
                billing.newCustomer(userObj.firstName, userObj.lastName, 'Free', 'West Palm Beach', 'FL', '00000', 'US', userObj.email, password, userObj.telephone, 'BILL', '', '', '', '', userObj.preferences.defaultLanguage + '_US', function (err, customerNumber, sessionId) {
                    if (err) {
                        logger.logError('subscription - newFreeUser - error creating user in freeside: ' + userObj.email);
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
                        logger.logError('subscription - newFreeUser - error updating billing system customer number in account: ' + userObj.email);
                        logger.logError(err);
                    }
                });
                callback(null, userObj, accountObj);
            },
            // add free packages in freeside
            function (userObj, accountObj, callback) {
                async.eachSeries(
                    config.freeSideFreeUserPackageParts,
                    function (item, callback) {
                        billing.orderPackage(freeSideSessionId, item, function (err) {
                            if (err) {
                                logger.logError('subscription - newFreeUser - error ordering packages in freeside: ' + userObj.email);
                                errorType = 'freeside-order-insert';
                            }
                            callback(err);
                        });
                    },
                    function (err) {
                        callback(err, userObj, accountObj);
                    }
                );
            },
            // send verification email
            function (userObj, accountObj, callback) {
                sendVerificationEmail(userObj, function (err) {
                    if (err) {
                        logger.logError('subscription - newFreeUser - error sending verification email: ' + userObj.email);
                        logger.logError(err);
                    } else {
                        logger.logInfo('subscription - newFreeUser - verification email sent: ' + userObj.email);
                    }
                });
                callback(null, userObj, accountObj);
            },
            // delete user from visitor
            function (userObj, accountObj, callback) {
                deleteVisitor(userObj.email, function (err) {
                    if (err) {
                        logger.logError('subscription - newFreeUser - error deleting visitor: ' + userObj.email);
                        logger.logError(err);
                    }
                });
                callback(null, userObj, accountObj);
            }
        ], function (err, userObj, accountObj) {
            if (err) {
                logger.logError(err);
                switch (errorType) {
                    case 'freeside-order-insert':
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

    newPaidUser: function (user, cb) {
        var errorType, aioAccountId, freeSideCustomerNumber, freeSideSessionId;
        async.waterfall([
            // create user in db
            function (callback) {
                createUser(user, null, function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - newPaidUser - error creating user: ' + user.email);
                    }
                    callback(err, userObj);
                });
            },
            // create account in db
            function (userObj, callback) {
                createAccount(user, userObj, 'paid', function (err, accountObj) {
                    if (err) {
                        logger.logError('subscription - newPaidUser - error creating account: ' + user.email);
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
                        logger.logError('subscription - newPaidUser - error updating user with account details: ' + user.email);
                        errorType = 'db-user-update';
                    }
                    callback(err, userObj, accountObj);
                });
            },
            // create user in aio
            function (userObj, accountObj, callback) {
                aio.createUser(userObj.email, userObj._id, userObj.firstName + ' ' + userObj.lastName, userObj.password, userObj.email, config.aioUserPin, config.aioPaidUserPackages, function (err, data) {
                    if (err) {
                        logger.logError('subscription - newPaidUser - error creating user in aio: ' + userObj.email);
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
                        logger.logError('subscription - newPaidUser - error updating aio account id in account: ' + userObj.email);
                        logger.logError(err);
                    }
                });
                callback(null, userObj, accountObj);
            },
            // set aio user inactive
            function (userObj, accountObj, callback) {
                aio.updateUserStatus(userObj.email, false, function (err) {
                    if (err) {
                        logger.logError('subscription - newPaidUser - error setting aio user inactive: ' + userObj.email);
                        logger.logError(err);
                    }
                    callback(null, userObj, accountObj);
                });
            },
            // create user in freeside
            function (userObj, accountObj, callback) {
                var password = userObj.createdAt.getTime();
                billing.newCustomer(userObj.firstName, userObj.lastName, user.address, user.city, user.state, user.zipCode, 'US', userObj.email, password, userObj.telephone, 'CARD', user.cardNumber, user.expiryDate, user.cvv, user.cardName, userObj.preferences.defaultLanguage + '_US', function (err, customerNumber, sessionId) {
                    if (err) {
                        logger.logError('subscription - newPaidUser - error creating user in freeside: ' + userObj.email);
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
                        logger.logError('subscription - newPaidUser - error updating billing system customer number in account: ' + userObj.email);
                        logger.logError(err);
                    }
                });
                callback(null, userObj, accountObj);
            },
            // add paid packages in freeside
            function (userObj, accountObj, callback) {
                async.eachSeries(
                    config.freeSidePaidUserPackageParts,
                    function (item, callback) {
                        billing.orderPackage(freeSideSessionId, item, function (err) {
                            if (err) {
                                if (err === '_decline') {
                                    logger.logError('subscription - newPaidUser - credit card declined: ' + userObj.email);
                                    errorType = 'payment-declined';
                                } else {
                                    logger.logError('subscription - newPaidUser - error ordering package in freeside: ' + userObj.email);
                                    errorType = 'freeside-order-insert';
                                }
                            }
                            callback(err);
                        });
                    },
                    function (err) {
                        callback(err, userObj, accountObj);
                    }
                );
            },
            // send verification email
            function (userObj, accountObj, callback) {
                sendVerificationEmail(userObj, function (err) {
                    if (err) {
                        logger.logError('subscription - newPaidUser - error sending verification email: ' + userObj.email);
                        logger.logError(err);
                    } else {
                        logger.logInfo('subscription - newPaidUser - verification email sent: ' + userObj.email);
                    }
                });
                callback(null, userObj, accountObj);
            },
            // delete user from visitor
            function (userObj, accountObj, callback) {
                deleteVisitor(userObj.email, function (err) {
                    if (err) {
                        logger.logError('subscription - newPaidUser - error deleting visitor: ' + userObj.email);
                        logger.logError(err);
                    }
                });
                callback(null, userObj, accountObj);
            }
        ], function (err, userObj, accountObj) {
            if (err) {
                logger.logError(err);
                switch (errorType) {
                    case 'payment-declined':
                        revertAccountPaymentDetails(userObj.email, accountObj);
                        updateAioPackages(userObj.email, config.aioFreeUserPackages);
                        updateFreeSideBilling(freeSideSessionId, 'Free', 'West Palm Beach', 'FL', '00000', 'US', 'BILL', '', '', '', '');
                        sendVerificationEmail(userObj);
                        sendCreditCardPaymentFailureEmail(userObj);
                        deleteVisitor(userObj.email);
                        err = new Error('PaymentFailed');
                        break;
                    case 'freeside-order-insert':
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

    newComplimentaryUser: function (user, cb) {
        ComplimentaryCode.findOne({code: user.code}, function (err, cc) {
            var error,
                now = date.utcDateTime(new Date());
            if (err) {
                logger.logError('subscription - newComplimentaryUser - error fetching complimentary code: ' + user.code);
                logger.logError(err);
                error = err;
            } else if (!cc) {
                error = 'CodeNotFound';
            } else if (cc.disabled) {
                error = 'CodeDisabled';
            } else if (cc.maximumAccounts <= cc.accountCount) {
                error = 'CodeMaxedOut';
            } else if (cc.startDate > now || cc.endDate < now) {
                error = 'CodeTimedOut';
            }
            if (error && cb) {
                cb(error);
            } else {
                createComplimentaryUser(user, cc, cb);
            }
        });

        var errorType, aioAccountId, freeSideCustomerNumber, freeSideSessionId;
        function createComplimentaryUser(user, cc, cb) {
            async.waterfall([
                // create user in db
                function (callback) {
                    createUser(user, cc, function (err, userObj) {
                        if (err) {
                            logger.logError('subscription - newComplimentaryUser - error creating user: ' + user.email);
                        }
                        callback(err, userObj);
                    });
                },
                // create account in db
                function (userObj, callback) {
                    createAccount(user, userObj, 'comp', function (err, accountObj) {
                        if (err) {
                            logger.logError('subscription - newComplimentaryUser - error creating account: ' + user.email);
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
                            logger.logError('subscription - newComplimentaryUser - error updating user with account details: ' + user.email);
                            errorType = 'db-user-update';
                        }
                        callback(err, userObj, accountObj);
                    });
                },
                // create user in aio
                function (userObj, accountObj, callback) {
                    aio.createUser(userObj.email, userObj._id, userObj.firstName + ' ' + userObj.lastName, userObj.password, userObj.email, config.aioUserPin, config.aioComplimentaryUserPackages, function (err, data) {
                        if (err) {
                            logger.logError('subscription - newComplimentaryUser - error creating user in aio: ' + userObj.email);
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
                            logger.logError('subscription - newComplimentaryUser - error updating aio account id in account: ' + userObj.email);
                            logger.logError(err);
                        }
                    });
                    callback(null, userObj, accountObj);
                },
                // set aio user inactive
                function (userObj, accountObj, callback) {
                    aio.updateUserStatus(userObj.email, false, function (err) {
                        if (err) {
                            logger.logError('subscription - newComplimentaryUser - error setting aio user inactive: ' + userObj.email);
                            logger.logError(err);
                        }
                        callback(null, userObj, accountObj);
                    });
                },
                // create user in freeside
                function (userObj, accountObj, callback) {
                    var password = userObj.createdAt.getTime();
                    billing.newCustomer(userObj.firstName, userObj.lastName, 'Complimentary', 'West Palm Beach', 'FL', '00000', 'US', userObj.email, password, userObj.telephone, 'BILL', '', '', '', '', userObj.preferences.defaultLanguage + '_US', function (err, customerNumber, sessionId) {
                        if (err) {
                            logger.logError('subscription - newComplimentaryUser - error creating user in freeside: ' + userObj.email);
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
                            logger.logError('subscription - newComplimentaryUser - error updating billing system customer number in account: ' + userObj.email);
                            logger.logError(err);
                        }
                    });
                    callback(null, userObj, accountObj);
                },
                // add complimentary package in freeside
                function (userObj, accountObj, callback) {
                    async.eachSeries(
                        config.freeSideComplimentaryUserPackageParts,
                        function (item, callback) {
                            billing.orderPackage(freeSideSessionId, item, function (err) {
                                if (err) {
                                    logger.logError('subscription - newComplimentaryUser - error ordering packages in freeside: ' + userObj.email);
                                    errorType = 'freeside-order-insert';
                                }
                                callback(err);
                            });
                        },
                        function (err) {
                            callback(err, userObj, accountObj);
                        }
                    );
                },
                // send verification email
                function (userObj, accountObj, callback) {
                    sendVerificationEmail(userObj, function (err) {
                        if (err) {
                            logger.logError('subscription - newComplimentaryUser - error sending verification email: ' + userObj.email);
                            logger.logError(err);
                        } else {
                            logger.logInfo('subscription - newComplimentaryUser - verification email sent: ' + userObj.email);
                        }
                    });
                    callback(null, userObj, accountObj);
                },
                // delete user from visitor
                function (userObj, accountObj, callback) {
                    deleteVisitor(userObj.email, function (err) {
                        if (err) {
                            logger.logError('subscription - newComplimentaryUser - error deleting visitor: ' + userObj.email);
                            logger.logError(err);
                        }
                    });
                    callback(null, userObj, accountObj);
                },
                // increment complimentary code account count by one
                function (userObj, accountObj, callback) {
                    cc.accountCount++;
                    cc.save(function (err) {
                        if (err) {
                            logger.logError('subscription - newComplimentaryUser - error incrementing complimentary code account count: ' + userObj.email);
                            logger.logError(err);
                        }
                    });
                    callback(null, userObj, accountObj);
                }
            ], function (err, userObj, accountObj) {
                if (err) {
                    logger.logError(err);
                    switch (errorType) {
                        case 'freeside-order-insert':
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
        }
    },

    upgradeSubscription: function (userEmail, newUser, cb) {
        var currentValues, currentUser, errorType;
        async.waterfall([
            // update user and account
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - upgradeSubscription - error fetching user: ' + userEmail);
                        callback(err);
                    } else {
                        if (!userObj) {
                            logger.logError('subscription - upgradeSubscription - user not found: ' + userEmail);
                            callback('UserNotFound');
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
                                firstCardPaymentDate: userObj.account.firstCardPaymentDate,
                                status: userObj.status,
                                cancelDate: userObj.cancelDate,
                                upgradeDate: userObj.upgradeDate,
                                validTill: userObj.validTill
                            };
                            userObj.account.type = 'paid';
                            userObj.account.complimentaryCode = undefined;
                            userObj.account.billingDate = (new Date()).toUTCString();
                            userObj.status = currentValues.status === 'registered' ? 'registered' : 'active';
                            userObj.upgradeDate = (new Date()).toUTCString();
                            userObj.cancelDate = undefined;
                            userObj.validTill = undefined;
                            if (!userObj.account.firstCardPaymentDate) {
                                userObj.account.firstCardPaymentDate = (new Date()).toUTCString();
                            }
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
                                    logger.logError('subscription - upgradeSubscription - error saving user: ' + userEmail);
                                    callback(err, userObj);
                                } else {
                                    userObj.account.save(function (err) {
                                        if (err) {
                                            logger.logError('subscription - upgradeSubscription - error saving account: ' + userEmail);
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
                        logger.logError('subscription - upgradeSubscription - error setting status to active in aio: ' + userObj.email);
                        errorType = 'aio-status-update';
                    }
                    callback(err, userObj);
                });
            },
            // change packages in aio to paid ones
            function (userObj, callback) {
                aio.updateUserPackages(userObj.email, config.aioPaidUserPackages, function (err) {
                    if (err) {
                        logger.logError('subscription - upgradeSubscription - error updating user packages to paid in aio: ' + userObj.email);
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
                            logger.logError('subscription - upgradeSubscription - error updating password in aio: ' + userObj.email);
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
                        logger.logError('subscription - upgradeSubscription - error logging into billing system: ' + userObj.email);
                        errorType = 'freeside-login';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // update user information in freeside
            function (userObj, sessionId, callback) {
                billing.updateCustomer(sessionId, userObj.firstName, userObj.lastName, newUser.address, newUser.city, newUser.state, newUser.zipCode, 'US', userObj.email, userObj.telephone, 'CARD', newUser.cardNumber, newUser.expiryDate, newUser.cvv, newUser.cardName, function (err) {
                    if (err) {
                        logger.logError('subscription - upgradeSubscription - error updating user in billing system: ' + userObj.email);
                        errorType = 'freeside-user-update';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // cancel existing package
            function (userObj, sessionId, callback) {
                billing.cancelPackageByType(sessionId, currentValues.type, function (err) {
                    if (err) {
                        logger.logError('subscription - upgradeSubscription - error removing active package: ' + userObj.email);
                        errorType = 'freeside-cancel-package';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // order paid package
            function (userObj, sessionId, callback) {
                billing.hasPaidActivePackage(sessionId, function (err, result) {
                    if (err) {
                        logger.logError('subscription - upgradeSubscription - error getting current packages: ' + userObj.email);
                        callback(err, userObj);
                    } else if (!result) {
                        billing.orderPackage(sessionId, config.freeSidePaidPackagePart, function (err) {
                            if (err) {
                                if (err === '_decline') {
                                    logger.logError('subscription - upgradeSubscription - credit card declined: ' + userObj.email);
                                    errorType = 'payment-declined';
                                } else {
                                    logger.logError('subscription - upgradeSubscription - error ordering package in freeside: ' + userObj.email);
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
                            logger.logError('subscription - upgradeSubscription - error sending verification email: ' + userObj.email);
                            logger.logError(err);
                        } else {
                            logger.logInfo('subscription - upgradeSubscription - verification email sent: ' + userObj.email);
                        }
                    });
                } else {
                    sendUpgradeEmail(userObj, function (err) {
                        if (err) {
                            logger.logError('subscription - upgradeSubscription - error sending upgrade email: ' + userObj.email);
                            logger.logError(err);
                        } else {
                            logger.logInfo('subscription - upgradeSubscription - upgrade email sent: ' + userObj.email);
                        }
                    });
                }
                callback(null, userObj);
            },
            // delete user from visitor
            function (userObj, callback) {
                deleteVisitor(userObj.email, function (err) {
                    if (err) {
                        logger.logError('subscription - upgradeSubscription - error deleting visitor: ' + userObj.email);
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
                    case 'freeside-order-package':
                        revertUserPackagesInAio(userObj.email, currentValues.type);
                        setUserInactiveInAio(userObj.email, currentValues.status);
                        revertAccountChangesForUpgrade(userObj, currentValues);
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        break;
                    case 'payment-declined':
                        updateAccountOnPaymentDeclined(userObj, currentValues);
                        if (userObj.status === 'registered') {
                            sendVerificationEmail(userObj);
                        } else {
                            sendUpgradeEmail(userObj);
                        }
                        sendCreditCardPaymentFailureEmail(userObj);
                        deleteVisitor(userObj.email);
                        var errorCode = userObj.status === 'registered' ? 'PaymentFailed' : 'PaymentFailedActive';
                        err = new Error(errorCode);
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
                        logger.logError('subscription - reactivateSubscription - error fetching user: ' + userEmail);
                        callback(err);
                    } else {
                        if (!userObj) {
                            logger.logError('subscription - reactivateSubscription - user not found: ' + userEmail);
                            callback('UserNotFound');
                        } else if ((userObj.status === 'active' || userObj.status === 'registered') && userObj.account.type === 'paid') {
                            callback('PaidActiveUser');
                        } else if (userObj.account.type === 'free' || userObj.account.type === 'comp') {
                            callback('NonPaidUser');
                        } else if (userObj.status === 'failed') {
                            callback('FailedUser');
                        } else {
                            currentValues = {
                                billingDate: userObj.account.billingDate,
                                firstCardPaymentDate: userObj.account.firstCardPaymentDate,
                                status: userObj.status,
                                cancelDate: userObj.cancelDate
                            };
                            userObj.account.billingDate = (new Date()).toUTCString();
                            userObj.status = 'active';
                            userObj.cancelDate = undefined;
                            if (!userObj.account.firstCardPaymentDate) {
                                userObj.account.firstCardPaymentDate = (new Date()).toUTCString();
                            }
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
                                    logger.logError('subscription - reactivateSubscription - error saving user: ' + userEmail);
                                    callback(err, userObj);
                                } else {
                                    userObj.account.save(function (err) {
                                        if (err) {
                                            logger.logError('subscription - reactivateSubscription - error saving account: ' + userEmail);
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
                        logger.logError('subscription - reactivateSubscription - error setting status to active in aio: ' + userObj.email);
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
                            logger.logError('subscription - reactivateSubscription - error updating password in aio: ' + userObj.email);
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
                        logger.logError('subscription - reactivateSubscription - error logging into billing system: ' + userObj.email);
                        errorType = 'freeside-login';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // update user information in freeside
            function (userObj, sessionId, callback) {
                var address = newUser.address ? newUser.address : userObj.account.merchant;
                var city = newUser.city ? newUser.city : 'West Palm Beach';
                var state = newUser.state ? newUser.state : 'FL';
                var zip = newUser.zipCode ? newUser.zipCode : '00000';
                var country = 'US';
                var payBy = newUser.cardNumber ? 'CARD' : 'BILL';
                var payInfo = newUser.cardNumber ? newUser.cardNumber : '';
                var payDate = newUser.expiryDate ? newUser.expiryDate : '';
                var payCvv = newUser.cvv ? newUser.cvv : '';
                var payName = newUser.cardName ? newUser.cardName : '';
                billing.updateCustomer(sessionId, userObj.firstName, userObj.lastName, address, city, state, zip, country, userObj.email, userObj.telephone, payBy, payInfo, payDate, payCvv, payName, function (err) {
                    if (err) {
                        logger.logError('subscription - reactivateSubscription - error updating user in billing system: ' + userObj.email);
                        errorType = 'freeside-user-update';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // cancel existing package
            function (userObj, sessionId, callback) {
                billing.cancelPackageByType(sessionId, 'paid', function (err) {
                    if (err) {
                        logger.logError('subscription - reactivateSubscription - error removing active package: ' + userObj.email);
                        errorType = 'freeside-cancel-package';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // order paid package
            function (userObj, sessionId, callback) {
                billing.hasPaidActivePackage(sessionId, function (err, result) {
                    if (err) {
                        logger.logError('subscription - reactivateSubscription - error getting current packages: ' + userObj.email);
                        callback(err, userObj);
                    } else if (!result) {
                        billing.orderPackage(sessionId, config.freeSidePaidPackagePart, function (err) {
                            if (err) {
                                if (err === '_decline') {
                                    logger.logError('subscription - reactivateSubscription - credit card declined: ' + userObj.email);
                                    errorType = 'payment-declined';
                                } else {
                                    logger.logError('subscription - reactivateSubscription - error ordering package in freeside: ' + userObj.email);
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
                        logger.logError('subscription - reactivateSubscription - error sending reactivated email: ' + userObj.email);
                        logger.logError(err);
                    } else {
                        logger.logInfo('subscription - reactivateSubscription - reactivated email sent: ' + userObj.email);
                    }
                });
                callback(null, userObj);
            },
            // delete user from visitor
            function (userObj, callback) {
                deleteVisitor(userObj.email, function (err) {
                    if (err) {
                        logger.logError('subscription - reactivateSubscription - error deleting visitor: ' + userObj.email);
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
                    case 'freeside-order-package':
                        setUserInactiveInAio(userObj.email, currentValues.status);
                        revertAccountChangesForReactivate(userObj, currentValues);
                        revertUserChangesForReactivate(userObj, currentValues, currentUser);
                        break;
                    case 'payment-declined':
                        updateAccountOnPaymentDeclined(userObj, currentValues);
                        sendReactivateEmail(userObj);
                        sendCreditCardPaymentFailureEmail(userObj);
                        deleteVisitor(userObj.email);
                        err = new Error('PaymentFailedActive');
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

    convertToComplimentary: function (userEmail, newUser, cb) {
        ComplimentaryCode.findOne({code: newUser.code}, function (err, cc) {
            var error,
                now = date.utcDateTime(new Date());
            if (err) {
                logger.logError('subscription - convertToComplimentary - error fetching complimentary code: ' + newUser.code);
                logger.logError(err);
                error = err;
            } else if (!cc) {
                error = 'CodeNotFound';
            } else if (cc.disabled) {
                error = 'CodeDisabled';
            } else if (cc.maximumAccounts <= cc.accountCount) {
                error = 'CodeMaxedOut';
            } else if (cc.startDate > now || cc.endDate < now) {
                error = 'CodeTimedOut';
            }
            if (error && cb) {
                cb(error);
            } else {
                changeToComplimentary(userEmail, newUser, cc, cb);
            }
        });

        function changeToComplimentary(userEmail, newUser, cc, cb) {
            var currentValues, currentUser, errorType;
            async.waterfall([
                    // set account type to comp
                    function (callback) {
                        User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                            if (err) {
                                logger.logError('subscription - convertToComplimentary - error fetching user: ' + userEmail);
                                callback(err);
                            } else {
                                if (userObj.status === 'failed') {
                                    callback('FailedUser');
                                } else if (userObj.account.type === 'paid' && (userObj.status === 'active' || userObj.status === 'registered')) {
                                    callback('ActivePaidUser');
                                } else if (userObj.account.type === 'comp' && (userObj.status === 'active' || userObj.status === 'registered')) {
                                    callback('ActiveCompUser');
                                } else if (userObj.account.complimentaryCode === newUser.code) {
                                    callback('ReuseCompCode');
                                } else {
                                    currentValues = {
                                        status: userObj.status,
                                        cancelDate: userObj.cancelDate,
                                        upgradeDate: userObj.upgradeDate,
                                        validTill: userObj.validTill,
                                        type: userObj.account.type,
                                        billingDate: userObj.account.billingDate,
                                        complimentaryCode: userObj.account.complimentaryCode
                                    };
                                    userObj.status = currentValues.status === 'registered' ? 'registered' : 'active';
                                    userObj.upgradeDate = (new Date()).toUTCString();
                                    userObj.validTill = moment(userObj.upgradeDate).add(cc.duration, 'days').utc();
                                    userObj.cancelDate = undefined;
                                    userObj.account.type = 'comp';
                                    userObj.account.complimentaryCode = newUser.code;
                                    userObj.account.billingDate = undefined;
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
                                            logger.logError('subscription - convertToComplimentary - error saving user: ' + userEmail);
                                            callback(err);
                                        } else {
                                            userObj.account.save(function (err) {
                                                if (err) {
                                                    logger.logError('subscription - convertToComplimentary - error saving account: ' + userEmail);
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
                        if (_.contains(['trial-ended', 'comp-ended', 'canceled'], currentValues.status)) {
                            aio.updateUserStatus(userObj.email, true, function (err) {
                                if (err) {
                                    logger.logError('subscription - convertToComplimentary - error setting status to active in aio: ' + userObj.email);
                                    errorType = 'aio-status-update';
                                }
                                callback(null, userObj);
                            });
                        } else {
                            callback(null, userObj);
                        }
                    },
                    // change packages in aio to paid ones
                    function (userObj, callback) {
                        aio.updateUserPackages(userObj.email, config.aioPaidUserPackages, function (err) {
                            if (err) {
                                logger.logError('subscription - convertToComplimentary - error updating user packages to paid in aio: ' + userObj.email);
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
                                    logger.logError('subscription - convertToComplimentary - error updating password in aio: ' + userObj.email);
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
                                logger.logError('subscription - reactivateSubscription - error logging into billing system: ' + userObj.email);
                                errorType = 'freeside-login';
                            }
                            callback(err, userObj, sessionId);
                        });
                    },
                    // update user in freeside
                    function (userObj, sessionId, callback) {
                        billing.updateCustomer(sessionId, userObj.firstName, userObj.lastName, 'Complimentary', 'West Palm Beach', 'FL', '00000', 'US', userObj.email, userObj.telephone, 'BILL', '', '', '', '', function (err) {
                            if (err) {
                                logger.logError('subscription - convertToComplimentary - error updating user in billing system: ' + userObj.email);
                                errorType = 'freeside-user-update';
                            }
                            callback(err, userObj, sessionId);
                        });
                    },
                    // cancel existing package
                    function (userObj, sessionId, callback) {
                        billing.cancelPackageByType(sessionId, currentValues.type, function (err) {
                            if (err) {
                                logger.logError('subscription - convertToComplimentary - error removing active package: ' + userObj.email);
                                errorType = 'freeside-cancel-package';
                            }
                            callback(err, userObj, sessionId);
                        });
                    },
                    // order paid package
                    function (userObj, sessionId, callback) {
                        billing.orderPackage(sessionId, config.freeSideComplimentaryPackagePart, function (err) {
                            if (err) {
                                logger.logError('subscription - convertToComplimentary - error ordering package in freeside: ' + userObj.email);
                                errorType = 'freeside-order-insert';
                            }
                            callback(err, userObj);
                        });
                    },
                    // send verification email if registered
                    function (userObj, callback) {
                        if (userObj.status === 'registered') {
                            sendVerificationEmail(userObj, function (err) {
                                if (err) {
                                    logger.logError('subscription - convertToComplimentary - error sending verification email: ' + userObj.email);
                                    logger.logError(err);
                                } else {
                                    logger.logInfo('subscription - convertToComplimentary - verification email sent: ' + userObj.email);
                                }
                            });
                        } else {
                            sendConvertToComplimentaryEmail(userObj, function (err) {
                                if (err) {
                                    logger.logError('subscription - convertToComplimentary - error sending converted to complimentary email: ' + userObj.email);
                                    logger.logError(err);
                                } else {
                                    logger.logInfo('subscription - convertToComplimentary - converted to complimentary email sent: ' + userObj.email);
                                }
                            });
                        }
                        callback(null, userObj);
                    },
                    // delete user from visitor
                    function (userObj, callback) {
                        deleteVisitor(userObj.email, function (err) {
                            if (err) {
                                logger.logError('subscription - convertToComplimentary - error deleting visitor: ' + userObj.email);
                                logger.logError(err);
                            }
                        });
                        callback(null, userObj);
                    },
                    // increment complimentary code account count by one
                    function (userObj, callback) {
                        cc.accountCount++;
                        cc.save(function (err) {
                            if (err) {
                                logger.logError('subscription - convertToComplimentary - error incrementing complimentary code account count: ' + userObj.email);
                                logger.logError(err);
                            }
                        });
                        callback(null, userObj);
                    }
                ],
                function (err, userObj) {
                    if (err) {
                        logger.logError(err);
                        switch (errorType) {
                            case 'db-account-update':
                                revertUserChangesForComplimentary(userObj, currentValues, currentUser);
                                break;
                            case 'aio-status-update':
                                revertAccountChangesForComplimentary(userObj, currentValues);
                                revertUserChangesForComplimentary(userObj, currentValues, currentUser);
                                break;
                            case 'aio-package-update':
                                setUserInactiveInAio(userObj.email, currentValues.status);
                                revertAccountChangesForComplimentary(userObj, currentValues);
                                revertUserChangesForComplimentary(userObj, currentValues, currentUser);
                                break;
                            case 'aio-password-update':
                                revertUserPackagesInAio(userObj.email, currentValues.type);
                                setUserInactiveInAio(userObj.email, currentValues.status);
                                revertAccountChangesForComplimentary(userObj, currentValues);
                                revertUserChangesForComplimentary(userObj, currentValues, currentUser);
                                break;
                            case 'freeside-user-update':
                            case 'freeside-login':
                            case 'freeside-cancel-package':
                            case 'freeside-order-package':
                                revertUserPackagesInAio(userObj.email, currentValues.type);
                                setUserInactiveInAio(userObj.email, currentValues.status);
                                revertAccountChangesForComplimentary(userObj, currentValues);
                                revertUserChangesForComplimentary(userObj, currentValues, currentUser);
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
                }
            );
        }
    },

    cancelSubscription: function (userEmail, cb) {
        var errorType;
        async.waterfall([
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error fetching user: ' + userEmail);
                        callback(err);
                    } else if (!userObj) {
                        logger.logError('subscription - cancelSubscription - user not found: ' + userEmail);
                        callback('UserNotFound');
                    } else if (userObj.status === 'canceled' || userObj.status === 'failed') {
                        callback('NonActiveUser');
                    } else if (userObj.account.type === 'free' || userObj.account.type === 'comp') {
                        callback('NonPaidUser');
                    } else {
                        callback(null, userObj);
                    }
                });
            },
            // login to freeside
            function (userObj, callback) {
                billing.login(userObj.email, userObj.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error logging into billing system: ' + userObj.email);
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // get billing date
            function (userObj, sessionId, callback) {
                billing.getBillingDate(sessionId, function (err, billingDate) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error logging into billing system: ' + userObj.email);
                    }
                    callback(err, userObj, sessionId, billingDate);
                });
            },
            // update user
            function (userObj, sessionId, billingDate, callback) {
                if (billingDate) {
                    userObj.cancelOn = moment(billingDate).subtract(1, 'days').toDate().toUTCString();
                } else {
                    userObj.cancelOn = (new Date()).toUTCString();
                }
                userObj.save(function (err) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error updating user: ' + userObj.email);
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // modify billing address
            function (userObj, sessionId, callback) {
                var address = 'To be canceled on ' + moment(userObj.cancelOn).format('MM/DD/YYYY');
                billing.updateBilling(sessionId, address, 'West Palm Beach', 'FL', '00000', 'US', 'BILL', '', '', '', '', function (err) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error setting canceled address in billing system: ' + userObj.email);
                        errorType = 'freeside-user-update';
                    }
                    callback(err, userObj);
                });
            },
            // send email
            function (userObj, callback) {
                sendCancellationEmail(userObj, function (err) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error sending cancellation email: ' + userObj.email);
                    }
                });
                callback(null, userObj);
            }
        ], function (err, userObj) {
            if (err) {
                logger.logError(err);
                switch (errorType) {
                    case 'freeside-user-update':
                        userObj.cancelOn = undefined;
                        userObj.save(function (err) {
                            if (err) {
                                logger.logError('subscription - cancelSubscription - error removing cancelOn date: ' + userObj.email);
                                logger.logError(err);
                            }
                        });
                        break;
                }
            }
            if (cb) {
                cb(err);
            }
        });
    },

    endFreeTrial: function (userEmail, cb) {
        var errorType, currentValues;
        async.waterfall([
            // set user status to 'trial-ended'
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - endFreeTrial - error fetching user: ' + userEmail);
                        callback(err);
                    } else {
                        currentValues = {
                            status: userObj.status,
                            cancelDate: userObj.cancelDate
                        };
                        userObj.status = 'trial-ended';
                        userObj.cancelDate = (new Date()).toUTCString();
                        userObj.save(function (err) {
                            if (err) {
                                logger.logError('subscription - endFreeTrial - error updating user: ' + userObj.email);
                            }
                            callback(err, userObj);
                        });
                    }
                });
            },
            // change status to inactive in aio
            function (userObj, callback) {
                aio.updateUserStatus(userObj.email, false, function (err) {
                    if (err) {
                        logger.logError('subscription - endFreeTrial - error updating aio customer status to inactive: ' + userObj.email);
                        errorType = 'aio-status-update';
                    }
                    callback(err, userObj);
                });
            },
            // login to freeside
            function (userObj, callback) {
                billing.login(userObj.email, userObj.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('subscription - endFreeTrial - error logging into billing system: ' + userObj.email);
                        errorType = 'freeside-login';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // change billing address
            function (userObj, sessionId, callback) {
                var address = 'Trial ended on ' + moment(userObj.cancelDate).format('MM/DD/YYYY');
                billing.updateAddress(sessionId, address, 'West Palm Beach', 'FL', '00000', 'US', function (err) {
                    if (err) {
                        logger.logError('subscription - endFreeTrial - error updating billing system with trial address: ' + userObj.email);
                        errorType = 'freeside-user-update';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // cancel existing package
            function (userObj, sessionId, callback) {
                billing.cancelPackageByType(sessionId, 'free', function (err) {
                    if (err) {
                        logger.logError('subscription - endFreeTrial - error removing active package: ' + userObj.email);
                        errorType = 'freeside-cancel-package';
                    }
                    callback(err, userObj);
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
                    } else {
                        logger.logInfo('subscription - endFreeTrial - suspension email sent to ' + mailOptions.to);
                    }
                    callback(null, userObj);
                });
            }
        ], function (err, userObj) {
            if (err) {
                logger.logError(err);
                switch (errorType) {
                    case 'aio-status-update':
                        revertUserChangesForCancel(userObj, currentValues);
                        break;
                    case 'freeside-user-update':
                    case 'freeside-login':
                    case 'freeside-cancel-package':
                        setUserActiveInAio(userObj.email, currentValues.status);
                        revertUserChangesForCancel(userObj, currentValues);
                        break;
                }
            }
            if (cb) {
                cb(err);
            }
        });
    },

    endComplimentarySubscription: function (userEmail, cb) {
        var errorType, currentValues;
        async.waterfall([
            // set user status to 'comp-ended'
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - endComplimentarySubscription - error fetching user: ' + userEmail);
                        callback(err);
                    } else {
                        currentValues = {
                            status: userObj.status,
                            cancelDate: userObj.cancelDate
                        };
                        userObj.status = 'comp-ended';
                        userObj.cancelDate = (new Date()).toUTCString();
                        userObj.save(function (err) {
                            if (err) {
                                logger.logError('subscription - endComplimentarySubscription - error saving user to comp-ended status: ' + userObj.email);
                            }
                            callback(err, userObj);
                        });
                    }
                });
            },
            // change status to inactive in aio
            function (userObj, callback) {
                aio.updateUserStatus(userObj.email, false, function (err) {
                    if (err) {
                        logger.logError('subscription - endComplimentarySubscription - error setting aio customer to inactive: ' + userObj.email);
                        errorType = 'aio-status-update';
                    }
                    callback(err, userObj);
                });
            },
            // login to freeside
            function (userObj, callback) {
                billing.login(userObj.email, userObj.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('subscription - endFreeTrial - error logging into billing system: ' + userObj.email);
                        errorType = 'freeside-login';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // change billing address
            function (userObj, sessionId, callback) {
                var address = 'Complimentary subscription ended on ' + moment(userObj.cancelDate).format('MM/DD/YYYY');
                billing.updateAddress(sessionId, address, 'West Palm Beach', 'FL', '00000', 'US', function (err) {
                    if (err) {
                        logger.logError('subscription - endComplimentarySubscription - error updating billing system with complimentary address: ' + userObj.email);
                        errorType = 'freeside-user-update';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // cancel existing package
            function (userObj, sessionId, callback) {
                billing.cancelPackageByType(sessionId, 'comp', function (err) {
                    if (err) {
                        logger.logError('subscription - endComplimentarySubscription - error removing active package: ' + userObj.email);
                        errorType = 'freeside-cancel-package';
                    }
                    callback(err, userObj);
                });
            },
            // send email
            function (userObj, callback) {
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: userObj.email,
                    subject: config.complimentaryAccountEndedEmailSubject[userObj.preferences.defaultLanguage],
                    html: sf(config.complimentaryAccountEndedEmailBody[userObj.preferences.defaultLanguage], config.imageUrl, userObj.firstName, userObj.lastName, config.url + 'upgrade-subscription')
                };
                email.sendEmail(mailOptions, function (err) {
                    if (err) {
                        logger.logError('subscription - endComplimentarySubscription - error sending complimentary account ended email to ' + mailOptions.to);
                        logger.logError(err);
                    } else {
                        logger.logInfo('subscription - endComplimentarySubscription - complimentary account ended email sent to ' + mailOptions.to);
                    }
                    callback(null, userObj);
                });
            }
        ], function (err, userObj) {
            if (err) {
                logger.logError(err);
                switch (errorType) {
                    case 'aio-status-update':
                        revertUserChangesForCancel(userObj, currentValues);
                        break;
                    case 'freeside-user-update':
                    case 'freeside-login':
                    case 'freeside-cancel-package':
                        setUserActiveInAio(userObj.email, currentValues.status);
                        revertUserChangesForCancel(userObj, currentValues);
                        break;
                }
            }
            if (cb) {
                cb(err);
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
                        };
                        userObj.account.billingDate = undefined;
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
            // modify billing address
            function (userObj, sessionId, callback) {
                var address = 'Canceled by user on ' + moment(userObj.cancelDate).format('MM/DD/YYYY');
                billing.updateBilling(sessionId, address, 'West Palm Beach', 'FL', '00000', 'US', 'BILL', '', '', '', '', function (err) {
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

    sendCreditCardPaymentFailureEmail: sendCreditCardPaymentFailureEmail,

    sendAccountVerifiedEmail: sendAccountVerifiedEmail
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
        primaryUser: userObj,
        users: [userObj],
        createdAt: now,
        startDate: now
    });
    if (type === 'free') {
        accountObj.premiumEndDate = moment(accountObj.startDate).add(7, 'days');
    }
    if (type === 'paid') {
        accountObj.firstCardPaymentDate = now;
        accountObj.billingDate = now;
    }
    if (type === 'comp') {
        accountObj.complimentaryCode = user.code;
    } else {
        accountObj.referredBy = user.referredBy;
    }
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
                    logger.logError('subscription - deleteVisitor - error removing visitor: ' + email);
                    logger.logError(err);
                }
            });
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertAccountPaymentDetails(email, account, cb) {
    account.type = 'free';
    account.premiumEndDate = moment(account.startDate).add(7, 'days');
    account.firstCardPaymentDate = undefined;
    account.billingDate = undefined;
    account.save(function (err) {
        if (err) {
            logger.logError('subscription - revertAccountPaymentDetails - error reverting payment details from account: ' + email);
            logger.logError(err);
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
            logger.logError('subscription - revertUserChangesForUpgrade - error reverting user changes: ' + email);
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
            logger.logError('subscription - revertUserChangesForReactivate - error reverting user changes: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertUserChangesForComplimentary(user, currentValues, currentUser, cb) {
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
            logger.logError('subscription - revertUserChangesForComplimentary - error reverting user changes: ' + email);
            logger.logError(err);
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
            logger.logError('subscription - revertUserChangesForCancel - error reverting user changes: ' + email);
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
    user.account.firstCardPaymentDate = currentValues.firstCardPaymentDate;
    user.account.save(function (err) {
        if (err) {
            logger.logError('subscription - revertAccountChangesForUpgrade - error reverting account changes: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertAccountChangesForReactivate(user, currentValues, cb) {
    user.account.billingDate = currentValues.billingDate;
    user.account.firstCardPaymentDate = currentValues.firstCardPaymentDate;
    user.account.save(function (err) {
        if (err) {
            logger.logError('subscription - revertAccountChangesForReactivate - error reverting account changes: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertAccountChangesForComplimentary(user, currentValues, cb) {
    user.account.billingDate = currentValues.billingDate;
    user.account.type = currentValues.type;
    user.account.complimentaryCode = currentValues.complimentaryCode;
    user.account.save(function (err) {
        if (err) {
            logger.logError('subscription - revertAccountChangesForComplimentary - error reverting account changes: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertAccountChangesForCancel(user, currentValues, cb) {
    user.account.billingDate = currentValues.billingDate;
    user.account.save(function (err) {
        if (err) {
            logger.logError('subscription - revertAccountChangesForCancel - error reverting account changes: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertUserPackagesInAio(email, type, cb) {
    var packages = type === 'free' ? config.aioFreeUserPackages : config.aioPaidUserPackages;
    aio.updateUserPackages(email, packages, function (err) {
        if (err) {
            logger.logError('subscription - revertPackagesInAio - error setting back package in aio: ' + email);
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
                logger.logError('subscription - setUserInactiveInAio - error setting user status to inactive in aio: ' + email);
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

function setUserActiveInAio(email, status, cb) {
    if (status === 'active' || status === 'registered') {
        aio.updateUserStatus(email, true, function (err) {
            if (err) {
                logger.logError('subscription - setUserActiveInAio - error setting user status to active in aio: ' + email);
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

function updateAccountOnPaymentDeclined(user, currentValues, cb) {
    user.account.billingDate = currentValues.billingDate;
    user.account.firstCardPaymentDate = currentValues.firstCardPaymentDate;
    user.account.save(function (err) {
        if (err) {
            logger.logError('subscription - updateAccountPaymentDeclined - error updating account on payment declined: ' + user.email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
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
            logger.logError('subscription - sendReactivateEmail - error sending email: ' + user.email);
            logger.logError(err);
        } else {
            logger.logInfo('subscription - sendReactivateEmail - email sent successfully: ' + user.email);
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
            logger.logError('subscription - sendUpgradeEmail - error sending email: ' + user.email);
            logger.logError(err);
        } else {
            logger.logInfo('subscription - sendUpgradeEmail - email sent successfully: ' + user.email);
        }
        if (cb) {
            cb(err);
        }
    });
}

function sendConvertToComplimentaryEmail(user, cb) {
    var signInUrl = config.url + 'sign-in?email=' + encodeURIComponent(user.email);
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.convertToComplimentaryEmailSubject[user.preferences.defaultLanguage],
        html: sf(config.convertToComplimentaryEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, signInUrl)
    };
    email.sendEmail(mailOptions, function (err) {
        if (err) {
            logger.logError('subscription - sendUpgradeEmail - error sending email: ' + user.email);
            logger.logError(err);
        } else {
            logger.logInfo('subscription - sendUpgradeEmail - email sent successfully: ' + user.email);
        }
        if (cb) {
            cb(err);
        }
    });
}

function sendCreditCardPaymentFailureEmail(user, cb) {
    var signInUrl = config.url + 'sign-in?email=' + encodeURIComponent(user.email);
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.creditCardPaymentFailureEmailSubject[user.preferences.defaultLanguage],
        html: sf(config.creditCardPaymentFailureEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, signInUrl)
    };
    email.sendEmail(mailOptions, function (err) {
        if (err) {
            logger.logError('subscription - sendCreditCardPaymentFailureEmail - error sending email: ' + user.email);
            logger.logError(err);
        } else {
            logger.logInfo('subscription - sendCreditCardPaymentFailureEmail - email sent successfully: ' + user.email);
        }
        if (cb) {
            cb(err);
        }
    });
}

function sendAccountVerifiedEmail(user, cb) {
    var signInUrl = config.url + 'sign-in?email=' + encodeURIComponent(user.email);
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.accountVerifiedEmailSubject[user.preferences.defaultLanguage],
        html: sf(config.accountVerifiedEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, signInUrl)
    };
    email.sendEmail(mailOptions, function (err) {
        if (err) {
            logger.logError('subscription - sendAccountVerifiedEmail - error sending email: ' + user.email);
            logger.logError(err);
        } else {
            logger.logInfo('subscription - sendAccountVerifiedEmail - email sent successfully: ' + user.email);
        }
        if (cb) {
            cb(err);
        }
    });
}

function sendCancellationEmail(user, cb) {
    var cancelOn = moment(user.cancelOn).utc().format('M/D/YYYY');
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.cancelSubscriptionEmailSubject[user.preferences.defaultLanguage],
        html: sf(config.cancelSubscriptionEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, cancelOn)
    };
    email.sendEmail(mailOptions, function (err) {
        if (err) {
            logger.logError('subscription - sendCancellationEmail - error sending email: ' + user.email);
            logger.logError(err);
        } else {
            logger.logInfo('subscription - sendCancellationEmail - email sent successfully: ' + user.email);
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
            logger.logError('subscription - sendPaidSubscriptionEndedEmail - error sending email: ' + user.email);
            logger.logError(err);
        } else {
            logger.logInfo('subscription - sendPaidSubscriptionEndedEmail - email sent successfully: ' + user.email);
        }
        if (cb) {
            cb(err);
        }
    });
}

function updateAioPackages(email, packages, cb) {
    aio.updateUserPackages(email, packages, function (err) {
        if (err) {
            logger.logError('subscription - updateAioPackages - error updating aio packages:' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function updateFreeSideBilling(sessionId, address, city, state, zip, county, payBy, payInfo, payDate, payCvv, payName, cb) {
    billing.updateBilling(sessionId, address, city, state, zip, county, payBy, payInfo, payDate, payCvv, payName, function (err) {
        if (err) {
            logger.logError('subscription - updateFreeSideBilling - error updating freeside billing:' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}
