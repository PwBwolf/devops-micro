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
            // create user in aio
            function (userObj, accountObj, callback) {
                aio.createUser(userObj.email, userObj._id, userObj.firstName + ' ' + userObj.lastName, userObj.password, userObj.email, config.aioUserPin, config.aioFreePackages, function (err, data) {
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
                billing.newCustomer(userObj.firstName, userObj.lastName, 'Trial', 'West Palm Beach', 'FL', '00000', 'US', userObj.email, password, userObj.telephone, 'BILL', '', '', '', '', function (err, customerNumber, sessionId) {
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
            // add free package in freeside
            function (userObj, accountObj, callback) {
                billing.orderPackage(freeSideSessionId, config.freeSideFreePackagePart, function (err) {
                    if (err) {
                        logger.logError('subscription - newFreeUser - error ordering package in freeside: ' + userObj.email);
                        errorType = 'freeside-order-insert';
                    }
                    callback(err, userObj, accountObj);
                });
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
                aio.createUser(userObj.email, userObj._id, userObj.firstName + ' ' + userObj.lastName, userObj.password, userObj.email, config.aioUserPin, config.aioPaidPackages, function (err, data) {
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
                billing.newCustomer(userObj.firstName, userObj.lastName, user.address, user.city, user.state, user.zipCode, 'US', userObj.email, password, userObj.telephone, 'CARD', user.cardNumber, user.expiryDate, user.cvv, user.cardName, function (err, customerNumber, sessionId) {
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
            // add paid package in freeside
            function (userObj, accountObj, callback) {
                billing.orderPackage(freeSideSessionId, config.freeSidePaidPackagePart, function (err) {
                    if (err) {
                        if (err === '_decline') {
                            logger.logError('subscription - newPaidUser - credit card declined: ' + userObj.email);
                            errorType = 'payment-declined';
                        } else {
                            logger.logError('subscription - newPaidUser - error ordering package in freeside: ' + userObj.email);
                            errorType = 'freeside-order-insert';
                        }
                        logger.logError(err);
                    }
                    callback(err, userObj, accountObj);
                });
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
                        sendVerificationEmail(userObj);
                        deleteVisitor(userObj.email);
                        err = new Error('PaymentPending');
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
                    aio.createUser(userObj.email, userObj._id, userObj.firstName + ' ' + userObj.lastName, userObj.password, userObj.email, config.aioUserPin, config.aioPaidPackages, function (err, data) {
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
                // create user in FreeSide
                function (userObj, accountObj, callback) {
                    var payDate = ((new Date(userObj.validTill)).getMonth() + 1) + '/' + (new Date(userObj.validTill)).getFullYear();
                    var password = userObj.createdAt.getTime();
                    billing.newCustomer(userObj.firstName, userObj.lastName, 'Complimentary', 'West Palm Beach', 'FL', '00000', 'US', userObj.email, password, userObj.telephone, 'COMP', '', payDate, '', '', function (err, customerNumber, sessionId) {
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
                    billing.orderPackage(freeSideSessionId, config.freeSideComplimentaryPackagePart, function (err) {
                        if (err) {
                            logger.logError('subscription - newComplimentaryUser - error ordering package in freeside: ' + userObj.email);
                            errorType = 'freeside-order-insert';
                        }
                        callback(err, userObj, accountObj);
                    });
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
            // update user
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - upgradeSubscription - error fetching user: ' + userEmail);
                        callback(err);
                    } else {
                        if (!userObj) {
                            logger.logError('subscription - upgradeSubscription - user not found: ' + userEmail);
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
                                firstCardPaymentDate: userObj.account.firstCardPaymentDate,
                                status: userObj.status,
                                cancelDate: userObj.cancelDate,
                                upgradeDate: userObj.upgradeDate,
                                validTill: userObj.validTill,
                            };
                            userObj.account.type = 'paid';
                            userObj.account.complimentaryCode = undefined;
                            userObj.account.billingDate = (new Date()).toUTCString();
                            userObj.account.paymentPending = false;
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
            // change status to active in AIO if user status is trial-ended or comp-ended
            function (userObj, callback) {
                if (currentValues.status === 'trial-ended' || currentValues.status === 'comp-ended') {
                    aio.updateUserStatus(userObj.email, true, function (err) {
                        if (err) {
                            logger.logError('subscription - upgradeSubscription - error setting status to active in aio: ' + userObj.email);
                            errorType = 'aio-status-update';
                        }
                        callback(err, userObj);
                    });
                } else {
                    callback(null, userObj);
                }
            },
            // change packages in AIO to paid ones
            function (userObj, callback) {
                aio.updateUserPackages(userObj.email, config.aioPaidPackages, function (err) {
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
                        logger.logError('userController - upgradeSubscription - error logging into billing system: ' + userObj.email);
                        errorType = 'freeside-login';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // update user information in FreeSide
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
                        logger.logError('userController - upgradeSubscription - error removing active package: ' + userObj.email);
                        errorType = 'freeside-cancel-package';
                    }
                    callback(err, userObj, sessionId);
                });
            },
            // order paid package
            function (userObj, sessionId, callback) {
                billing.hasPaidActivePackage(sessionId, function (err, result) {
                    if (err) {
                        logger.logError('userController - upgradeSubscription - error getting current packages: ' + userObj.email);
                        callback(err, userObj);
                    } else if (!result) {
                        billing.orderPackage(sessionId, config.freeSidePaidPackagePart, function (err) {
                            if (err) {
                                if (err === '_decline') {
                                    logger.logError('userController - upgradeSubscription - credit card declined: ' + userObj.email);
                                    errorType = 'payment-declined';
                                } else {
                                    logger.logError('userController - upgradeSubscription - error ordering package in freeside: ' + userObj.email);
                                    errorType = 'freeside-order-package';
                                }
                                logger.logError(err);
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
                        revertAccountChangesForUpgrade(userObj, currentValues, currentUser);
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        break;
                    case 'aio-package-update':
                        revertUserStatusInAio(userObj.email, currentValues.status);
                        revertAccountChangesForUpgrade(userObj, currentValues, currentUser);
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        break;
                    case 'aio-password-update':
                        revertUserPackagesInAio(userObj.email, currentValues.type);
                        revertUserStatusInAio(userObj.email, currentValues.status);
                        revertAccountChangesForUpgrade(userObj, currentValues, currentUser);
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        break;
                    case 'freeside-user-update':
                    case 'freeside-login':
                    case 'freeside-cancel-package':
                    case 'freeside-order-package':
                        revertUserPackagesInAio(userObj.email, currentValues.type);
                        revertUserStatusInAio(userObj.email, currentValues.status);
                        revertAccountChangesForUpgrade(userObj, currentValues, currentUser);
                        revertUserChangesForUpgrade(userObj, currentValues, currentUser);
                        break;
                    case 'payment-declined':
                        updateAccountOnPaymentDeclined(userObj, currentValues);
                        if (userObj.status === 'registered') {
                            sendVerificationEmail(userObj);
                        }
                        deleteVisitor(userObj.email);
                        var errorCode = userObj.status === 'registered' ? 'PaymentPending' : 'PaymentPendingActive';
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
        var cancelDate,
            currentUser;
        async.waterfall([
            // set user status to 'active' and remove canceledDate
            function (callback) {
                User.findOne({email: userEmail}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - reactivateSubscription - error fetching user: ' + userEmail);
                        callback(err);
                    } else if ((userObj.status === 'active' || userObj.status === 'registered') && userObj.account.type === 'paid') {
                        callback('PaidActiveUser');
                    } else if (userObj.account.type === 'free' || userObj.account.type === 'comp') {
                        callback('NonPaidUser');
                    } else if (userObj.status === 'failed') {
                        callback('FailedUser');
                    } else {
                        cancelDate = userObj.cancelDate;
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
                                logger.logError('subscription - reactivateSubscription - error saving user to active: ' + userObj.email);
                                callback(err);
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
                        revertUserChanges(cancelDate, userObj);
                        logger.logError('subscription - reactivateSubscription - error updating aio customer to active: ' + userObj.email);
                        callback(err);
                    } else {
                        callback(null, userObj);
                    }
                });
            },
            // if password has changed set new password in aio
            function (userObj, callback) {
                if (newUser.password) {
                    aio.updatePassword(userObj.email, newUser.password, function (err) {
                        if (err) {
                            setUserInactiveInAio(userObj.email);
                            revertUserChanges(cancelDate, userObj);
                            logger.logError('subscription - reactivateSubscription - error updating password in aio: ' + userObj.email);
                        } else {
                            callback(null, userObj);
                        }
                    });
                } else {
                    callback(null, userObj);
                }
            },
            // update user in FreeSide
            function (userObj, callback) {
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
                billing.updateUser(userObj.account.freeSideCustomerNumber, userObj.firstName, userObj.lastName, address, city, state, zip, country, userObj.email, userObj.telephone, payBy, payInfo, payDate, payCvv, payName, function (err) {
                    if (err) {
                        setUserInactiveInAio(userObj.email);
                        revertUserChanges(cancelDate, userObj);
                        logger.logError('subscription - reactivateSubscription - error updating user in billing system: ' + userObj.email);
                        callback(err);
                    } else {
                        callback(null, userObj);
                    }
                });
            }
        ], function (err, userObj) {
            if (err) {
                logger.logError(err);
            }
            if (cb) {
                if (userObj) {
                    cb(err, userObj.status);
                } else {
                    cb(err);
                }
            }
        });

        function revertUserChanges(cancelDate, user, cb) {
            user.cancelDate = cancelDate;
            user.status = 'canceled';
            if (currentUser) {
                user.firstName = currentUser.firstName;
                user.lastName = currentUser.lastName;
                user.telephone = currentUser.telephone;
                user.hashedPassword = currentUser.hashedPassword;
                user.salt = currentUser.salt;
            }
            user.save(function (err) {
                if (err) {
                    logger.logError('subscription - reactivateSubscription.revertUserChanges - error saving user back to old values: ' + user.email);
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

    convertToComplimentary: function (userEmail, newUser, cb) {
        var status,
            type,
            cancelDate,
            currentUser;
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
            async.waterfall([
                // set account type to paid
                function (callback) {
                    User.findOne({email: userEmail}, function (err, user) {
                        if (err) {
                            logger.logError('subscription - convertToComplimentary - error fetching user: ' + userEmail);
                            callback(err);
                        } else {
                            Account.findOne({_id: user.account}, function (err, accountObj) {
                                if (err) {
                                    logger.logError('subscription - convertToComplimentary - error fetching account: ' + userEmail);
                                    callback(err);
                                } else if (user.status === 'failed') {
                                    callback('FailedUser');
                                } else if (accountObj.type === 'paid' && (user.status === 'active' || user.status === 'registered')) {
                                    callback('ActivePaidUser');
                                } else if (accountObj.type === 'comp' && (user.status === 'active' || user.status === 'registered')) {
                                    callback('ActiveCompUser');
                                } else if (accountObj.complimentaryCode === newUser.code) {
                                    callback('ReuseCompCode');
                                } else {
                                    type = accountObj.type;
                                    accountObj.type = 'comp';
                                    accountObj.complimentaryCode = newUser.code;
                                    accountObj.save(function (err) {
                                        if (err) {
                                            logger.logError('subscription - convertToComplimentary - error saving account to paid: ' + userEmail);
                                            callback(err);
                                        } else {
                                            callback(null, accountObj);
                                        }
                                    });
                                }
                            });
                        }
                    });
                },
                // update user in DB
                function (accountObj, callback) {
                    User.findOne({email: userEmail}, function (err, userObj) {
                        if (err) {
                            logger.logError('subscription - convertToComplimentary - error fetching user: ' + userEmail);
                            callback(err);
                        } else {
                            status = userObj.status;
                            cancelDate = userObj.cancelDate;
                            userObj.status = status === 'registered' ? 'registered' : 'active';
                            userObj.upgradeDate = (new Date()).toUTCString();
                            userObj.validTill = moment(userObj.upgradeDate).add(cc.duration, 'days').utc();
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
                                    revertAccountChanges(accountObj);
                                    logger.logError('subscription - convertToComplimentary - error saving user to active: ' + userEmail);
                                    callback(err);
                                } else {
                                    callback(null, accountObj, userObj);
                                }
                            });
                        }
                    });
                },
                // change status to active in AIO if user status is trial-ended or comp-ended
                function (accountObj, userObj, callback) {
                    if (_.contains(['trial-ended', 'comp-ended', 'canceled'], status)) {
                        aio.updateUserStatus(userObj.email, true, function (err) {
                            if (err) {
                                revertUserChanges(userObj, status, cancelDate);
                                revertAccountChanges(accountObj);
                                logger.logError('subscription - convertToComplimentary - error setting status to active in aio: ' + userObj.email);
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
                            revertUserStatusInAio(userObj, status);
                            revertUserChanges(userObj, status);
                            revertAccountChanges(accountObj);
                            logger.logError('subscription - convertToComplimentary - error updating user packages to paid in aio: ' + userObj.email);
                            callback(err);
                        } else {
                            callback(null, accountObj, userObj);
                        }
                    });
                },
                // if password has changed set new password in aio
                function (accountObj, userObj, callback) {
                    if (newUser.password) {
                        aio.updatePassword(userObj.email, newUser.password, function (err) {
                            if (err) {
                                revertPackagesInAio(userObj.email);
                                revertUserStatusInAio(userObj, status);
                                revertUserChanges(userObj, status);
                                revertAccountChanges(accountObj);
                                logger.logError('subscription - convertToComplimentary - error updating password in aio: ' + userObj.email);
                            } else {
                                callback(null, accountObj, userObj);
                            }
                        });
                    } else {
                        callback(null, accountObj, userObj);
                    }
                },
                // update user in FreeSide
                function (accountObj, userObj, callback) {
                    var address = 'Complimentary';
                    var city = 'West Palm Beach';
                    var state = 'FL';
                    var zip = '00000';
                    var country = 'US';
                    var payBy = 'COMP';
                    var payInfo = '';
                    var payDate = ((new Date(userObj.validTill)).getMonth() + 1) + '/' + (new Date(userObj.validTill)).getFullYear();
                    var payCvv = '';
                    var payName = '';
                    billing.updateUser(accountObj.freeSideCustomerNumber, userObj.firstName, userObj.lastName, address, city, state, zip, country, userObj.email, userObj.telephone, payBy, payInfo, payDate, payCvv, payName, function (err) {
                        if (err) {
                            revertPackagesInAio(userObj.email);
                            revertUserStatusInAio(userObj, status);
                            revertUserChanges(userObj, status);
                            revertAccountChanges(accountObj);
                            logger.logError('subscription - convertToComplimentary - error updating user in billing system: ' + userObj.email);
                            callback(err);
                        } else {
                            callback(null, accountObj, userObj);
                        }
                    });
                },
                // send verification email if registered
                function (accountObj, userObj, callback) {
                    if (userObj.status === 'registered') {
                        var verificationUrl = config.url + 'verify-user?code=' + userObj.verificationCode;
                        var mailOptions = {
                            from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                            to: userObj.email,
                            subject: config.accountVerificationEmailSubject[userObj.preferences.defaultLanguage],
                            html: sf(config.accountVerificationEmailBody[userObj.preferences.defaultLanguage], config.imageUrl, userObj.firstName, userObj.lastName, verificationUrl)
                        };
                        email.sendEmail(mailOptions, function (err) {
                            if (err) {
                                logger.logError('subscription - convertToComplimentary - error send verification email to ' + mailOptions.to);
                                logger.logError(err);
                            } else {
                                logger.logInfo('subscription - convertToComplimentary - verification email sent to ' + mailOptions.to);
                            }
                        });
                        callback(null, accountObj, userObj);
                    } else {
                        callback(null, accountObj, userObj);
                    }
                },
                // increment complimentary code account count by one
                function (accountObj, userObj, callback) {
                    cc.accountCount++;
                    cc.save(function (err) {
                        if (err) {
                            logger.logError('subscription - newComplimentaryUser - error incrementing complimentary code account count: ' + userObj.email);
                            logger.logError(err);
                        }
                    });
                    callback(null, accountObj, userObj);
                }
            ], function (err, accountObj, userObj) {
                if (err) {
                    logger.logError(err);
                }
                if (cb) {
                    if (userObj) {
                        cb(err, userObj.status);
                    } else {
                        cb(err);
                    }
                }
            });
        }

        function revertAccountChanges(account, cb) {
            account.type = type;
            account.complimentaryCode = undefined;
            account.save(function (err) {
                if (err) {
                    logger.logError('subscription - convertToComplimentary.setAccountTypeToFree - error set account status back to free: ' + userEmail);
                    logger.logError(err);
                }
                if (cb) {
                    cb();
                }
            });
        }

        function revertUserChanges(user, status, cancelDate, cb) {
            user.status = status;
            user.upgradeDate = undefined;
            user.cancelDate = cancelDate;
            if (currentUser) {
                user.firstName = currentUser.firstName;
                user.lastName = currentUser.lastName;
                user.telephone = currentUser.telephone;
                user.hashedPassword = currentUser.hashedPassword;
                user.salt = currentUser.salt;
            }
            user.save(function (err) {
                if (err) {
                    logger.logError('subscription - convertToComplimentary.revertUserChanges - error setting status back to old value: ' + user.email);
                    logger.logError(err);
                }
                if (cb) {
                    cb();
                }
            });
        }

        function revertPackagesInAio(email, cb) {
            var packages = type === 'free' ? config.aioFreePackages : config.aioPaidPackages;
            aio.updateUserPackages(email, packages, function (err) {
                if (err) {
                    logger.logError('subscription - convertToComplimentary.revertPackagesInAio - error setting back to free package in aio: ' + email);
                    logger.logError(err);
                }
                if (cb) {
                    cb();
                }
            });
        }

        function revertUserStatusInAio(userObj, status, cb) {
            if (_.contains(['trial-ended', 'comp-ended', 'canceled'], status)) {
                aio.updateUserStatus(userObj.email, false, function (err) {
                    if (err) {
                        logger.logError('subscription - convertToComplimentary.revertUserStatusInAio - error setting user to inactive in aio: ' + userObj.email);
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
    },

    cancelSubscription: function (userEmail, cb) {
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
                        userObj.status = 'canceled';
                        userObj.cancelDate = (new Date()).toUTCString();
                        userObj.save(function (err) {
                            if (err) {
                                logger.logError('subscription - cancelSubscription - error saving user with canceled status: ' + userObj.email);
                                callback(err);
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
                        setUserActiveRemoveCancelDate(userObj);
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
                        setUserActiveRemoveCancelDate(userObj);
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

        function setUserActiveRemoveCancelDate(user, cb) {
            user.cancelDate = undefined;
            user.status = 'active';
            user.save(function (err) {
                if (err) {
                    logger.logError('subscription - cancelSubscription.setUserActiveRemoveCancelDate - error saving user back to active: ' + user.email);
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
                        userObj.save(function (err) {
                            if (err) {
                                logger.logError('subscription - endFreeTrial - error saving user to trial-ended status: ' + userObj.email);
                                callback(err);
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
                        setUserActiveRemoveCancelDate(userObj);
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
                billing.setTrialEnded(userObj.account.freeSideCustomerNumber, address, city, state, country, zip, function (err) {
                    if (err) {
                        setUserActiveRemoveCancelDate(userObj);
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

        function setUserActiveRemoveCancelDate(user, cb) {
            user.status = 'active';
            user.cancelDate = undefined;
            user.save(function (err) {
                if (err) {
                    logger.logError('subscription - endFreeTrial.setUserActiveRemoveCancelDate - error saving user back to active: ' + user.email);
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
                        userObj.save(function (err) {
                            if (err) {
                                logger.logError('subscription - endComplimentarySubscription - error saving user to comp-ended status: ' + userObj.email);
                                callback(err);
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
                        setUserActiveRemoveCancelDate(userObj);
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
                var expiryDate = ((new Date()).getMonth() + 1) + '/' + (new Date(userObj.validTill)).getFullYear();
                billing.setComplimentaryEnded(userObj.account.freeSideCustomerNumber, address, city, state, country, zip, expiryDate, function (err) {
                    if (err) {
                        setUserActiveRemoveCancelDate(userObj);
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
                    html: sf(config.complimentaryAccountEndedEmailBody[userObj.preferences.defaultLanguage], config.imageUrl, userObj.firstName, userObj.lastName, config.url + 'upgrade-subscription')
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

        function setUserActiveRemoveCancelDate(user, cb) {
            user.status = 'active';
            user.cancelDate = undefined;
            user.save(function (err) {
                if (err) {
                    logger.logError('subscription - endComplimentarySubscription.setUserActiveRemoveCancelDate - error saving user back to active: ' + user.email);
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

    updateToMerchantBilling: function (email, cb) {
        User.findOne({email: email}).populate('account').exec(function (err, userObj) {
            if (err) {
                logger.logError('subscription - updateToMerchantBilling - error fetching user: ' + email);
                cb(err);
            } else {
                var address = userObj.account.merchant;
                var city = 'West Palm Beach';
                var state = 'FL';
                var zip = '00000';
                var country = 'US';
                var payBy = 'BILL';
                var payInfo = '';
                var payDate = '';
                var payCvv = '';
                var payName = '';
                billing.updateUser(userObj.account.freeSideCustomerNumber, userObj.firstName, userObj.lastName, address, city, state, zip, country, userObj.email, userObj.telephone, payBy, payInfo, payDate, payCvv, payName, function (err) {
                    if (err) {
                        logger.logError('subscription - updateToMerchantBilling - error updating user in billing system: ' + userObj.email);
                        cb(err);
                    } else {
                        cb(null);
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
        paymentPending: false,
        primaryUser: userObj,
        users: [userObj],
        createdAt: now
    });
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
    account.paymentPending = true;
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

function revertAccountChangesForUpgrade(user, currentValues, currentUser, cb) {
    user.account.type = currentValues.type;
    user.account.complimentaryCode = currentValues.complimentaryCode;
    user.account.billingDate = currentValues.billingDate;
    user.account.paymentPending = currentValues.paymentPending;
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

function revertUserPackagesInAio(email, type, cb) {
    var packages = type === 'free' ? config.aioFreePackages : config.aioPaidPackages;
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

function revertUserStatusInAio(email, status, cb) {
    if (status === 'trial-ended' || status === 'comp-ended') {
        aio.updateUserStatus(email, false, function (err) {
            if (err) {
                logger.logError('subscription - revertUserStatusInAio - error setting back user status in aio: ' + email);
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
    user.account.paymentPending = true;
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
