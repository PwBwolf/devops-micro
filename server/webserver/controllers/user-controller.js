'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    sf = require('sf'),
    async = require('async'),
    jwt = require('jwt-simple'),
    uuid = require('node-uuid'),
    logger = require('../../common/config/logger'),
    moment = require('moment'),
    config = require('../../common/config/config'),
    email = require('../../common/services/email'),
    aio = require('../../common/services/aio'),
    billing = require('../../common/services/billing'),
    userRoles = require('../../../client/scripts/config/routing').userRoles,
    User = mongoose.model('User'),
    Account = mongoose.model('Account'),
    Visitor = mongoose.model('Visitor');

module.exports = {
    signUp: function (req, res) {
        var type,
            referredBy;
        async.waterfall([
            // create user in db
            function (callback) {
                User.findOne({email: req.body.email.toLowerCase()}, function (err, user) {
                    if (err) {
                        callback(err);
                    } else if (!user) {
                        type = req.body.type;
                        referredBy = req.body.referredBy;
                        var userObj = new User(req.body);
                        userObj.role = userRoles.user;
                        userObj.createdAt = (new Date()).toUTCString();
                        userObj.verificationCode = uuid.v4();
                        userObj.status = 'registered';
                        userObj.save(function (err1) {
                            if (err1) {
                                callback(err1);
                            } else {
                                callback(null, userObj);
                            }
                        });
                    } else {
                        callback('UserExists');
                    }
                });
            },
            // create account in db
            function (userObj, callback) {
                var accountObj = new Account({
                    type: type,
                    referredBy: referredBy,
                    primaryUser: userObj,
                    users: [userObj],
                    createdAt: (new Date()).toUTCString()
                });
                accountObj.save(function (err) {
                    if (err) {
                        // if account creation fails delete user as well
                        userObj.remove(function (err1) {
                            logger.logError(err1);
                        });
                        callback(err);
                    } else {
                        userObj.account = accountObj;
                        userObj.save(function (err2) {
                            if (err2) {
                                callback(err2);
                            } else {
                                callback(null, userObj, accountObj);
                            }
                        });
                    }
                });
            },
            // create user in AIO
            function (userObj, accountObj, callback) {
                var packages = type === 'free' ? config.aioFreePackages : config.aioPaidPackages;
                aio.createUser(userObj.email, userObj._id, userObj.firstName + ' ' + userObj.lastName, userObj.password, userObj.email, config.aioUserPin, packages, function (err, data) {
                    if (err) {
                        // if AIO user creation fails delete user and account from our DB
                        accountObj.remove(function (err1) {
                            if (err1) {
                                logger.logError(JSON.stringify(err1));
                            }
                        });
                        userObj.remove(function (err2) {
                            if (err2) {
                                logger.logError(JSON.stringify(err2));
                            }
                        });
                        callback(err);
                    } else {
                        accountObj.aioAccountId = data.account;
                        accountObj.save(function (err3) {
                            if (err3) {
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
                var address = type === 'free' ? 'Trial' : req.body.address;
                var city = type === 'free' ? 'West Palm Beach' : req.body.city;
                var state = type === 'free' ? 'FL' : req.body.state;
                var zip = type === 'free' ? '00000' : req.body.zipCode;
                var country = 'US';
                var payBy = type === 'free' ? 'BILL' : 'CARD';
                var payInfo = type === 'free' ? '' : req.body.cardNumber;
                var payDate = type === 'free' ? '' : req.body.expiryDate;
                var payCvv = type === 'free' ? '' : req.body.cvv;
                var payName = type === 'free' ? '' : req.body.cardName;
                billing.createUser(userObj.firstName, userObj.lastName, address, city, state, zip, country, userObj.email, userObj.telephone, payBy, payInfo, payDate, payCvv, payName, function (err, customerNumber) {
                    if (err) {
                        // if freeside user creation fails mark status as failed in our DB and set status as inactive in AIO
                        userObj.status = 'failed';
                        userObj.save(function (err2) {
                            if (err2) {
                                logger.logError(JSON.stringify(err2));
                            }
                        });
                        aio.updateUserStatus(userObj.email, false, function (err3) {
                            if (err3) {
                                logger.logError(JSON.stringify(err3));
                            }
                        });
                        callback(err);
                    } else {
                        accountObj.freeSideCustomerNumber = customerNumber;
                        accountObj.save(function (err4) {
                            if (err4) {
                                callback(err4);
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
                        logger.logError(JSON.stringify(err));
                    }
                });
                callback(null, userObj, accountObj);
            },
            // delete user from visitor
            function (userObj, accountObj, callback) {
                Visitor.findOne({email: userObj.email.toLowerCase()}, function (err, visitor) {
                    if (err) {
                        callback(err);
                    } else if (visitor) {
                        visitor.remove(function (err1) {
                            if (err1) {
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
                return res.status(500).send(JSON.stringify(err));
            }
            return res.status(200).end();
        });
    },

    signIn: function (req, res) {
        User.findOne({email: req.body.email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(401).send('SignInFailed');
            }
            if (!user.authenticate(req.body.password)) {
                return res.status(401).send('SignInFailed');
            }
            if (user.status === 'failed') {
                return res.status(409).send('FailedAccount');
            }
            if (user.status === 'registered') {
                return res.status(409).send('UnverifiedAccount');
            }
            user.lastSignedInDate = (new Date()).toUTCString();
            user.save(function (err) {
                if (err) {
                    logger.logError(err);
                }
            });
            var token = jwt.encode({
                email: req.body.email.toLowerCase(),
                role: user.role,
                expiry: moment().add(7, 'days').valueOf()
            }, config.secretToken);
            return res.json({token: token});
        });
    },

    signOut: function (req, res) {
        return res.status(200).end();
    },

    getUserProfile: function (req, res) {
        User.findOne({email: req.email}, function (err, user) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            Account.findOne({_id: user.account}, function (err1, account) {
                if (err1) {
                    logger.logError(err);
                    return res.status(500).end();
                }
                return res.send({email: req.email, role: req.role.title, firstName: user.firstName, lastName: user.lastName, telephone: user.telephone, type: account.type, status: user.status});
            });
        });
    },

    verifyUser: function (req, res) {
        User.findOne({verificationCode: req.body.code}, function (err, user) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            if (user.status === 'active') {
                return res.status(409).send('UserVerified');
            }
            if (user.status !== 'registered') {
                return res.status(409).send('UserError');
            }
            user.status = 'active';
            user.verificationCode = undefined;
            user.save(function (err) {
                if (err) {
                    logger.logError(err);
                    return res.status(500).end();
                }
                return res.status(200).end();
            });
        });
    },

    forgotPassword: function (req, res) {
        User.findOne({email: req.body.email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            if (!_.contains(['active', 'canceled', 'trial-ended'], user.status)) {
                return res.status(409).send('UserError');
            }
            user.resetPasswordCode = uuid.v4();
            user.save(function (err) {
                if (err) {
                    logger.logError(err);
                    return res.status(500).end();
                }
                var resetUrl = config.url + 'reset-password?code=' + user.resetPasswordCode;
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: user.email,
                    subject: config.forgotPasswordEmailSubject[user.preferences.defaultLanguage],
                    html: sf(config.forgotPasswordEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, resetUrl)
                };
                email.sendEmail(mailOptions, function (err) {
                    if (err) {
                        logger.logError(err);
                    }
                });
                return res.status(200).end();
            });
        });
    },

    checkResetCode: function (req, res) {
        User.findOne({resetPasswordCode: req.query.code}, function (err, user) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            if (!_.contains(['active', 'canceled', 'trial-ended'], user.status)) {
                return res.status(409).send('UserError');
            }
            return res.status(200).end();
        });
    },

    resetPassword: function (req, res) {
        User.findOne({resetPasswordCode: req.body.code}, function (err, user) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            if (!_.contains(['active', 'canceled', 'trial-ended'], user.status)) {
                return res.status(409).send('UserError');
            }
            user.resetPasswordCode = undefined;
            user.password = req.body.newPassword;
            user.save(function (err) {
                if (err) {
                    logger.logError(err);
                    return res.status(500).end();
                }
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: user.email,
                    subject: config.passwordChangedEmailSubject[user.preferences.defaultLanguage],
                    html: sf(config.passwordChangedEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName)
                };
                email.sendEmail(mailOptions, function (err) {
                    if (err) {
                        logger.logError(err);
                    }
                });
                return res.status(200).end();
            });
        });
    },

    isEmailUnique: function (req, res) {
        User.findOne({email: req.query.email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError(err);
                return res.send(false);
            }
            return res.send(!user);
        });
    },

    resendVerification: function (req, res) {
        User.findOne({email: req.body.email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            if (_.contains(['active', 'canceled', 'trial-ended'], user.status)) {
                return res.status(409).send('UserActivated');
            }
            if (user.status !== 'registered') {
                return res.status(409).send('UserError');
            }
            user.verificationCode = uuid.v4();
            user.save(function (err) {
                if (err) {
                    logger.logError(err);
                    return res.status(500).end();
                }
                var verificationUrl = config.url + 'verify-user?code=' + user.verificationCode;
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: user.email,
                    subject: config.accountVerificationEmailSubject[user.preferences.defaultLanguage],
                    html: sf(config.accountVerificationEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, verificationUrl)
                };
                email.sendEmail(mailOptions, function (err) {
                    if (err) {
                        logger.logError(err);
                    }
                });
                res.status(200).end();
            });
        });
    },

    changePassword: function (req, res) {
        User.findOne({email: req.email}, function (err, user) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            if (!user.authenticate(req.body.currentPassword)) {
                return res.status(401).send('Unauthorized');
            }
            user.password = req.body.newPassword;
            user.save(function (err) {
                if (err) {
                    logger.logError(err);
                    return res.status(500).end();
                }
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: user.email,
                    subject: config.passwordChangedEmailSubject[user.preferences.defaultLanguage],
                    html: sf(config.passwordChangedEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName)
                };
                email.sendEmail(mailOptions, function (err) {
                    if (err) {
                        logger.logError(err);
                    }
                });
                return res.status(200).end();
            });
        });
    },

    changeCreditCard: function (req, res) {
        User.findOne({email: req.email.toLowerCase()}).populate('account').exec(function (err, user) {
            if (err) {
                logger.logError(JSON.stringify(err));
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            if (user.account.type === 'free') {
                return res.status(409).send('FreeUser');
            }
            var address = req.body.address;
            var city = req.body.city;
            var state = req.body.state;
            var zip = req.body.zipCode;
            var country = 'US';
            var payBy = 'CARD';
            var payInfo = req.body.cardNumber;
            var payDate = req.body.expiryDate;
            var payCvv = req.body.cvv;
            var payName = req.body.cardName;
            billing.updateCreditCard(user.account.freeSideCustomerNumber, address, city, state, zip, country, payBy, payInfo, payDate, payCvv, payName, function (err) {
                if (err) {
                    logger.logError(JSON.stringify(err));
                    return res.status(500).end();
                }
                return res.status(200).end();
            });
        });
    },

    getAioToken: function (req, res) {
        var aioGuestList = config.aioGuestAccountList;
        var user = req.email ? req.email : aioGuestList[getGuestCounter()];
        aio.getToken(user, function (err, data) {
            if (err) {
                logger.logError(JSON.stringify(err));
                return res.status(500).end();
            }
            if (!req.email) {
                data.isGuest = true;
            }
            return res.send(data);
        });
    },

    upgradeSubscription: function (req, res) {
        var status;
        async.waterfall([
            // set account type to paid
            function (callback) {
                User.findOne({email: req.email.toLowerCase()}, function (err, user) {
                    if (err) {
                        callback(err);
                    } else {
                        Account.findOne({_id: user.account}, function (err1, accountObj) {
                            if (err1) {
                                callback(err1);
                            } else if (accountObj.type !== 'free') {
                                callback('NonFreeUser');
                            } else {
                                accountObj.type = 'paid';
                                accountObj.save(function (err2) {
                                    if (err2) {
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
                User.findOne({email: req.email.toLowerCase()}, function (err, userObj) {
                    if (err) {
                        callback(err);
                    } else {
                        status = userObj.status;
                        userObj.status = 'active';
                        userObj.upgradeDate = (new Date()).toUTCString();
                        userObj.save(function (err1) {
                            if (err1) {
                                setAccountTypeToFree(accountObj, function () {
                                    callback(err);
                                });
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
                            deleteUpgradeDateSetStatus(userObj, status);
                            setAccountTypeToFree(accountObj);
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
                        deleteUpgradeDateSetStatus(userObj, status);
                        setAccountTypeToFree(accountObj);
                        callback(err);
                    } else {
                        callback(null, accountObj, userObj);
                    }
                });
            },
            // set credit card information in FreeSide
            function (accountObj, userObj, callback) {
                var address = req.body.address;
                var city = req.body.city;
                var state = req.body.state;
                var zip = req.body.zipCode;
                var country = 'US';
                var payBy = 'CARD';
                var payInfo = req.body.cardNumber;
                var payDate = req.body.expiryDate;
                var payCvv = req.body.cvv;
                var payName = req.body.cardName;
                billing.updateCreditCard(accountObj.freeSideCustomerNumber, address, city, state, zip, country, payBy, payInfo, payDate, payCvv, payName, function (err) {
                    if (err) {
                        setFreePackagesInAio(userObj.email);
                        optionallySetUserInactiveInAio(userObj, status);
                        deleteUpgradeDateSetStatus(userObj, status);
                        setAccountTypeToFree(accountObj);
                        callback(err);
                    } else {
                        callback(null, accountObj, userObj);
                    }
                });
            },
        ], function (err) {
            if (err) {
                logger.logError(err);
                return res.status(500).send(err);
            }
            return res.status(200).end();
        });
    },

    reactivateSubscription: function (req, res) {
        var cancelDate;
        async.waterfall([
            // set user status to 'active' and remove canceledDate
            function (callback) {
                User.findOne({email: req.email.toLowerCase()}).populate('account').exec(function (err, userObj) {
                    if (err) {
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
                        callback(err);
                    } else {
                        callback(null, userObj);
                    }
                });
            },
            // set credit card and billing address
            function (userObj, callback) {
                var address = req.body.address;
                var city = req.body.city;
                var state = req.body.state;
                var zip = req.body.zipCode;
                var country = 'US';
                var payBy = 'CARD';
                var payInfo = req.body.cardNumber;
                var payDate = req.body.expiryDate;
                var payCvv = req.body.cvv;
                var payName = req.body.cardName;
                billing.updateCreditCard(userObj.account.freeSideCustomerNumber, address, city, state, zip, country, payBy, payInfo, payDate, payCvv, payName, function (err) {
                    if (err) {
                        setUserInactiveInAio(userObj.email);
                        setUserCanceledResetCanceledDate(cancelDate, userObj);
                        callback(err);
                    } else {
                        callback(null, userObj);
                    }
                });
            }
        ], function (err) {
            if (err) {
                logger.logError(err);
                return res.status(500).send(err);
            }
            return res.status(200).end();
        });
    },

    cancelSubscription: function (req, res) {
        async.waterfall([
            // set user status to 'canceled' and set canceledDate to current date
            function (callback) {
                User.findOne({email: req.email.toLowerCase()}).populate('account').exec(function (err, userObj) {
                    if (err) {
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
                        callback(err);
                    } else {
                        callback(null, userObj);
                    }
                });
            }
        ], function (err) {
            if (err) {
                logger.logError(err);
                return res.status(500).send(err);
            }
            return res.status(200).end();
        });
    }
};

function setAccountTypeToFree(account, cb) {
    account.type = 'free';
    account.save(function (err) {
        if (err) {
            logger.logError(JSON.stringify(err));
        }
        if (cb) {
            cb();
        }
    });
}

function deleteUpgradeDateSetStatus(user, status, cb) {
    user.status = status;
    user.upgradeDate = undefined;
    user.save(function (err) {
        if (err) {
            logger.logError(JSON.stringify(err));
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
            logger.logError(JSON.stringify(err));
        }
        if (cb) {
            cb();
        }
    });
}

function getGuestCounter() {
    getGuestCounter.count = ++getGuestCounter.count || 0;
    if (getGuestCounter.count >= config.aioGuestAccountList.length) {
        getGuestCounter.count = 0;
    }
    console.log(getGuestCounter.count);
    return getGuestCounter.count;
}

function setUserActiveRemoveCanceledDate(user, cb) {
    user.cancelDate = undefined;
    user.status = 'active';
    user.save(function (err) {
        if (err) {
            logger.logError(JSON.stringify(err));
        }
        if (cb) {
            cb();
        }
    });
}

function setUserActiveInAio(email, cb) {
    aio.updateUserStatus(email, true, function (err) {
        if (err) {
            logger.logError(JSON.stringify(err));
        }
        if (cb) {
            cb();
        }
    });
}

function setUserCanceledResetCanceledDate(cancelDate, user, cb) {
    user.cancelDate = cancelDate;
    user.status = 'canceled';
    user.save(function (err) {
        if (err) {
            logger.logError(JSON.stringify(err));
        }
        if (cb) {
            cb();
        }
    });
}

function setUserInactiveInAio(email, cb) {
    aio.updateUserStatus(email, false, function (err) {
        if (err) {
            logger.logError(JSON.stringify(err));
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
                logger.logError(JSON.stringify(err));
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
