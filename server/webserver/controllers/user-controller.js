'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    sf = require('sf'),
    jwt = require('jwt-simple'),
    uuid = require('node-uuid'),
    logger = require('../../common/config/logger'),
    moment = require('moment'),
    config = require('../../common/config/config'),
    email = require('../../common/services/email'),
    subscription = require('../../common/services/subscription'),
    aio = require('../../common/services/aio'),
    billing = require('../../common/services/billing'),
    User = mongoose.model('User'),
    Account = mongoose.model('Account');

module.exports = {
    signUp: function (req, res) {
        User.findOne({email: req.body.email.toLowerCase()}).populate('account').exec(function (err, user) {
            if (err) {
                logger.logError('userController - signUp - error fetching user: ' + req.body.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            var type = req.body.type;
            if (!user) {
                if (type === 'free') {
                    subscription.newFreeUser(req.body, function (err) {
                        if (err) {
                            logger.logError('userController - signUp - error in new free user creation: ' + req.body.email.toLowerCase());
                            logger.logError(err);
                            return res.status(500).end();
                        } else {
                            return res.status(200).send('registered');
                        }
                    });
                } else if (type === 'paid') {
                    subscription.newPaidUser(req.body, function (err) {
                        if (err) {
                            logger.logError('userController - signUp - error in new paid user creation: ' + req.body.email.toLowerCase());
                            logger.logError(err);
                            return res.status(500).end();
                        } else {
                            return res.status(200).send('registered');
                        }
                    });
                } else if (type === 'comp') {
                    subscription.newComplimentaryUser(req.body, function (err) {
                        if (err) {
                            logger.logError('userController - signUp - error in new complimentary user creation: ' + req.body.email.toLowerCase());
                            logger.logError(err);
                            return res.status(500).end();
                        } else {
                            return res.status(200).end('registered');
                        }
                    });
                } else {
                    logger.logError('userController - signUp - invalid type + ' + type + ': ' + req.body.email.toLowerCase());
                    return res.status(500).end();
                }
            } else {
                if (user.status === 'failed') {
                    logger.logError('userController - signUp - user with failed status: ' + req.body.email.toLowerCase());
                    return res.status(500).end();
                } else {
                    if (type === 'free') {
                        logger.logError('userController - signUp - re-sign up of free non-failed user not allowed: ' + req.body.email.toLowerCase());
                        return res.status(500).end();
                    } else if (type === 'paid' && user.account.type === 'free') {
                        subscription.upgradeSubscription(user.email, req.body, function (err, status) {
                            if (err) {
                                logger.logError('userController - signUp - error in upgrade subscription from free to paid: ' + req.body.email.toLowerCase());
                                logger.logError(err);
                                return res.status(500).end(err);
                            } else {
                                return res.status(200).send(status);
                            }
                        });
                    } else if (type === 'paid' && user.account.type === 'paid' && user.status === 'canceled') {
                        subscription.reactivateSubscription(user.email, req.body, function (err, status) {
                            if (err) {
                                logger.logError('userController - signUp - error in reactivating subscription: ' + req.body.email.toLowerCase());
                                logger.logError(err);
                                return res.status(500).end(err);
                            } else {
                                return res.status(200).send(status);
                            }
                        });
                    } else if (type === 'paid' && user.account.type === 'comp' && user.status === 'comp-ended') {
                        subscription.upgradeSubscription(user.email, req.body, function (err, status) {
                            if (err) {
                                logger.logError('userController - signUp - error upgrading from complimentary to paid: ' + req.body.email.toLowerCase());
                                logger.logError(err);
                                return res.status(500).end(err);
                            } else {
                                return res.status(200).send(status);
                            }
                        });
                    } else if (type === 'comp' && user.account.type === 'free') {
                        subscription.convertToComplimentary(user.email, req.body, function (err, status) {
                            if (err) {
                                logger.logError('userController - signUp - error converting free to complimentary: ' + req.body.email.toLowerCase());
                                logger.logError(err);
                                return res.status(500).end(err);
                            } else {
                                return res.status(200).send(status);
                            }
                        });
                    } else if (type === 'comp' && user.account.type === 'paid' && user.status === 'canceled') {
                        subscription.convertToComplimentary(user.email, req.body, function (err, status) {
                            if (err) {
                                logger.logError('userController - signUp - error converting paid to complimentary: ' + req.body.email.toLowerCase());
                                logger.logError(err);
                                return res.status(500).end(err);
                            } else {
                                return res.status(200).send(status);
                            }
                        });
                    } else if (type === 'comp' && user.account.type === 'comp' && user.status === 'comp-ended') {
                        subscription.convertToComplimentary(user.email, req.body, function (err, status) {
                            if (err) {
                                logger.logError('userController - signUp - error converting complimentary to complimentary: ' + req.body.email.toLowerCase());
                                logger.logError(err);
                                return res.status(500).end(err);
                            } else {
                                return res.status(200).send(status);
                            }
                        });
                    }
                }
            }
        });
    },

    signIn: function (req, res) {
        User.findOne({email: req.body.email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError('userController - signIn - error fetching user: ' + req.body.email.toLowerCase());
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
            user.save(function (err1) {
                if (err1) {
                    logger.logError('userController - signIn - error saving user lastSignedInDate: ' + req.body.email.toLowerCase());
                    logger.logError(err1);
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
        User.findOne({email: req.email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError('userController - getUserProfile - error fetching user: ' + req.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            Account.findOne({_id: user.account}, function (err1, account) {
                if (err1) {
                    logger.logError('userController - getUserProfile - error fetching account: ' + req.email.toLowerCase());
                    logger.logError(err1);
                    return res.status(500).end();
                }
                return res.send({
                    email: req.email,
                    role: req.role.title,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    telephone: user.telephone,
                    type: account.type,
                    status: user.status
                });
            });
        });
    },

    verifyUser: function (req, res) {
        User.findOne({verificationCode: req.body.code}, function (err, user) {
            if (err) {
                logger.logError('userController - verifyUser - error fetching user: ' + req.body.code);
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
            if (user.hashedPassword) {
                user.status = 'active';
                user.verificationCode = undefined;
                user.save(function (err1) {
                    if (err1) {
                        logger.logError('userController - verifyUser - error saving user: ' + req.body.code);
                        logger.logError(err1);
                        return res.status(500).end();
                    }
                    return res.status(200).send('web-user');
                });
            } else {
                return res.status(200).send('merchant-user');
            }
        });
    },

    setPasswordAndVerifyUser: function (req, res) {
        User.findOne({verificationCode: req.body.code}, function (err, user) {
            if (err) {
                logger.logError('userController - setPasswordAndVerifyUser - error fetching user: ' + req.body.code);
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
            user.password = req.body.newPassword;
            user.status = 'active';
            user.verificationCode = undefined;
            user.save(function (err1) {
                if (err1) {
                    logger.logError('userController - setPasswordAndVerifyUser - error saving user: ' + req.body.code);
                    logger.logError(err1);
                    return res.status(500).end();
                }
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: user.email,
                    subject: config.passwordChangedEmailSubject[user.preferences.defaultLanguage],
                    html: sf(config.passwordChangedEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName)
                };
                email.sendEmail(mailOptions, function (err2) {
                    if (err2) {
                        logger.logError('userController - setPasswordAndVerifyUser - error sending password changed email to: ' + mailOptions.to);
                        logger.logError(err2);
                    } else {
                        logger.logInfo('userController - setPasswordAndVerifyUser - password changed email sent to ' + mailOptions.to);
                    }
                });
                return res.status(200).end();
            });
        });
    },

    forgotPassword: function (req, res) {
        User.findOne({email: req.body.email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError('userController - forgotPassword - error fetching user: ' + req.body.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            if (_.contains(['registered', 'failed'], user.status)) {
                return res.status(409).send('UserError');
            }
            user.resetPasswordCode = uuid.v4();
            user.save(function (err1) {
                if (err1) {
                    logger.logError('userController - forgotPassword - error saving user: ' + req.body.email.toLowerCase());
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
                email.sendEmail(mailOptions, function (err2) {
                    if (err2) {
                        logger.logError('userController - forgotPassword - error sending forgot password email to : ' + mailOptions.to);
                        logger.logError(err2);
                    } else {
                        logger.logInfo('userController - forgotPassword - forgot password email sent to ' + mailOptions.to);
                    }
                });
                return res.status(200).end();
            });
        });
    },

    checkResetCode: function (req, res) {
        User.findOne({resetPasswordCode: req.query.code}, function (err, user) {
            if (err) {
                logger.logError('userController - checkResetCode - error fetching user : ' + req.query.code);
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            if (_.contains(['registered', 'failed'], user.status)) {
                return res.status(409).send('UserError');
            }
            return res.status(200).end();
        });
    },

    resetPassword: function (req, res) {
        User.findOne({resetPasswordCode: req.body.code}, function (err, user) {
            if (err) {
                logger.logError('userController - resetPassword - error fetching user : ' + req.body.code);
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            if (_.contains(['registered', 'failed'], user.status)) {
                return res.status(409).send('UserError');
            }
            user.resetPasswordCode = undefined;
            user.password = req.body.newPassword;
            user.save(function (err1) {
                if (err1) {
                    logger.logError('userController - resetPassword - error saving user : ' + req.body.code);
                    logger.logError(err1);
                    return res.status(500).end();
                }
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: user.email,
                    subject: config.passwordChangedEmailSubject[user.preferences.defaultLanguage],
                    html: sf(config.passwordChangedEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName)
                };
                email.sendEmail(mailOptions, function (err2) {
                    if (err2) {
                        logger.logError('userController - resetPassword - error sending password changed email to: ' + mailOptions.to);
                        logger.logError(err2);
                    } else {
                        logger.logInfo('userController - resetPassword - password changed email sent to ' + mailOptions.to);
                    }
                });
                return res.status(200).end();
            });
        });
    },

    isSignUpAllowed: function (req, res) {
        User.findOne({email: req.query.email.toLowerCase()}).populate('account').exec(function (err, user) {
            if (err) {
                logger.logError('userController - isSignUpAllowed - error fetching user: ' + req.query.email.toLowerCase());
                logger.logError(err);
                return res.send(false);
            }
            if (user) {
                var type = req.query.type;
                if (type === 'free') {
                    if (user.status !== 'failed') {
                        return res.send(false);
                    } else {
                        return res.send(true);
                    }
                } else if (_.contains(['paid', 'comp'], user.account.type) && _.contains(['active', 'registered'], user.status)) {
                    return res.send(false);
                } else {
                    return res.send(true);
                }
            } else {
                return res.send(true);
            }
        });
    },

    resendVerification: function (req, res) {
        User.findOne({email: req.body.email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError('userController - resendVerification - error fetching user: ' + req.query.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            if (_.contains(['active', 'canceled', 'trial-ended', 'comp-ended'], user.status)) {
                return res.status(409).send('UserActivated');
            }
            if (user.status !== 'registered') {
                return res.status(409).send('UserError');
            }
            user.verificationCode = uuid.v4();
            user.save(function (err1) {
                if (err1) {
                    logger.logError('userController - resendVerification - error saving user: ' + req.query.email.toLowerCase());
                    logger.logError(err1);
                    return res.status(500).end();
                }
                var verificationUrl = config.url + 'verify-user?code=' + user.verificationCode;
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: user.email,
                    subject: config.accountVerificationEmailSubject[user.preferences.defaultLanguage],
                    html: sf(config.accountVerificationEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, verificationUrl)
                };
                email.sendEmail(mailOptions, function (err2) {
                    if (err2) {
                        logger.logError('userController - resendVerification - error sending resend verification email to: ' + mailOptions.to);
                        logger.logError(err2);
                    } else {
                        logger.logInfo('userController - resendVerification - resend verification email sent to ' + mailOptions.to);
                    }
                });
                res.status(200).end();
            });
        });
    },

    changePassword: function (req, res) {
        User.findOne({email: req.email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError('userController - changePassword - error fetching user: ' + req.email.toLowerCase());
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
            user.save(function (err1) {
                if (err1) {
                    logger.logError('userController - changePassword - error saving user: ' + req.email.toLowerCase());
                    logger.logError(err1);
                    return res.status(500).end();
                }
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: user.email,
                    subject: config.passwordChangedEmailSubject[user.preferences.defaultLanguage],
                    html: sf(config.passwordChangedEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName)
                };
                email.sendEmail(mailOptions, function (err2) {
                    if (err2) {
                        logger.logError('userController - changePassword - error sending password changed email to: ' + mailOptions.to);
                        logger.logError(err2);
                    } else {
                        logger.logInfo('userController - changePassword - password changed email sent to ' + mailOptions.to);
                    }
                });
                return res.status(200).end();
            });
        });
    },

    changeCreditCard: function (req, res) {
        User.findOne({email: req.email.toLowerCase()}).populate('account').exec(function (err, user) {
            if (err) {
                logger.logError('userController - changeCreditCard - error fetching user: ' + req.email.toLowerCase());
                logger.logError(err);
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
                    logger.logError('userController - changeCreditCard - error updating credit card in billing system: ' + req.email.toLowerCase());
                    logger.logError(err);
                    return res.status(500).end();
                }
                return res.status(200).end();
            });
        });
    },

    getAioToken: function (req, res) {
        var aioGuestList = config.aioGuestAccountList;
        var user = req.email ? req.email.toLowerCase() : aioGuestList[getGuestCounter()];
        aio.getToken(user, function (err, data) {
            if (err) {
                logger.logError('userController - getAioToken - error getting token from aio: ' + user);
                logger.logError(err);
                return res.status(500).end();
            }
            if (!req.email && data) {
                data.isGuest = true;
            }
            return res.send(data);
        });
    },

    getPreferences: function (req, res) {
        User.findOne({email: req.email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError('userController - getPreferences - error fetching user: ' + req.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            return res.send(user.preferences);
        });
    },

    updatePreferences: function (req, res) {
        User.findOne({email: req.email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError('userController - updatePreferences - error fetching user: ' + req.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            user.preferences.defaultLanguage = req.body.language;
            user.save(function (err1) {
                if (err1) {
                    logger.logError('userController - updatePreferences - error fetching user: ' + req.email.toLowerCase());
                    logger.logError(err1);
                    return res.status(500).end();
                }
                return res.status(200).end();
            });
        });
    },

    upgradeSubscription: function (req, res) {
        subscription.upgradeSubscription(req.email, req.body, function (err) {
            if (err) {
                logger.logError('userController - upgradeSubscription - error during upgrade subscription: ' + req.email);
                logger.logError(err);
                return res.status(500).send(err);
            }
            return res.status(200).end();
        });
    },

    reactivateSubscription: function (req, res) {
        subscription.reactivateSubscription(req.email, req.body, function (err) {
            if (err) {
                logger.logError('userController - reactivateSubscription - error during reactivate subscription: ' + req.email);
                logger.logError(err);
                return res.status(500).send(err);
            }
            return res.status(200).end();
        });
    },

    cancelSubscription: function (req, res) {
        subscription.cancelSubscription(req.email, function (err) {
            if (err) {
                logger.logError('userController - cancelSubscription - error during cancel subscription: ' + req.email);
                logger.logError(err);
                return res.status(500).send(err);
            }
            return res.status(200).end();
        });
    }
};

function getGuestCounter() {
    getGuestCounter.count = ++getGuestCounter.count || 0;
    if (getGuestCounter.count >= config.aioGuestAccountList.length) {
        getGuestCounter.count = 0;
    }
    return getGuestCounter.count;
}
