'use strict';

var async = require('async'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    uuid = require('node-uuid'),
    aio = require('./aio'),
    billing = require('./billing'),
    config = require('../config/config'),
    email = require('./email'),
    logger = require('../config/logger'),
    date = require('./date'),
    User = mongoose.model('User'),
    Account = mongoose.model('Account'),
    Visitor = mongoose.model('Visitor'),
    ComplimentaryCode = mongoose.model('ComplimentaryCode'),
    userRoles = require('../../../client/scripts/config/routing').userRoles,
    sf = require('sf');

module.exports = {

    newFreeUser: function (user, cb) {
        async.waterfall([
            // create user in db
            function (callback) {
                var userObj = new User(user);
                userObj.role = userRoles.user;
                userObj.createdAt = (new Date()).toUTCString();
                userObj.verificationCode = uuid.v4();
                userObj.status = 'registered';
                userObj.save(function (err) {
                    if (err) {
                        logger.logError('subscription - newFreeUser - error creating user: ' + user.email);
                        callback(err);
                    } else {
                        callback(null, userObj);
                    }
                });
            },
            // create account in db
            function (userObj, callback) {
                var accountObj = new Account({
                    type: 'free',
                    referredBy: user.referredBy,
                    primaryUser: userObj,
                    users: [userObj],
                    createdAt: (new Date()).toUTCString()
                });
                accountObj.save(function (err) {
                    if (err) {
                        userObj.remove(function (err1) {
                            if (err1) {
                                logger.logError('subscription - newFreeUser - error removing user as account creation failed: ' + user.email);
                                logger.logError(err1);
                            }
                        });
                        logger.logError('subscription - newFreeUser - error creating account: ' + user.email);
                        callback(err);
                    } else {
                        userObj.account = accountObj;
                        userObj.save(function (err1) {
                            if (err1) {
                                logger.logError('subscription - newFreeUser - error updating user with account details: ' + user.email);
                                callback(err1);
                            } else {
                                callback(null, userObj, accountObj);
                            }
                        });
                    }
                });
            },
            // create user in AIO
            function (userObj, accountObj, callback) {
                var packages = config.aioFreePackages;
                aio.createUser(userObj.email, userObj._id, userObj.firstName + ' ' + userObj.lastName, userObj.password, userObj.email, config.aioUserPin, packages, function (err, data) {
                    if (err) {
                        accountObj.remove(function (err1) {
                            if (err1) {
                                logger.logError('subscription - newFreeUser - error removing account as aio create user failed: ' + userObj.email);
                                logger.logError(err1);
                            }
                        });
                        userObj.remove(function (err2) {
                            if (err2) {
                                logger.logError('subscription - newFreeUser - error removing user as aio create user failed: ' + userObj.email);
                                logger.logError(err2);
                            }
                        });
                        logger.logError('subscription - newFreeUser - error creating user in aio: ' + userObj.email);
                        callback(err);
                    } else {
                        accountObj.aioAccountId = data.account;
                        accountObj.save(function (err3) {
                            if (err3) {
                                logger.logError('subscription - newFreeUser - error updating aioAccountId in account: ' + userObj.email);
                                callback(err3);
                            } else {
                                callback(null, userObj, accountObj);
                            }
                        });
                    }
                });
            },
            // create user in FreeSide
            function (userObj, accountObj, callback) {
                var address = 'Trial';
                var city = 'West Palm Beach';
                var state = 'FL';
                var zip = '00000';
                var country = 'US';
                var payBy = 'BILL';
                var payInfo = '';
                var payDate = '';
                var payCvv = '';
                var payName = '';
                billing.createUser(userObj.firstName, userObj.lastName, address, city, state, zip, country, userObj.email, userObj.telephone, payBy, payInfo, payDate, payCvv, payName, function (err, customerNumber) {
                    if (err) {
                        userObj.status = 'failed';
                        userObj.save(function (err1) {
                            if (err1) {
                                logger.logError('subscription - newFreeUser - error updating status to failed as user creation in billing system failed: ' + userObj.email);
                                logger.logError(err1);
                            }
                        });
                        aio.updateUserStatus(userObj.email, false, function (err2) {
                            if (err2) {
                                logger.logError('subscription - newFreeUser - error setting user inactive in aio as user creation failed in billing system: ' + userObj.email);
                                logger.logError(err2);
                            }
                        });
                        logger.logError('subscription - newFreeUser - error creating user in billing system: ' + userObj.email);
                        callback(err);
                    } else {
                        accountObj.freeSideCustomerNumber = customerNumber;
                        accountObj.save(function (err3) {
                            if (err3) {
                                logger.logError('subscription - newFreeUser - error updating billing system customer number in account: ' + userObj.email);
                                callback(err3);
                            } else {
                                callback(null, userObj, accountObj);
                            }
                        });
                    }
                });
            },
            // send verification email
            function (userObj, accountObj, callback) {
                var verificationUrl = config.url + 'verify-user?code=' + userObj.verificationCode;
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: userObj.email,
                    subject: config.accountVerificationEmailSubject[userObj.preferences.defaultLanguage],
                    html: sf(config.accountVerificationEmailBody[userObj.preferences.defaultLanguage], config.imageUrl, userObj.firstName, userObj.lastName, verificationUrl)
                };
                email.sendEmail(mailOptions, function (err) {
                    if (err) {
                        logger.logError('subscription - newFreeUser - error send verification email to ' + mailOptions.to);
                        logger.logError(err);
                    } else {
                        logger.logInfo('subscription - newFreeUser - verification email sent to ' + mailOptions.to);
                    }
                });
                callback(null, userObj, accountObj);
            },
            // delete user from visitor
            function (userObj, accountObj, callback) {
                Visitor.findOne({email: userObj.email.toLowerCase()}, function (err, visitor) {
                    if (err) {
                        logger.logError('subscription - newFreeUser - error fetching visitor: ' + userObj.email);
                        callback(err);
                    } else if (visitor) {
                        visitor.remove(function (err1) {
                            if (err1) {
                                logger.logError('subscription - newFreeUser - error removing visitor: ' + userObj.email);
                                logger.logError(err);
                            }
                            callback(null, userObj, accountObj);
                        });
                    } else {
                        callback(null, userObj, accountObj);
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
    },

    newPaidUser: function (user, cb) {
        async.waterfall([
            // create user in db
            function (callback) {
                var userObj = new User(user);
                userObj.role = userRoles.user;
                userObj.createdAt = (new Date()).toUTCString();
                userObj.verificationCode = uuid.v4();
                userObj.status = 'registered';
                userObj.save(function (err) {
                    if (err) {
                        logger.logError('subscription - newPaidUser - error creating user: ' + user.email);
                        callback(err);
                    } else {
                        callback(null, userObj);
                    }
                });
            },
            // create account in db
            function (userObj, callback) {
                var accountObj = new Account({
                    type: 'paid',
                    referredBy: user.referredBy,
                    primaryUser: userObj,
                    users: [userObj],
                    createdAt: (new Date()).toUTCString()
                });
                accountObj.save(function (err) {
                    if (err) {
                        userObj.remove(function (err1) {
                            if (err1) {
                                logger.logError('subscription - newPaidUser - error removing user as account creation failed: ' + user.email);
                                logger.logError(err1);
                            }
                        });
                        logger.logError('subscription - newPaidUser - error creating account: ' + user.email);
                        callback(err);
                    } else {
                        userObj.account = accountObj;
                        userObj.save(function (err1) {
                            if (err1) {
                                logger.logError('subscription - newPaidUser - error updating user with account details: ' + user.email);
                                callback(err1);
                            } else {
                                callback(null, userObj, accountObj);
                            }
                        });
                    }
                });
            },
            // create user in AIO
            function (userObj, accountObj, callback) {
                var packages = config.aioPaidPackages;
                aio.createUser(userObj.email, userObj._id, userObj.firstName + ' ' + userObj.lastName, userObj.password, userObj.email, config.aioUserPin, packages, function (err, data) {
                    if (err) {
                        accountObj.remove(function (err1) {
                            if (err1) {
                                logger.logError('subscription - newPaidUser - error removing account as aio create user failed: ' + userObj.email);
                                logger.logError(err1);
                            }
                        });
                        userObj.remove(function (err2) {
                            if (err2) {
                                logger.logError('subscription - newPaidUser - error removing user as aio create user failed: ' + userObj.email);
                                logger.logError(err2);
                            }
                        });
                        logger.logError('subscription - newPaidUser - error creating user in aio: ' + userObj.email);
                        callback(err);
                    } else {
                        accountObj.aioAccountId = data.account;
                        accountObj.save(function (err3) {
                            if (err3) {
                                logger.logError('subscription - newPaidUser - error updating aioAccountId in account: ' + userObj.email);
                                callback(err3);
                            } else {
                                callback(null, userObj, accountObj);
                            }
                        });
                    }
                });
            },
            // create user in FreeSide
            function (userObj, accountObj, callback) {
                var address = user.address;
                var city = user.city;
                var state = user.state;
                var zip = user.zipCode;
                var country = 'US';
                var payBy = 'CARD';
                var payInfo = user.cardNumber;
                var payDate = user.expiryDate;
                var payCvv = user.cvv;
                var payName = user.cardName;
                billing.createUser(userObj.firstName, userObj.lastName, address, city, state, zip, country, userObj.email, userObj.telephone, payBy, payInfo, payDate, payCvv, payName, function (err, customerNumber) {
                    if (err) {
                        userObj.status = 'failed';
                        userObj.save(function (err1) {
                            if (err1) {
                                logger.logError('subscription - newPaidUser - error updating status to failed as user creation in billing system failed: ' + userObj.email);
                                logger.logError(err1);
                            }
                        });
                        aio.updateUserStatus(userObj.email, false, function (err2) {
                            if (err2) {
                                logger.logError('subscription - newPaidUser - error setting user inactive in aio as user creation failed in billing system: ' + userObj.email);
                                logger.logError(err2);
                            }
                        });
                        logger.logError('subscription - newPaidUser - error creating user in billing system: ' + userObj.email);
                        callback(err);
                    } else {
                        accountObj.freeSideCustomerNumber = customerNumber;
                        accountObj.save(function (err3) {
                            if (err3) {
                                logger.logError('subscription - newPaidUser - error updating billing system customer number in account: ' + userObj.email);
                                callback(err3);
                            } else {
                                callback(null, userObj, accountObj);
                            }
                        });
                    }
                });
            },
            // send verification email
            function (userObj, accountObj, callback) {
                var verificationUrl = config.url + 'verify-user?code=' + userObj.verificationCode;
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: userObj.email,
                    subject: config.accountVerificationEmailSubject[userObj.preferences.defaultLanguage],
                    html: sf(config.accountVerificationEmailBody[userObj.preferences.defaultLanguage], config.imageUrl, userObj.firstName, userObj.lastName, verificationUrl)
                };
                email.sendEmail(mailOptions, function (err) {
                    if (err) {
                        logger.logError('subscription - newPaidUser - error send verification email to ' + mailOptions.to);
                        logger.logError(err);
                    } else {
                        logger.logInfo('subscription - newPaidUser - verification email sent to ' + mailOptions.to);
                    }
                });
                callback(null, userObj, accountObj);
            },
            // delete user from visitor
            function (userObj, accountObj, callback) {
                Visitor.findOne({email: userObj.email.toLowerCase()}, function (err, visitor) {
                    if (err) {
                        logger.logError('subscription - newPaidUser - error fetching visitor: ' + userObj.email);
                        callback(err);
                    } else if (visitor) {
                        visitor.remove(function (err1) {
                            if (err1) {
                                logger.logError('subscription - newPaidUser - error removing visitor: ' + userObj.email);
                                logger.logError(err);
                            }
                            callback(null, userObj, accountObj);
                        });
                    } else {
                        callback(null, userObj, accountObj);
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

        function createComplimentaryUser(user, cc, cb) {
            async.waterfall([
                // create user in db
                function (callback) {
                    var userObj = new User(user);
                    userObj.role = userRoles.user;
                    userObj.createdAt = (new Date()).toUTCString();
                    userObj.validTill = moment(userObj.createdAt).add(cc.duration, 'days').utc();
                    userObj.verificationCode = uuid.v4();
                    userObj.status = 'registered';
                    userObj.save(function (err) {
                        if (err) {
                            logger.logError('subscription - newComplimentaryUser - error creating user: ' + user.email);
                            callback(err);
                        } else {
                            callback(null, userObj);
                        }
                    });
                },
                // create account in db
                function (userObj, callback) {
                    var accountObj = new Account({
                        type: 'comp',
                        complimentaryCode: user.code,
                        primaryUser: userObj,
                        users: [userObj],
                        createdAt: (new Date()).toUTCString()
                    });
                    accountObj.save(function (err) {
                        if (err) {
                            userObj.remove(function (err1) {
                                if (err1) {
                                    logger.logError('subscription - newComplimentaryUser - error removing user as account creation failed: ' + user.email);
                                    logger.logError(err1);
                                }
                            });
                            logger.logError('subscription - newComplimentaryUser - error creating account: ' + user.email);
                            callback(err);
                        } else {
                            userObj.account = accountObj;
                            userObj.save(function (err1) {
                                if (err1) {
                                    logger.logError('subscription - newComplimentaryUser - error updating user with account details: ' + user.email);
                                    callback(err1);
                                } else {
                                    callback(null, userObj, accountObj);
                                }
                            });
                        }
                    });
                },
                // create user in AIO
                function (userObj, accountObj, callback) {
                    var packages = config.aioPaidPackages;
                    aio.createUser(userObj.email, userObj._id, userObj.firstName + ' ' + userObj.lastName, userObj.password, userObj.email, config.aioUserPin, packages, function (err, data) {
                        if (err) {
                            accountObj.remove(function (err1) {
                                if (err1) {
                                    logger.logError('subscription - newComplimentaryUser - error removing account as aio create user failed: ' + userObj.email);
                                    logger.logError(err1);
                                }
                            });
                            userObj.remove(function (err2) {
                                if (err2) {
                                    logger.logError('subscription - newComplimentaryUser - error removing user as aio create user failed: ' + userObj.email);
                                    logger.logError(err2);
                                }
                            });
                            logger.logError('subscription - newComplimentaryUser - error creating user in aio: ' + userObj.email);
                            callback(err);
                        } else {
                            accountObj.aioAccountId = data.account;
                            accountObj.save(function (err3) {
                                if (err3) {
                                    logger.logError('subscription - newComplimentaryUser - error updating aioAccountId in account: ' + userObj.email);
                                    callback(err3);
                                } else {
                                    callback(null, userObj, accountObj);
                                }
                            });
                        }
                    });
                },
                // create user in FreeSide
                function (userObj, accountObj, callback) {
                    var address = 'Complimentary';
                    var city = 'West Palm Beach';
                    var state = 'FL';
                    var zip = '00000';
                    var country = 'US';
                    var payBy = 'BILL';
                    var payInfo = '';
                    var payDate = '';
                    var payCvv = '';
                    var payName = '';
                    billing.createUser(userObj.firstName, userObj.lastName, address, city, state, zip, country, userObj.email, userObj.telephone, payBy, payInfo, payDate, payCvv, payName, function (err, customerNumber) {
                        if (err) {
                            userObj.status = 'failed';
                            userObj.save(function (err1) {
                                if (err1) {
                                    logger.logError('subscription - newComplimentaryUser - error updating status to failed as user creation in billing system failed: ' + userObj.email);
                                    logger.logError(err1);
                                }
                            });
                            aio.updateUserStatus(userObj.email, false, function (err2) {
                                if (err2) {
                                    logger.logError('subscription - newComplimentaryUser - error setting user inactive in aio as user creation failed in billing system: ' + userObj.email);
                                    logger.logError(err2);
                                }
                            });
                            logger.logError('subscription - newComplimentaryUser - error creating user in billing system: ' + userObj.email);
                            callback(err);
                        } else {
                            accountObj.freeSideCustomerNumber = customerNumber;
                            accountObj.save(function (err3) {
                                if (err3) {
                                    logger.logError('subscription - newComplimentaryUser - error updating billing system customer number in account: ' + userObj.email);
                                    callback(err3);
                                } else {
                                    callback(null, userObj, accountObj);
                                }
                            });
                        }
                    });
                },
                // send verification email
                function (userObj, accountObj, callback) {
                    var verificationUrl = config.url + 'verify-user?code=' + userObj.verificationCode;
                    var mailOptions = {
                        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                        to: userObj.email,
                        subject: config.accountVerificationEmailSubject[userObj.preferences.defaultLanguage],
                        html: sf(config.accountVerificationEmailBody[userObj.preferences.defaultLanguage], config.imageUrl, userObj.firstName, userObj.lastName, verificationUrl)
                    };
                    email.sendEmail(mailOptions, function (err) {
                        if (err) {
                            logger.logError('subscription - newComplimentaryUser - error send verification email to ' + mailOptions.to);
                            logger.logError(err);
                        } else {
                            logger.logInfo('subscription - newComplimentaryUser - verification email sent to ' + mailOptions.to);
                        }
                    });
                    callback(null, userObj, accountObj);
                },
                // delete user from visitor
                function (userObj, accountObj, callback) {
                    Visitor.findOne({email: userObj.email.toLowerCase()}, function (err, visitor) {
                        if (err) {
                            logger.logError('subscription - newComplimentaryUser - error fetching visitor: ' + userObj.email);
                            callback(err);
                        } else if (visitor) {
                            visitor.remove(function (err1) {
                                if (err1) {
                                    logger.logError('subscription - newComplimentaryUser - error removing visitor: ' + userObj.email);
                                    logger.logError(err);
                                }
                                callback(null, userObj, accountObj);
                            });
                        } else {
                            callback(null, userObj, accountObj);
                        }
                    });
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
            ], function (err) {
                if (err) {
                    logger.logError(err);
                }
                if (cb) {
                    cb(err);
                }
            });
        }
    },

    upgradeSubscription: function (userEmail, newUser, cb) {
        var status,
            type,
            cancelDate,
            currentUser;
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
                            } else if (user.status === 'failed') {
                                callback('FailedUser');
                            } else if (accountObj.type === 'paid') {
                                callback('PaidUser');
                            } else if (accountObj.type === 'comp' && (user.status === 'active' || user.status === 'registered')) {
                                callback('ActiveCompUser');
                            } else {
                                type = accountObj.type;
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
            // set user upgrade date and make status active, optionally set user details
            function (accountObj, callback) {
                User.findOne({email: userEmail}, function (err, userObj) {
                    if (err) {
                        logger.logError('subscription - upgradeSubscription - error fetching user: ' + userEmail);
                        callback(err);
                    } else {
                        status = userObj.status;
                        cancelDate = userObj.cancelDate;
                        userObj.status = status === 'registered' ? 'registered' : 'active';
                        userObj.upgradeDate = (new Date()).toUTCString();
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
                        userObj.save(function (err1) {
                            if (err1) {
                                revertAccountType(accountObj);
                                logger.logError('subscription - upgradeSubscription - error saving user to active: ' + userEmail);
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
                if (status === 'trial-ended' || status === 'comp-ended') {
                    aio.updateUserStatus(userObj.email, true, function (err) {
                        if (err) {
                            revertUserChanges(userObj, status, cancelDate);
                            revertAccountType(accountObj);
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
                        revertUserStatusInAio(userObj, status);
                        revertUserChanges(userObj, status);
                        revertAccountType(accountObj);
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
                        revertPackagesInAio(userObj.email);
                        revertUserStatusInAio(userObj, status);
                        revertUserChanges(userObj, status);
                        revertAccountType(accountObj);
                        logger.logError('subscription - upgradeSubscription - error setting credit card in billing system: ' + userObj.email);
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
                            logger.logError('subscription - upgradeSubscription - error send verification email to ' + mailOptions.to);
                            logger.logError(err);
                        } else {
                            logger.logInfo('subscription - upgradeSubscription - verification email sent to ' + mailOptions.to);
                        }
                    });
                    callback(null, accountObj, userObj);
                } else {
                    callback(null, accountObj, userObj);
                }
            },
        ], function (err, accountObj, userObj) {
            if (err) {
                logger.logError(err);
            }
            if (cb) {
                if (userObj) {
                    cb(err, userObj);
                } else {
                    cb(err);
                }
            }
        });

        function revertAccountType(account, cb) {
            account.type = type;
            account.save(function (err) {
                if (err) {
                    logger.logError('subscription - upgradeSubscription.revertAccountType - error set account status back to old value: ' + userEmail);
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
                    logger.logError('subscription - upgradeSubscription.revertUserChanges - error setting user back to old values: ' + user.email);
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
                    logger.logError('subscription - upgradeSubscription.revertPackagesInAio - error setting back package in aio: ' + email);
                    logger.logError(err);
                }
                if (cb) {
                    cb();
                }
            });
        }

        function revertUserStatusInAio(userObj, status, cb) {
            if (status === 'trial-ended' || status === 'comp-ended') {
                aio.updateUserStatus(userObj.email, false, function (err) {
                    if (err) {
                        logger.logError('subscription - upgradeSubscription.revertUserStatusInAio - error setting back user status in aio: ' + userObj.email);
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
                        revertUserChanges(cancelDate, userObj);
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
                        revertUserChanges(cancelDate, userObj);
                        logger.logError('subscription - reactivateSubscription - error saving credit card to billing system: ' + userObj.email);
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
                            Account.findOne({_id: user.account}, function (err1, accountObj) {
                                if (err1) {
                                    logger.logError('subscription - convertToComplimentary - error fetching account: ' + userEmail);
                                    callback(err1);
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
                                    accountObj.save(function (err2) {
                                        if (err2) {
                                            logger.logError('subscription - convertToComplimentary - error saving account to paid: ' + userEmail);
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
                // set user upgrade date and make status active, optionally set user details
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
                            userObj.save(function (err1) {
                                if (err1) {
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
                    if (status === 'trial-ended' || status === 'comp-ended') {
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
                // set credit card information in FreeSide
                function (accountObj, userObj, callback) {
                    var address = 'Complimentary';
                    var city = 'West Palm Beach';
                    var state = 'FL';
                    var zip = '00000';
                    var country = 'US';
                    var payBy = 'BILL';
                    var payInfo = '';
                    var payDate = '';
                    var payCvv = '';
                    var payName = '';
                    billing.updateCreditCard(accountObj.freeSideCustomerNumber, address, city, state, zip, country, payBy, payInfo, payDate, payCvv, payName, function (err) {
                        if (err) {
                            revertPackagesInAio(userObj.email);
                            revertUserStatusInAio(userObj, status);
                            revertUserChanges(userObj, status);
                            revertAccountChanges(accountObj);
                            logger.logError('subscription - convertToComplimentary - error setting credit card in billing system: ' + userObj.email);
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
            if (status === 'trial-ended' || status === 'comp-ended') {
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
    }
};
