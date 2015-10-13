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
    date = require('./date'),
    dbYip = mongoose.createConnection(config.db),
    User = dbYip.model('User'),
    Account = dbYip.model('Account'),
    Visitor = dbYip.model('Visitor'),
    ComplimentaryCode = dbYip.model('ComplimentaryCode'),
    userRoles = require('../../../client/web-app/scripts/config/routing').userRoles,
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
                aio.createUser(userObj.email, userObj._id, userObj.firstName + ' ' + userObj.lastName, userObj.password, userObj.email, config.aioUserPin, config.aioFreePremiumUserPackages, function (err, data) {
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
                    config.freeSideFreePremiumUserPackageParts,
                    function (item, callback) {
                        billing.orderPackage(freeSideSessionId, item, function (err) {
                            if (err) {
                                logger.logError('subscription - newFreeUser - error ordering packages in freeside: ' + userObj.email);
                                errorType = 'freeside-package-insert';
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
                    case 'freeside-package-insert':
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
                                    errorType = 'freeside-package-insert';
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
                        updateAioPackages(userObj.email, config.aioFreePremiumUserPackages);
                        updateFreeSideBilling(freeSideSessionId, 'Free', 'West Palm Beach', 'FL', '00000', 'US', 'BILL', '', '', '', '');
                        sendVerificationEmail(userObj);
                        sendCreditCardPaymentFailureEmail(userObj);
                        deleteVisitor(userObj.email);
                        err = new Error('PaymentFailed');
                        break;
                    case 'freeside-package-insert':
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
                                    errorType = 'freeside-package-insert';
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
                        case 'freeside-package-insert':
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
                        } else if (userObj.account.type === 'comp') {
                            callback('ComplimentaryUser');
                        } else {
                            currentValues = {
                                type: userObj.account.type,
                                billingDate: userObj.account.billingDate,
                                firstCardPaymentDate: userObj.account.firstCardPaymentDate,
                                premiumEndDate: userObj.account.premiumEndDate,
                                packages: userObj.account.packages,
                                merchant: userObj.account.merchant,
                                cancelDate: userObj.cancelDate,
                                upgradeDate: userObj.upgradeDate,
                                complimentaryEndDate: userObj.complimentaryEndDate
                            };
                            userObj.account.type = 'paid';
                            userObj.account.billingDate = (new Date()).toUTCString();
                            userObj.account.premiumEndDate = undefined;
                            userObj.account.packages = config.paidUserPackages;
                            userObj.upgradeDate = (new Date()).toUTCString();
                            userObj.cancelDate = undefined;
                            userObj.complimentaryEndDate = undefined;
                            if (!userObj.account.firstCardPaymentDate && newUser.address) {
                                userObj.account.firstCardPaymentDate = (new Date()).toUTCString();
                            }
                            if (newUser.merchant && newUser.merchant !== 'YIPTV') {
                                userObj.account.merchant = newUser.merchant.toUpperCase();
                            }
                            if (newUser.firstName) {
                                currentUser = {
                                    firstName: userObj.firstName,
                                    lastName: userObj.lastName,
                                    telephone: userObj.telephone,
                                    hashedPassword: userObj.hashedPassword,
                                    salt: userObj.salt,
                                    preferences: {defaultLanguage: userObj.preferences.defaultLanguage, emailSubscription: userObj.preferences.emailSubscription, smsSubscription: userObj.preferences.smsSubscription}
                                };
                                userObj.firstName = newUser.firstName;
                                userObj.lastName = newUser.lastName;
                                userObj.telephone = newUser.telephone;
                                userObj.password = newUser.password;
                                userObj.preferences = newUser.preferences;
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
                var locale = userObj.preferences.defaultLanguage + '_US';
                billing.updateCustomer(sessionId, userObj.firstName, userObj.lastName, newUser.address ? newUser.address : userObj.account.merchant, newUser.city ? newUser.city : 'West Palm Beach', newUser.state ? newUser.state : 'FL', newUser.zipCode ? newUser.zipCode : '00000', 'US', userObj.email, userObj.telephone, locale, newUser.address ? 'CARD' : 'BILL', newUser.cardNumber ? newUser.cardNumber : '', newUser.expiryDate ? newUser.expiryDate : '', newUser.cvv ? newUser.cvv : '', newUser.cardName ? newUser.cardName : '', function (err) {
                    if (err) {
                        logger.logError('subscription - upgradeSubscription - error updating user in billing system: ' + userObj.email);
                        errorType = 'freeside-user-update';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // order paid package
            function (userObj, sessionId, callback) {
                var packages = currentValues.premiumEndDate ? [config.freeSidePaidBasicPackagePart] : [config.freeSidePremiumPackagePart, config.freeSidePaidBasicPackagePart];
                async.eachSeries(
                    packages,
                    function (item, callback) {
                        billing.orderPackage(sessionId, item, function (err) {
                            if (err) {
                                if (err === '_decline') {
                                    logger.logError('subscription - upgradeSubscription - credit card declined: ' + userObj.email);
                                    errorType = 'payment-declined';
                                } else {
                                    logger.logError('subscription - upgradeSubscription - error ordering package in freeside: ' + userObj.email);
                                    errorType = 'freeside-package-insert';
                                }
                            }
                            callback(err);
                        });
                    },
                    function (err) {
                        callback(err, userObj, sessionId);
                    }
                );
            },
            // send verification email if registered
            function (userObj, sessionId, callback) {
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
                callback(null, userObj, sessionId);
            },
            // delete user from visitor
            function (userObj, sessionId, callback) {
                deleteVisitor(userObj.email, function (err) {
                    if (err) {
                        logger.logError('subscription - upgradeSubscription - error deleting visitor: ' + userObj.email);
                        logger.logError(err);
                    }
                });
                callback(null, userObj, sessionId);
            }
        ], function (err, userObj, sessionId) {
            if (err) {
                logger.logError(err);
                switch (errorType) {
                    case 'db-account-update':
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        break;
                    case 'aio-package-update':
                        revertAccountChangesForUpgrade(userObj, currentValues);
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        break;
                    case 'aio-password-update':
                        revertAccountChangesForUpgrade(userObj, currentValues);
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        if (userObj.account.premiumEndDate) {
                            updateAioPackages(userObj.email, config.aioFreePremiumUserPackages);
                        } else {
                            updateAioPackages(userObj.email, config.aioFreeUserPackages);
                        }
                        break;
                    case 'freeside-user-update':
                    case 'freeside-login':
                    case 'freeside-package-insert':
                        revertAccountChangesForUpgrade(userObj, currentValues);
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        if (userObj.account.premiumEndDate) {
                            updateAioPackages(userObj.email, config.aioFreePremiumUserPackages);
                        } else {
                            updateAioPackages(userObj.email, config.aioFreeUserPackages);
                        }
                        break;
                    case 'payment-declined':
                        revertAccountChangesForUpgrade(userObj, currentValues);
                        revertUserChangesForUpgradeFailure(userObj, currentValues);
                        if (userObj.account.premiumEndDate) {
                            updateAioPackages(userObj.email, config.aioFreePremiumUserPackages);
                        } else {
                            updateAioPackages(userObj.email, config.aioFreeUserPackages);
                            billing.cancelPackages(sessionId, [config.freeSidePremiumPackagePart], function (err) {
                                if (err) {
                                    logger.logError('subscription - upgradeSubscription - error canceling premium package: ' + userObj.email);
                                    logger.logError(err);
                                }
                            });
                        }
                        updateFreeSideBilling(sessionId, 'Free', 'West Palm Beach', 'FL', '00000', 'US', 'BILL', '', '', '', '');
                        if (userObj.status === 'registered') {
                            sendVerificationEmail(userObj);
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
                                } else if (userObj.account.type === 'paid') {
                                    callback('ActivePaidUser');
                                } else if (userObj.account.type === 'comp') {
                                    callback('ComplimentaryUser');
                                } else {
                                    currentValues = {
                                        cancelDate: userObj.cancelDate,
                                        complimentaryEndDate: userObj.complimentaryEndDate,
                                        upgradeDate: userObj.upgradeDate,
                                        validTill: userObj.validTill,
                                        type: userObj.account.type,
                                        complimentaryCode: userObj.account.complimentaryCode,
                                        premiumEndDate: userObj.account.premiumEndDate,
                                        packages: userObj.account.packages
                                    };
                                    userObj.upgradeDate = (new Date()).toUTCString();
                                    userObj.validTill = moment(userObj.upgradeDate).add(cc.duration, 'days').utc();
                                    userObj.cancelDate = undefined;
                                    userObj.complimentaryEndDate = undefined;
                                    userObj.account.type = 'comp';
                                    userObj.account.complimentaryCode = newUser.code;
                                    userObj.account.premiumEndDate = undefined;
                                    userObj.account.packages = config.complimentaryUserPackages;
                                    if (newUser.firstName) {
                                        currentUser = {
                                            firstName: userObj.firstName,
                                            lastName: userObj.lastName,
                                            telephone: userObj.telephone,
                                            hashedPassword: userObj.hashedPassword,
                                            salt: userObj.salt,
                                            preferences: {defaultLanguage: userObj.preferences.defaultLanguage, emailSubscription: userObj.preferences.emailSubscription, smsSubscription: userObj.preferences.smsSubscription}
                                        };
                                        userObj.firstName = newUser.firstName;
                                        userObj.lastName = newUser.lastName;
                                        userObj.telephone = newUser.telephone;
                                        userObj.password = newUser.password;
                                        userObj.preferences = newUser.preferences;
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
                    // change packages in aio to paid ones
                    function (userObj, callback) {
                        aio.updateUserPackages(userObj.email, config.aioComplimentaryUserPackages, function (err) {
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
                                logger.logError('subscription - convertToComplimentary - error logging into billing system: ' + userObj.email);
                                errorType = 'freeside-login';
                            }
                            callback(err, userObj, sessionId);
                        });
                    },
                    // update user in freeside
                    function (userObj, sessionId, callback) {
                        var locale = userObj.preferences.defaultLanguage + '_US';
                        billing.updateCustomer(sessionId, userObj.firstName, userObj.lastName, 'Complimentary', 'West Palm Beach', 'FL', '00000', 'US', userObj.email, userObj.telephone, locale, 'BILL', '', '', '', '', function (err) {
                            if (err) {
                                logger.logError('subscription - convertToComplimentary - error updating user in billing system: ' + userObj.email);
                                errorType = 'freeside-user-update';
                            }
                            callback(err, userObj, sessionId);
                        });
                    },
                    // cancel existing package
                    function (userObj, sessionId, callback) {
                        billing.cancelPackages(sessionId, config.freeSideFreePremiumUserPackageParts, function (err) {
                            if (err) {
                                logger.logError('subscription - convertToComplimentary - error removing active package: ' + userObj.email);
                                errorType = 'freeside-package-remove';
                            }
                            callback(err, userObj, sessionId);
                        });
                    },
                    // order paid package
                    function (userObj, sessionId, callback) {
                        billing.orderPackage(sessionId, config.freeSideComplimentaryPackagePart, function (err) {
                            if (err) {
                                logger.logError('subscription - convertToComplimentary - error ordering package in freeside: ' + userObj.email);
                                errorType = 'freeside-package-insert';
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
                            case 'aio-package-update':
                                revertAccountChangesForComplimentary(userObj, currentValues);
                                revertUserChangesForComplimentary(userObj, currentValues, currentUser);
                                break;
                            case 'aio-password-update':
                                revertAccountChangesForComplimentary(userObj, currentValues);
                                revertUserChangesForComplimentary(userObj, currentValues, currentUser);
                                if (userObj.account.premiumEndDate) {
                                    updateAioPackages(userObj.email, config.aioFreePremiumUserPackages);
                                } else {
                                    updateAioPackages(userObj.email, config.aioFreeUserPackages);
                                }
                                break;
                            case 'freeside-user-update':
                            case 'freeside-login':
                            case 'freeside-package-remove':
                            case 'freeside-package-insert':
                                revertAccountChangesForComplimentary(userObj, currentValues);
                                revertUserChangesForComplimentary(userObj, currentValues, currentUser);
                                if (userObj.account.premiumEndDate) {
                                    updateAioPackages(userObj.email, config.aioFreePremiumUserPackages);
                                } else {
                                    updateAioPackages(userObj.email, config.aioFreeUserPackages);
                                }
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
                    } else if (userObj.status === 'failed') {
                        callback('FailedUser');
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

    removePremiumPackage: function (userEmail, cb) {
        var errorType, currentValues;
        async.waterfall([
            // remove premiumEndDate
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - removePremiumPackage - error fetching user: ' + userEmail);
                        callback(err);
                    } else {
                        currentValues = {
                            premiumEndDate: userObj.account.premiumEndDate,
                            packages: userObj.account.packages
                        };
                        userObj.account.premiumEndDate = undefined;
                        userObj.account.packages = config.freeUserPackages;
                        userObj.account.save(function (err) {
                            if (err) {
                                logger.logError('subscription - removePremiumPackage - error updating account: ' + userObj.email);
                            }
                            callback(err, userObj);
                        });
                    }
                });
            },
            // update to free packages in aio
            function (userObj, callback) {
                aio.updateUserPackages(userObj.email, config.aioFreeUserPackages, function (err) {
                    if (err) {
                        logger.logError('subscription - removePremiumPackage - error updating to free packages: ' + userObj.email);
                        errorType = 'aio-package-update';
                    }
                    callback(err, userObj);
                });
            },
            // login to freeside
            function (userObj, callback) {
                billing.login(userObj.email, userObj.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('subscription - removePremiumPackage - error logging into billing system: ' + userObj.email);
                        errorType = 'freeside-login';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // cancel premium package
            function (userObj, sessionId, callback) {
                billing.cancelPackages(sessionId, [config.freeSidePremiumPackagePart], function (err) {
                    if (err) {
                        logger.logError('subscription - removePremiumPackage - error removing premium package: ' + userObj.email);
                        errorType = 'freeside-package-remove';
                    }
                    callback(err, userObj);
                });
            }
        ], function (err, userObj) {
            if (err) {
                logger.logError(err);
                switch (errorType) {
                    case 'aio-package-update':
                        revertAccountChangesForRemovePremiumPackage(userObj, currentValues);
                        break;
                    case 'freeside-login':
                    case 'freeside-package-remove':
                        updateAioPackages(userObj.email, config.aioFreePremiumUserPackages);
                        revertAccountChangesForRemovePremiumPackage(userObj, currentValues);
                        break;
                }
            }
            if (cb) {
                cb(err);
            }
        });
    },

    removePaidBasicPackage: function (userEmail, cb) {
        async.waterfall([
            // remove premiumEndDate
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - removePaidBasicPackage - error fetching user: ' + userEmail);
                        callback(err);
                    }
                    callback(err, userObj);
                });
            },
            // login to freeside
            function (userObj, callback) {
                billing.login(userObj.email, userObj.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('subscription - removePaidBasicPackage - error logging into billing system: ' + userObj.email);
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // cancel paid basic package
            function (userObj, sessionId, callback) {
                billing.cancelPackages(sessionId, [config.freeSidePaidBasicPackagePart], function (err) {
                    if (err) {
                        logger.logError('subscription - removePaidBasicPackage - error removing paid basic package: ' + userObj.email);
                    }
                    callback(err);
                });
            }
        ], function (err) {
            if (cb) {
                cb(err);
            }
        });
    },

    endComplimentarySubscription: function (userEmail, cb) {
        var errorType, currentValues;
        async.waterfall([
            // set user status to 'active' and 'free'
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - endComplimentarySubscription - error fetching user: ' + userEmail);
                        callback(err);
                    } else {
                        currentValues = {
                            complimentaryEndDate: userObj.complimentaryEndDate,
                            validTill: userObj.validTill,
                            complimentaryCode: userObj.account.complimentaryCode,
                            type: userObj.account.type,
                            packages: userObj.account.packages
                        };
                        userObj.complimentaryEndDate = (new Date()).toUTCString();
                        userObj.validTill = undefined;
                        userObj.account.complimentaryCode = undefined;
                        userObj.account.type = 'free';
                        userObj.account.packages = config.freeUserPackages;
                        userObj.save(function (err) {
                            if (err) {
                                logger.logError('subscription - endComplimentarySubscription - error updating user: ' + userObj.email);
                                callback(err);
                            } else {
                                userObj.account.save(function (err) {
                                    if (err) {
                                        logger.logError('subscription - endComplimentarySubscription - error updating account: ' + userObj.email);
                                        errorType = 'db-account-update';
                                    }
                                    callback(err, userObj);
                                });
                            }
                        });
                    }
                });
            },
            // update to free packages in aio
            function (userObj, callback) {
                aio.updateUserPackages(userObj.email, config.aioFreeUserPackages, function (err) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error updating to free packages: ' + userObj.email);
                        errorType = 'aio-package-update';
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
                billing.updateAddress(sessionId, 'Free', 'West Palm Beach', 'FL', '00000', 'US', function (err) {
                    if (err) {
                        logger.logError('subscription - endComplimentarySubscription - error updating billing system with complimentary address: ' + userObj.email);
                        errorType = 'freeside-user-update';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // cancel existing packages
            function (userObj, sessionId, callback) {
                billing.cancelPackages(sessionId, config.freeSideComplimentaryUserPackageParts, function (err) {
                    if (err) {
                        logger.logError('subscription - endComplimentarySubscription - error removing active package: ' + userObj.email);
                        errorType = 'freeside-package-remove';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // add free packages in freeside
            function (userObj, sessionId, callback) {
                billing.orderPackage(sessionId, config.freeSideFreePackagePart, function (err) {
                    if (err) {
                        logger.logError('subscription - endComplimentarySubscription - error ordering packages in freeside: ' + userObj.email);
                        errorType = 'freeside-add-package';
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
                    case 'db-account-update':
                        revertUserChangesForComplimentaryEnded(userObj, currentValues);
                        break;
                    case 'aio-package-update':
                        revertAccountChangesForComplimentaryEnded(userObj, currentValues);
                        revertUserChangesForComplimentaryEnded(userObj, currentValues);
                        break;
                    case 'freeside-user-update':
                    case 'freeside-login':
                    case 'freeside-package-remove':
                    case 'freeside-add-package':
                        updateAioPackages(userObj.email, config.aioComplimentaryUserPackages);
                        revertAccountChangesForComplimentaryEnded(userObj, currentValues);
                        revertUserChangesForComplimentaryEnded(userObj, currentValues);
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
            // set user status to 'active' and type to 'free' and set canceledDate to current date
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error fetching user: ' + userEmail);
                        callback(err);
                    } else if (userObj.status === 'failed') {
                        callback('FailedUser');
                    } else if (userObj.account.type === 'free') {
                        callback('FreeUser');
                    } else {
                        currentValues = {
                            cancelDate: userObj.cancelDate,
                            cancelOn: userObj.cancelOn,
                            type: userObj.account.type,
                            billingDate: userObj.account.billingDate,
                            packages: userObj.account.packages
                        };
                        userObj.account.billingDate = undefined;
                        userObj.account.type = 'free';
                        userObj.account.packages = config.freeUserPackages;
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
            // update to free packages in aio
            function (userObj, callback) {
                aio.updateUserPackages(userObj.email, config.aioFreeUserPackages, function (err) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error updating to free packages: ' + userObj.email);
                        errorType = 'aio-package-update';
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
                billing.updateBilling(sessionId, 'Free', 'West Palm Beach', 'FL', '00000', 'US', 'BILL', '', '', '', '', function (err) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error setting canceled address in billing system: ' + userObj.email);
                        errorType = 'freeside-user-update';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // cancel paid basic and premium package
            function (userObj, sessionId, callback) {
                billing.cancelPackages(sessionId, [config.freeSidePremiumPackagePart, config.freeSidePaidBasicPackagePart], function (err) {
                    if (err) {
                        logger.logError('subscription - cancelSubscription - error removing active package: ' + userObj.email);
                        errorType = 'freeside-package-remove';
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
                    case 'aio-package-update':
                        revertAccountChangesForCancel(userObj, currentValues);
                        revertUserChangesForCancel(userObj, currentValues);
                        break;
                    case 'freeside-user-update':
                    case 'freeside-login':
                    case 'freeside-package-remove':
                        updateAioPackages(userObj.email, config.aioPaidUserPackages);
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

    dunning5Days: function (userEmail, cb) {
        var errorType, currentValues;
        async.waterfall([
            // get user
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - dunning5Days - error fetching user: ' + userEmail);
                        callback(err);
                    }
                    currentValues = {packages: userObj.account.packages};
                    userObj.account.packages = config.paidUserDunningPackages;
                    userObj.account.save(function (err) {
                        if (err) {
                            logger.logError('subscription - dunning5Days - error updating account: ' + userEmail);
                        }
                        callback(err, userObj);
                    });
                });
            },
            // update to free packages in aio
            function (userObj, callback) {
                aio.updateUserPackages(userObj.email, config.aioDunning5DayPackages, function (err) {
                    if (err) {
                        logger.logError('subscription - dunning5Days - error updating to free packages: ' + userObj.email);
                        errorType = 'aio-package-update';
                    }
                    callback(err, userObj);
                });
            },
            // login to freeside
            function (userObj, callback) {
                billing.login(userObj.email, userObj.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('subscription - dunning5Days - error logging into billing system: ' + userObj.email);
                        errorType = 'freeside-login';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // cancel premium package
            function (userObj, sessionId, callback) {
                billing.cancelPackages(sessionId, [config.freeSidePremiumPackagePart], function (err) {
                    if (err) {
                        logger.logError('subscription - dunning5Days - error removing premium package: ' + userObj.email);
                        errorType = 'freeside-package-remove';
                    }
                    callback(err, userObj);
                });
            }
        ], function (err, userObj) {
            if (err) {
                logger.logError(err);
                switch (errorType) {
                    case 'aio-package-update':
                        revertAccountChangesForDunning5Days(userObj, currentValues);
                        break;
                    case 'freeside-login':
                    case 'freeside-package-remove':
                        updateAioPackages(userObj.email, config.aioPaidUserPackages);
                        revertAccountChangesForDunning5Days(userObj, currentValues);
                        break;
                }
            }
            if (cb) {
                cb(err);
            }
        });
    },

    reverseDunning5Days: function (userEmail, cb) {
        var errorType, currentValues;
        async.waterfall([
            // get user
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - reverseDunning5Days - error fetching user: ' + userEmail);
                        callback(err);
                    }
                    currentValues = {packages: userObj.account.packages};
                    userObj.account.packages = config.paidUserPackages;
                    userObj.account.save(function (err) {
                        if (err) {
                            logger.logError('subscription - reverseDunning5Days - error updating account: ' + userEmail);
                        }
                        callback(err, userObj);
                    });
                });
            },
            // update to free packages in aio
            function (userObj, callback) {
                aio.updateUserPackages(userObj.email, config.aioPaidUserPackages, function (err) {
                    if (err) {
                        logger.logError('subscription - reverseDunning5Days - error updating to paid packages: ' + userObj.email);
                        errorType = 'aio-package-update';
                    }
                    callback(err, userObj);
                });
            },
            // login to freeside
            function (userObj, callback) {
                billing.login(userObj.email, userObj.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('subscription - reverseDunning5Days - error logging into billing system: ' + userObj.email);
                        errorType = 'freeside-login';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // add premium package
            function (userObj, sessionId, callback) {
                billing.checkAndOrderPackage(sessionId, config.freeSidePremiumPackagePart, function (err) {
                    if (err) {
                        logger.logError('subscription - reverseDunning5Days - error adding premium package: ' + userObj.email);
                        errorType = 'freeside-package-remove';
                    }
                    callback(err, userObj);
                });
            }
        ], function (err, userObj) {
            if (err) {
                logger.logError(err);
                switch (errorType) {
                    case 'aio-package-update':
                        revertAccountChangesForReverseDunning5Days(userObj, currentValues);
                        break;
                    case 'freeside-login':
                    case 'freeside-package-remove':
                        updateAioPackages(userObj.email, config.aioDunning5DayPackages);
                        revertAccountChangesForReverseDunning5Days(userObj, currentValues);
                        break;
                }
            }
            if (cb) {
                cb(err);
            }
        });
    },

    dunning10Days: function (userEmail, cb) {
        var currentValues, errorType;
        async.waterfall([
            // set user status to 'active' and type to 'free' and set canceledDate to current date
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - dunning10Days - error fetching user: ' + userEmail);
                        callback(err);
                    } else if (userObj.status === 'failed') {
                        callback('FailedUser');
                    } else if (userObj.account.type === 'free') {
                        callback('FreeUser');
                    } else {
                        currentValues = {
                            cancelDate: userObj.cancelDate,
                            cancelOn: userObj.cancelOn,
                            type: userObj.account.type,
                            billingDate: userObj.account.billingDate,
                            packages: userObj.account.packages
                        };
                        userObj.account.billingDate = undefined;
                        userObj.account.type = 'free';
                        userObj.account.packages = config.freeUserPackages;
                        userObj.cancelDate = (new Date()).toUTCString();
                        userObj.cancelOn = undefined;
                        userObj.save(function (err) {
                            if (err) {
                                logger.logError('subscription - dunning10Days - error saving user with canceled status: ' + userObj.email);
                                callback(err);
                            } else {
                                userObj.account.save(function (err) {
                                    if (err) {
                                        logger.logError('subscription - dunning10Days - error updating account: ' + userObj.email);
                                        errorType = 'db-account-update';
                                    }
                                    callback(err, userObj);
                                });
                            }
                        });
                    }
                });
            },
            // update to free packages in aio
            function (userObj, callback) {
                aio.updateUserPackages(userObj.email, config.aioFreeUserPackages, function (err) {
                    if (err) {
                        logger.logError('subscription - dunning10Days - error updating to free packages: ' + userObj.email);
                        errorType = 'aio-package-update';
                    }
                    callback(err, userObj);
                });
            },
            // login to freeside
            function (userObj, callback) {
                billing.login(userObj.email, userObj.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('subscription - dunning10Days - error logging into billing system: ' + userObj.email);
                        errorType = 'freeside-login';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // modify billing address
            function (userObj, sessionId, callback) {
                billing.updateBilling(sessionId, 'Free', 'West Palm Beach', 'FL', '00000', 'US', 'BILL', '', '', '', '', function (err) {
                    if (err) {
                        logger.logError('subscription - dunning10Days - error setting canceled address in billing system: ' + userObj.email);
                        errorType = 'freeside-user-update';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // cancel paid basic and premium package
            function (userObj, sessionId, callback) {
                billing.cancelPackages(sessionId, [config.freeSidePremiumPackagePart, config.freeSidePaidBasicPackagePart], function (err) {
                    if (err) {
                        logger.logError('subscription - dunning10Days - error removing active package: ' + userObj.email);
                        errorType = 'freeside-package-remove';
                    }
                    callback(err, userObj);
                });
            }
        ], function (err, userObj) {
            if (err) {
                logger.logError(err);
                switch (errorType) {
                    case 'db-account-update':
                        revertUserChangesForCancel(userObj, currentValues);
                        break;
                    case 'aio-package-update':
                        revertAccountChangesForCancel(userObj, currentValues);
                        revertUserChangesForCancel(userObj, currentValues);
                        break;
                    case 'freeside-user-update':
                    case 'freeside-login':
                    case 'freeside-package-remove':
                        updateAioPackages(userObj.email, config.aioPaidUserPackages);
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

    processCashPayment: function (userEmail, cb) {
        var currentValues, errorType;
        async.waterfall([
            // get user and update
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - processCashPayment - error fetching user: ' + userEmail);
                        callback(err);
                    } else if (userObj.cancelOn) {
                        currentValues = {cancelOn: userObj.cancelOn};
                        userObj.cancelOn = undefined;
                        userObj.save(function (err) {
                            if (err) {
                                logger.logError('subscription - processCashPayment - error saving user: ' + userEmail);
                            }
                            callback(err, userObj);
                        });
                    } else {
                        callback(null, userObj);
                    }
                });
            },
            // login
            function (userObj, callback) {
                billing.login(userObj.email, userObj.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('subscription - processCashPayment - error logging into freeside: ' + userEmail);
                        errorType = 'freeside-login';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // update billing details
            function (userObj, sessionId, callback) {
                var locale = userObj.preferences.defaultLanguage + '_US';
                billing.updateCustomer(sessionId, userObj.firstName, userObj.lastName, userObj.account.merchant, 'West Palm Beach', 'FL', '00000', 'US', userObj.email, userObj.telephone, locale, 'BILL', '', '', '', '', function (err) {
                    if (err) {
                        logger.logError('merchant - processCashPayment - error updating user in billing system: ' + userObj.email);
                        errorType = 'freeside-user-update';
                    }
                    callback(err, userObj, sessionId);
                });
            }
        ], function (err, userObj) {
            if (err) {
                logger.logError(err);
                switch (errorType) {
                    case 'freeside-user-update':
                    case 'freeside-login':
                        if (currentValues) {
                            userObj.cancelOn = currentValues.cancelOn;
                            userObj.save(function () {
                                logger.logError('subscription - processCashPayment - error reverting cancelOn in user: ' + userObj.email);
                            });
                        }
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
            merchant: user.merchant ? user.merchant.toUpperCase() : 'YIPTV',
            primaryUser: userObj,
            users: [userObj],
            createdAt: now,
            startDate: now,
            referredBy: user.referredBy
        }
    );
    if (type === 'free') {
        accountObj.premiumEndDate = moment(accountObj.startDate).add(7, 'days');
        accountObj.packages = config.freePremiumUserPackages;
    }
    if (type === 'paid') {
        accountObj.firstCardPaymentDate = now;
        accountObj.billingDate = now;
        accountObj.packages = config.paidUserPackages;
    }
    if (type === 'comp') {
        accountObj.complimentaryCode = user.code;
        accountObj.packages = config.complimentaryUserPackages;
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

function revertAccountPaymentDetails(email, account, cb) {
    account.type = 'free';
    account.premiumEndDate = moment(account.startDate).add(7, 'days');
    account.firstCardPaymentDate = undefined;
    account.billingDate = undefined;
    account.packages = config.freePremiumUserPackages;
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

function revertUserChangesForUpgradeFailure(user, currentValues, cb) {
    user.cancelDate = currentValues.cancelDate;
    user.upgradeDate = currentValues.upgradeDate;
    user.complimentaryEndDate = currentValues.complimentaryEndDate;
    user.save(function (err) {
        if (err) {
            logger.logError('subscription - revertUserChangesForUpgradeFailure - error reverting user changes: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertUserChangesForUpgrade(user, currentValues, currentUser, cb) {
    user.cancelDate = currentValues.cancelDate;
    user.upgradeDate = currentValues.upgradeDate;
    user.complimentaryEndDate = currentValues.complimentaryEndDate;
    if (currentUser) {
        user.firstName = currentUser.firstName;
        user.lastName = currentUser.lastName;
        user.telephone = currentUser.telephone;
        user.hashedPassword = currentUser.hashedPassword;
        user.salt = currentUser.salt;
        user.preferences = currentUser.preferences;
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

function revertAccountChangesForUpgrade(user, currentValues, cb) {
    user.account.type = currentValues.type;
    user.account.premiumEndDate = currentValues.premiumEndDate;
    user.account.billingDate = currentValues.billingDate;
    user.account.firstCardPaymentDate = currentValues.firstCardPaymentDate;
    user.account.merchant = currentValues.merchant;
    user.account.packages = currentValues.packages;
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

function revertUserChangesForComplimentary(user, currentValues, currentUser, cb) {
    user.cancelDate = currentValues.cancelDate;
    user.complimentaryEndDate = currentValues.complimentaryEndDate;
    user.upgradeDate = currentValues.upgradeDate;
    user.validTill = currentValues.validTill;
    if (currentUser) {
        user.firstName = currentUser.firstName;
        user.lastName = currentUser.lastName;
        user.telephone = currentUser.telephone;
        user.hashedPassword = currentUser.hashedPassword;
        user.salt = currentUser.salt;
        user.preferences = currentUser.preferences;
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

function revertAccountChangesForComplimentary(user, currentValues, cb) {
    user.account.type = currentValues.type;
    user.account.complimentaryCode = currentValues.complimentaryCode;
    user.account.premiumEndDate = currentValues.premiumEndDate;
    user.account.packages = currentValues.packages;
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

function revertUserChangesForCancel(user, currentValues, cb) {
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

function revertAccountChangesForCancel(user, currentValues, cb) {
    user.account.billingDate = currentValues.billingDate;
    user.account.type = currentValues.type;
    user.account.packages = currentValues.packages;
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

function revertUserChangesForComplimentaryEnded(user, currentValues, cb) {
    user.complimentaryEndDate = currentValues.complimentaryEndDate;
    user.validTill = currentValues.validTill;
    user.save(function (err) {
        if (err) {
            logger.logError('subscription - revertUserChangesForComplimentaryEnded - error reverting user changes: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertAccountChangesForComplimentaryEnded(user, currentValues, cb) {
    user.account.complimentaryCode = currentValues.complimentaryCode;
    user.account.type = currentValues.type;
    user.account.packages = currentValues.packages;
    user.account.save(function (err) {
        if (err) {
            logger.logError('subscription - revertAccountChangesForComplimentaryEnded - error reverting account changes: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertAccountChangesForRemovePremiumPackage(user, currentValues, cb) {
    user.account.premiumEndDate = currentValues.premiumEndDate;
    user.account.packages = currentValues.packages;
    user.account.save(function (err) {
        if (err) {
            logger.logError('subscription - revertAccountChangesForRemovePremiumPackage - error reverting account changes: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertAccountChangesForDunning5Days(user, currentValues, cb) {
    user.account.packages = currentValues.packages;
    user.account.save(function (err) {
        if (err) {
            logger.logError('subscription - revertAccountChangesForDunning5Days - error reverting account changes: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}

function revertAccountChangesForReverseDunning5Days(user, currentValues, cb) {
    user.account.packages = currentValues.packages;
    user.account.save(function (err) {
        if (err) {
            logger.logError('subscription - revertAccountChangesForReverseDunning5Days - error reverting account changes: ' + email);
            logger.logError(err);
        }
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

function sendVerificationEmail(user, cb) {
    var verificationUrl = config.url + 'verify-user?code=' + user.verificationCode;
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.accountVerificationEmailSubject[user.preferences.defaultLanguage],
        html: sf(config.accountVerificationEmailBody[user.preferences.defaultLanguage], config.imageUrl, config.customerCareNumber, verificationUrl)
    };
    email.sendEmail(mailOptions, function (err) {
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
        html: sf(config.creditCardPaymentFailureEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.customerCareNumber, signInUrl)
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
        html: sf(config.accountVerifiedEmailBody[user.preferences.defaultLanguage], config.imageUrl, signInUrl)
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
        html: sf(config.subscriptionCanceledEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.customerCareNumber, config.url + 'upgrade-subscription')
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
            logger.logError('subscription - updateFreeSideBilling - error updating freeside billing');
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}
