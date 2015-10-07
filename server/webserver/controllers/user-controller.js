'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    sf = require('sf'),
    jwt = require('jwt-simple'),
    uuid = require('node-uuid'),
    async = require('async'),
    logger = require('../../common/setup/logger'),
    moment = require('moment'),
    config = require('../../common/setup/config'),
    email = require('../../common/services/email'),
    subscription = require('../../common/services/subscription'),
    validation = require('../../common/services/validation'),
    aio = require('../../common/services/aio'),
    billing = require('../../common/services/billing'),
    User = mongoose.model('User'),
    Merchant = mongoose.model('Merchant'),
    Account = mongoose.model('Account');

module.exports = {
    signUp: function (req, res) {
        var validationError = validation.validateSignUpInputs(req.body);
        if (validationError) {
            logger.logError('userController - signUp - user input error: ' + req.body.email);
            logger.logError(validationError);
            return res.status(500).end(validationError);
        }
        if (req.body.merchant) {
            Merchant.findOne({name: req.body.merchant.toUpperCase()}, function (err, merchant) {
                if (err) {
                    logger.logError('userController - signUp - error fetching merchant: ' + req.body.email.toLowerCase());
                    logger.logError(err);
                    return res.status(500).end();
                } else if (!merchant) {
                    logger.logError('userController - signUp - merchant not found: ' + req.body.email.toLowerCase());
                    return res.status(500).send('InvalidMerchant');
                } else {
                    return doSignUp(req, res);
                }
            });
        } else {
            return doSignUp(req, res);
        }

        function doSignUp(req, res) {
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
                                return res.status(500).send(err.message);
                            } else {
                                return res.status(200).send('registered');
                            }
                        });
                    } else if (type === 'paid') {
                        subscription.newPaidUser(req.body, function (err) {
                            if (err) {
                                logger.logError('userController - signUp - error in new paid user creation: ' + req.body.email.toLowerCase());
                                logger.logError(err);
                                return res.status(500).send(err.message);
                            } else {
                                return res.status(200).send('registered');
                            }
                        });
                    } else if (type === 'comp') {
                        subscription.newComplimentaryUser(req.body, function (err) {
                            if (err) {
                                logger.logError('userController - signUp - error in new complimentary user creation: ' + req.body.email.toLowerCase());
                                logger.logError(err);
                                return res.status(500).send(err.message);
                            } else {
                                return res.status(200).send('registered');
                            }
                        });
                    } else {
                        logger.logError('userController - signUp - invalid type + ' + type + ': ' + req.body.email.toLowerCase());
                        return res.status(500).end();
                    }
                } else {
                    if (user.status === 'failed') {
                        logger.logError('userController - signUp - user with failed status: ' + req.body.email.toLowerCase());
                        return res.status(409).send('FailedAccount');
                    } else if (type === 'free') {
                        logger.logError('userController - signUp - re-sign up of free non-failed user not allowed: ' + req.body.email.toLowerCase());
                        return res.status(409).send('UserExists');
                    } else if (type === 'paid' && user.account.type === 'free') {
                        subscription.upgradeSubscription(user.email, req.body, function (err, status) {
                            if (err) {
                                logger.logError('userController - signUp - error in upgrade subscription from free to paid: ' + req.body.email.toLowerCase());
                                logger.logError(err);
                                return res.status(500).send(err.message);
                            } else {
                                return res.status(200).send(status);
                            }
                        });
                    } else if (type === 'comp' && user.account.type === 'free') {
                        subscription.convertToComplimentary(user.email, req.body, function (err, status) {
                            if (err) {
                                logger.logError('userController - signUp - error converting free to complimentary: ' + req.body.email.toLowerCase());
                                logger.logError(err);
                                return res.status(500).send(err.message);
                            } else {
                                return res.status(200).send(status);
                            }
                        });
                    } else {
                        return res.status(409).send('UserExists');
                    }
                }
            });
        }
    },

    signIn: function (req, res) {
        User.findOne({email: req.body.email.toLowerCase()}).populate('account').exec(function (err, user) {
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
            user.lastLoginTime = (new Date()).toUTCString();
            user.save(function (err) {
                if (err) {
                    logger.logError('userController - signIn - error saving user lastLoginTime: ' + req.body.email.toLowerCase());
                    logger.logError(err);
                }
            });
            if (user.oldInactiveUser && user.oldInactiveUser > 0) {
                addFreeTvCampaign(user);
            }
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
            Account.findOne({_id: user.account}, function (err, account) {
                if (err) {
                    logger.logError('userController - getUserProfile - error fetching account: ' + req.email.toLowerCase());
                    logger.logError(err);
                    return res.status(500).end();
                }
                return res.send({
                    email: req.email,
                    role: req.role.title,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    telephone: user.telephone,
                    type: account.type,
                    status: user.status,
                    packages: account.packages,
                    cancelOn: user.cancelOn
                });
            });
        });
    },

    updateUserInfo: function (req, res) {
        var errorType, currentValues;
        async.waterfall([
            // update user
            function (callback) {
                User.findOne({email: req.email.toLowerCase()}).exec(function (err, user) {
                    if (err) {
                        logger.logError('userController - updateUserInfo - error fetching user: ' + req.email.toLowerCase());
                        callback(err);
                    } else if (!user) {
                        callback('UserNotFound');
                    } else {
                        currentValues = {firstName: user.firstName, lastName: user.lastName, telephone: user.telephone};
                        user.firstName = req.body.firstName;
                        user.lastName = req.body.lastName;
                        user.telephone = req.body.telephone;
                        user.save(function (err) {
                            if (err) {
                                logger.logError('userController - updateUserInfo - error saving user: ' + req.email.toLowerCase());
                            }
                            callback(err, user);
                        });
                    }
                });
            },
            // login to freeside
            function (user, callback) {
                billing.login(user.email, user.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('userController - updateUserInfo - error logging into billing system: ' + user.email);
                        errorType = 'freeside-login';
                    }
                    callback(err, user, sessionId);
                });
            },
            // change billing address
            function (user, sessionId, callback) {
                billing.updateInfo(sessionId, req.body.firstName, req.body.lastName, req.body.telephone, function (err) {
                    if (err) {
                        logger.logError('userController - updateUserInfo - error updating billing system: ' + user.email);
                        errorType = 'freeside-user-update';
                    }
                    callback(err, user);
                });
            }
        ], function (err, user) {
            if (err) {
                logger.logError(err);
                if (errorType === 'freeside-user-update' || errorType === 'freeside-login') {
                    user.firstName = currentValues.firstName;
                    user.lastName = currentValues.lastName;
                    user.telephone = currentValues.telephone;
                    user.save(function (err) {
                        if (err) {
                            logger.logError('userController - updateUserInfo - error reverting user: ' + req.email.toLowerCase());
                            logger.logError(err);
                        }
                    });
                }
                return res.status(500).end();
            }
            return res.status(200).end();
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
            var status = user.status;
            var verificationCode = user.verificationCode;
            user.status = 'active';
            user.verificationCode = undefined;
            user.save(function (err) {
                if (err) {
                    logger.logError('userController - verifyUser - error saving user: ' + req.body.code);
                    logger.logError(err);
                    return res.status(500).end();
                }
                aio.updateUserStatus(user.email, true, function (err) {
                    if (err) {
                        logger.logError('userController - verifyUser - error setting user active in aio: ' + user.email);
                        logger.logError(err);
                        user.status = status;
                        user.verificationCode = verificationCode;
                        user.save(function (err) {
                            if (err) {
                                logger.logError('userController - verifyUser - error reverting user: ' + user.email);
                                logger.logError(err);
                            }
                            return res.status(500).end();
                        });
                    } else {
                        subscription.sendAccountVerifiedEmail(user);
                        return res.status(200).send();
                    }
                });
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
            user.save(function (err) {
                if (err) {
                    logger.logError('userController - forgotPassword - error saving user: ' + req.body.email.toLowerCase());
                    logger.logError(err);
                    return res.status(500).end();
                }
                var resetUrl = config.url + 'reset-password?code=' + user.resetPasswordCode;
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: user.email,
                    subject: config.forgotPasswordEmailSubject[user.preferences.defaultLanguage],
                    html: sf(config.forgotPasswordEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.customerCareNumber, resetUrl)
                };
                email.sendEmail(mailOptions, function (err) {
                    if (err) {
                        logger.logError('userController - forgotPassword - error sending forgot password email to : ' + mailOptions.to);
                        logger.logError(err);
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
                logger.logError('userController - resetPassword - error fetching user: ' + req.body.code);
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            if (_.contains(['registered', 'failed'], user.status)) {
                return res.status(409).send('UserError');
            }
            var resetPasswordCode = user.resetPasswordCode;
            var hashedPassword = user.hashedPassword;
            var salt = user.salt;
            user.resetPasswordCode = undefined;
            user.password = req.body.newPassword;
            user.save(function (err) {
                if (err) {
                    logger.logError('userController - resetPassword - error saving user: ' + req.body.code);
                    logger.logError(err);
                    return res.status(500).end();
                }
                aio.updatePassword(user.email, req.body.newPassword, function (err) {
                    if (err) {
                        logger.logError('userController - resetPassword - error updating password in aio: ' + req.body.code);
                        logger.logError(err);
                        user.resetPasswordCode = resetPasswordCode;
                        user.hashedPassword = hashedPassword;
                        user.salt = salt;
                        user.save(function (err) {
                            if (err) {
                                logger.logError('userController - resetPassword - error reverting password in db: ' + req.body.code);
                                logger.logError(err);
                            }
                            return res.status(500).end();
                        });
                    } else {
                        var mailOptions = {
                            from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                            to: user.email,
                            subject: config.passwordChangedEmailSubject[user.preferences.defaultLanguage],
                            html: sf(config.passwordChangedEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.customerCareNumber)
                        };
                        email.sendEmail(mailOptions, function (err) {
                            if (err) {
                                logger.logError('userController - resetPassword - error sending password changed email to: ' + mailOptions.to);
                                logger.logError(err);
                            } else {
                                logger.logInfo('userController - resetPassword - password changed email sent to ' + mailOptions.to);
                            }
                        });
                        return res.status(200).end();
                    }
                });
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
            if (_.contains(['active'], user.status)) {
                return res.status(409).send('UserActivated');
            }
            if (user.status !== 'registered') {
                return res.status(409).send('UserError');
            }
            user.verificationCode = uuid.v4();
            user.save(function (err) {
                if (err) {
                    logger.logError('userController - resendVerification - error saving user: ' + req.query.email.toLowerCase());
                    logger.logError(err);
                    return res.status(500).end();
                }
                var verificationUrl = config.url + 'verify-user?code=' + user.verificationCode;
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: user.email,
                    subject: config.accountVerificationEmailSubject[user.preferences.defaultLanguage],
                    html: sf(config.accountVerificationEmailBody[user.preferences.defaultLanguage], config.imageUrl, config.customerCareNumber, verificationUrl)
                };
                email.sendEmail(mailOptions, function (err) {
                    if (err) {
                        logger.logError('userController - resendVerification - error sending resend verification email to: ' + mailOptions.to);
                        logger.logError(err);
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
            var hashedPassword = user.hashedPassword;
            var salt = user.salt;
            user.password = req.body.newPassword;
            user.save(function (err) {
                if (err) {
                    logger.logError('userController - changePassword - error saving user: ' + req.email.toLowerCase());
                    logger.logError(err);
                    return res.status(500).end();
                }
                aio.updatePassword(user.email, req.body.newPassword, function (err) {
                    if (err) {
                        logger.logError('userController - changePassword - error updating password in aio: ' + req.body.code);
                        logger.logError(err);
                        user.hashedPassword = hashedPassword;
                        user.salt = salt;
                        user.save(function (err) {
                            if (err) {
                                logger.logError('userController - changePassword - error reverting password in db: ' + req.body.code);
                                logger.logError(err);
                            }
                            return res.status(500).end();
                        });
                    } else {
                        var mailOptions = {
                            from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                            to: user.email,
                            subject: config.passwordChangedEmailSubject[user.preferences.defaultLanguage],
                            html: sf(config.passwordChangedEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.customerCareNumber)
                        };
                        email.sendEmail(mailOptions, function (err) {
                            if (err) {
                                logger.logError('userController - changePassword - error sending password changed email to: ' + mailOptions.to);
                                logger.logError(err);
                            } else {
                                logger.logInfo('userController - changePassword - password changed email sent to ' + mailOptions.to);
                            }
                        });
                        return res.status(200).end();
                    }
                });
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
            if (user.account.type === 'comp') {
                return res.status(409).send('CompUser');
            }
            async.waterfall([
                // login to freeside
                function (callback) {
                    billing.login(user.email, user.createdAt.getTime(), function (err, sessionId) {
                        if (err) {
                            logger.logError('userController - changeCreditCard - error logging into billing system: ' + user.email);
                        }
                        callback(err, sessionId);
                    });
                },
                // update credit card
                function (sessionId, callback) {
                    billing.updateBilling(sessionId, req.body.address, req.body.city, req.body.state, req.body.zipCode, 'US', 'CARD', req.body.cardNumber, req.body.expiryDate, req.body.cvv, req.body.cardName, function (err) {
                        if (err) {
                            logger.logError('userController - changeCreditCard - error updating credit card in billing system: ' + user.email);
                        }
                        callback(err, sessionId);
                    });
                },
                // send email
                function (sessionId, callback) {
                    var mailOptions = {
                        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                        to: user.email,
                        subject: config.changeCreditCardEmailSubject[user.preferences.defaultLanguage],
                        html: sf(config.changeCreditCardEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.customerCareNumber)
                    };
                    email.sendEmail(mailOptions, function (err) {
                        if (err) {
                            logger.logError('userController - changeCreditCard - error sending email: ' + user.email);
                            logger.logError(err);
                        } else {
                            logger.logInfo('userController - changeCreditCard - email sent successfully: ' + user.email);
                        }
                    });
                    callback(null, sessionId);
                }
            ], function (err) {
                if (err) {
                    logger.logError(err);
                    return res.status(500).end();
                } else {
                    return res.status(200).end();
                }
            });
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
            var currentValues = {defaultLanguage: user.preferences.defaultLanguage, emailSubscription: user.preferences.emailSubscription, smsSubscription: user.preferences.smsSubscription};
            user.preferences.defaultLanguage = req.body.defaultLanguage;
            user.preferences.emailSubscription = req.body.emailSubscription;
            user.preferences.smsSubscription = req.body.smsSubscription;
            user.save(function (err) {
                if (err) {
                    logger.logError('userController - updatePreferences - error fetching user: ' + req.email.toLowerCase());
                    logger.logError(err);
                    return res.status(500).end();
                }
                billing.login(user.email, user.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('userController - updatePreferences - error logging into freeside: ' + req.email.toLowerCase());
                        logger.logError(err);
                        rollbackPreferences(user, currentValues);
                        return res.status(500).end();
                    }
                    billing.updateLocale(sessionId, user.preferences.defaultLanguage + '_US', function (err) {
                        if (err) {
                            logger.logError('userController - updatePreferences - error updating locale in freeside: ' + req.email.toLowerCase());
                            logger.logError(err);
                            rollbackPreferences(user, currentValues);
                            return res.status(500).end();
                        }
                        return res.status(200).end();
                    });
                });
            });
        });

        function rollbackPreferences(user, currentValues, cb) {
            user.preferences.defaultLanguage = currentValues.defaultLanguage;
            user.preferences.emailSubscription = currentValues.emailSubscription;
            user.preferences.smsSubscription = currentValues.smsSubscription;
            user.save(function (err) {
                if (err) {
                    if (err) {
                        logger.logError('userController - updatePreferences - error rolling back update: ' + user.email);
                        logger.logError(err);
                    }
                    if (cb) {
                        cb(err);
                    }
                }
            });
        }
    },

    upgradeSubscription: function (req, res) {
        subscription.upgradeSubscription(req.email, req.body, function (err) {
            if (err) {
                logger.logError('userController - upgradeSubscription - error during upgrade subscription: ' + req.email);
                logger.logError(err);
                return res.status(500).send(err.message);
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
            return res.send(data);
        });
    },

    getEmailSmsSubscriptionStatus: function (req, res) {
        var validationError = validation.validateGetEmailSmsSubscriptionStatusInputs(req.query);
        if (validationError) {
            logger.logError('userController - getEmailSmsSubscriptionStatus - user input error: ' + req.body.email);
            logger.logError(validationError);
            return res.status(500).end(validationError);
        }
        User.findOne({email: req.query.email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError('userController - getEmailSmsSubscriptionStatus - error fetching user: ' + req.query.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            if (user) {
                var preferences = {emailSubscription: user.preferences.emailSubscription, smsSubscription: user.preferences.smsSubscription};
                return res.send(preferences);
            } else {
                return res.status(404).send('UserNotFound');
            }
        });
    },

    setEmailSmsSubscriptionStatus: function (req, res) {
        var validationError = validation.validateSetEmailSmsSubscriptionStatusInputs(req.body);
        if (validationError) {
            logger.logError('userController - setEmailSmsSubscriptionStatus - user input error: ' + req.body.email);
            logger.logError(validationError);
            return res.status(500).end(validationError);
        }
        User.findOne({email: req.body.email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError('userController - setEmailSmsSubscriptionStatus - error fetching user: ' + req.body.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            if (user) {
                if (typeof req.body.emailSubscription === 'boolean') {
                    user.preferences.emailSubscription = req.body.emailSubscription;
                }
                if (typeof req.body.smsSubscription === 'boolean') {
                    user.preferences.smsSubscription = req.body.smsSubscription;
                }
                user.save(function (err) {
                    if (err) {
                        logger.logError('userController - setEmailSmsSubscriptionStatus - error saving user preference: ' + req.body.email.toLowerCase());
                        logger.logError(err);
                        return res.status(500).end();
                    }
                    return res.status(200).end();
                });
            } else {
                return res.status(404).send('UserNotFound');
            }
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

function addFreeTvCampaign(user, cb) {
    var freeSideSessionId;
    async.waterfall([
        function (callback) {
            aio.updateUserStatus(user.email, true, function (err) {
                if (err) {
                    logger.logError('userController - addFreeTvCampaign - error changing user to active: ' + user.email);
                    logger.logError(err);
                }
                callback(null);
            });
        },
        function (callback) {
            user.oldInactiveUser = user.oldInactiveUser * -1;
            user.account.startDate = (new Date()).toUTCString();
            user.account.premiumEndDate = moment(user.account.startDate).add(7, 'days');
            user.save(function (err) {
                if (err) {
                    logger.logError('userController - addFreeTvCampaign - error saving user: ' + user.email);
                    logger.logError(err);
                }
                callback(null);
            });
        },
        function (callback) {
            user.account.save(function (err) {
                if (err) {
                    logger.logError('userController - addFreeTvCampaign - error saving account: ' + user.email);
                    logger.logError(err);
                }
                callback(null);
            });
        },
        function (callback) {
            billing.login(user.email, user.createdAt.getTime(), function (err, sessionId) {
                if (err) {
                    logger.logError('userController - addFreeTvCampaign - error logging into freeside: ' + user.email);
                    logger.logError(err);
                }
                freeSideSessionId = sessionId;
                callback(null);
            });
        },
        function (callback) {
            billing.orderPackage(freeSideSessionId, config.freeSidePremiumPackagePart, function (err) {
                if (err) {
                    logger.logError('userController - addFreeTvCampaign - error adding premium package: ' + user.email);
                    logger.logError(err);
                }
                callback(null);
            });
        }
    ], function (err) {
        if (cb) {
            cb(err);
        }
    });
}
