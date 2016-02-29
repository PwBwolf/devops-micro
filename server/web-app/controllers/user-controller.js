'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    sf = require('sf'),
    jwt = require('jwt-simple'),
    uuid = require('node-uuid'),
    async = require('async'),
    twilio = require('../../common/services/twilio'),
    logger = require('../../common/setup/logger'),
    moment = require('moment'),
    config = require('../../common/setup/config'),
    email = require('../../common/services/email'),
    subscription = require('../../common/services/subscription'),
    validation = require('../../common/services/validation'),
    billing = require('../../common/services/billing'),
    User = mongoose.model('User'),
    Merchant = mongoose.model('Merchant'),
    Account = mongoose.model('Account'),
    FavoriteChannel = mongoose.model('FavoriteChannel');

module.exports = {
    signUp: function (req, res) {
        var validationError = validation.validateSignUpInputs(req.body);
        if (validationError) {
            logger.logError('userController - signUp - user input error: ' + req.body.email);
            logger.logError(validationError);
            return res.status(500).end(validationError);
        }
        req.body.email = validation.getUsername(req.body.email);
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
                    switch (merchant.name) {
                        case 'IDT':
                            req.body.agentNum = 2;
                            break;
                        case 'TRUCONN':
                            req.body.agentNum = 3;
                            break;
                        case 'PERKSPOT':
                            req.body.agentNum = 4;
                            break;
                        case 'NEXTJUMP':
                            req.body.agentNum = 5;
                            break;
                        case 'CJ':
                            req.body.agentNum = 6;
                            break;
                        case 'MGCJK':
                            req.body.agentNum = 7;
                            break;
                        case 'AMAZON':
                            req.body.agentNum = 8;
                            break;
                        case 'UBS':
                            req.body.agentNum = 9;
                            break;
                    }
                    return doSignUp(req, res);
                }
            });
        } else {
            return doSignUp(req, res);
        }

        function doSignUp(req, res) {
            User.findOne({email: req.body.email.trim().toLowerCase()}).populate('account').exec(function (err, user) {
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
                                return res.status(500).send(err);
                            } else {
                                return res.status(200).send('registered');
                            }
                        });
                    } else if (type === 'paid') {
                        subscription.newPaidUser(req.body, function (err) {
                            if (err) {
                                logger.logError('userController - signUp - error in new paid user creation: ' + req.body.email.toLowerCase());
                                logger.logError(err);
                                return res.status(500).send(err);
                            } else {
                                return res.status(200).send('registered');
                            }
                        });
                    } else if (type === 'comp') {
                        subscription.newComplimentaryUser(req.body, function (err) {
                            if (err) {
                                logger.logError('userController - signUp - error in new complimentary user creation: ' + req.body.email.toLowerCase());
                                logger.logError(err);
                                return res.status(500).send(err);
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
                                return res.status(500).send(err);
                            } else {
                                return res.status(200).send(status);
                            }
                        });
                    } else if (type === 'comp' && user.account.type === 'free') {
                        subscription.convertToComplimentary(user.email, req.body, function (err, status) {
                            if (err) {
                                logger.logError('userController - signUp - error converting free to complimentary: ' + req.body.email.toLowerCase());
                                logger.logError(err);
                                return res.status(500).send(err);
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
        var email = validation.getUsername(req.body.email);
        User.findOne({email: email}).populate('account').exec(function (err, user) {
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
        var email = validation.getUsername(req.email);
        User.findOne({email: email}, function (err, user) {
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
                    type: account.type,
                    status: user.status,
                    packages: account.packages,
                    cancelOn: user.cancelOn
                });
            });
        });
    },

    isEmailVerified: function (req, res) {
        User.findOne({email: req.query.email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError('userController - isEmailVerified - error fetching user: ' + req.query.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            if (user.status === 'active') {
                return res.status(200).send(true);
            }
            if (user.status !== 'registered') {
                return res.status(409).send('UserError');
            }
            return res.status(200).send(false);
        });
    },

    verifyPin: function (req, res) {
        var email = validation.getUsername(req.body.email);
        User.findOne({email: email}, function (err, user) {
            if (err) {
                logger.logError('userController - verifyPin - error fetching user: ' + req.query.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            if (user.status === 'active') {
                return res.status(409).send('UserAlreadyVerified');
            }
            if (user.status !== 'registered') {
                return res.status(409).send('UserError');
            }
            if (user.verificationPin.toString() !== req.body.pin) {
                return res.status(401).send('IncorrectPin');
            }
            user.status = 'active';
            user.verificationPin = undefined;
            user.save(function (err) {
                if (err) {
                    logger.logError('userController - verifyPin - error saving user: ' + user.email);
                    logger.logError(err);
                    return res.status(500).end();
                }
                subscription.sendAccountVerifiedEmailSms(user);
                return res.status(200).end();
            });
        });
    },

    updateUserInfo: function (req, res) {
        var errorType, currentValues;
        async.waterfall([
            // update user
            function (callback) {
                User.findOne({email: req.email.toLowerCase()}).populate('account').exec(function (err, user) {
                    if (err) {
                        logger.logError('userController - updateUserInfo - error fetching user: ' + req.email.toLowerCase());
                        callback(err);
                    } else if (!user) {
                        callback('UserNotFound');
                    } else {
                        currentValues = {firstName: user.firstName, lastName: user.lastName};
                        user.firstName = req.body.firstName;
                        user.lastName = req.body.lastName;
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
                billing.login(user.email, user.account.key, user.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('userController - updateUserInfo - error logging into billing system: ' + user.email);
                        errorType = 'freeside-login';
                    }
                    callback(err, user, sessionId);
                });
            },
            // change first and last name in freeside
            function (user, sessionId, callback) {
                billing.updateInfo(sessionId, req.body.firstName, req.body.lastName, function (err) {
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
            });
        });
    },

    isSignUpAllowed: function (req, res) {
        var email = validation.getUsername(req.query.email);
        User.findOne({email: email}).populate('account').exec(function (err, user) {
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
        var email = validation.getUsername(req.body.email);
        User.findOne({email: email}, function (err, user) {
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
            user.verificationPin = Math.floor(Math.random() * 9000) + 1000;
            user.save(function (err) {
                if (err) {
                    logger.logError('userController - resendVerification - error saving user: ' + user.email);
                    logger.logError(err);
                    return res.status(500).end();
                }
                subscription.sendVerificationEmailSms(user, function (err) {
                    if (err) {
                        logger.logError('subscription - resendVerification - error sending verification sms/email: ' + user.email);
                        logger.logError(err);
                    } else {
                        logger.logInfo('subscription - resendVerification - verification sms/email sent: ' + user.email);
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
                if (validation.isUsPhoneNumberInternationalFormat(user.email)) {
                    var message = sf(config.passwordChangedSmsMessage[user.preferences.defaultLanguage], config.customerCareNumber);
                    twilio.sendSms(config.twilioSmsSendMobileNumber, user.email, message, function (err) {
                        if (err) {
                            logger.logError('userController - changePassword - error sending sms: ' + user.email);
                            logger.logError(err);
                        } else {
                            logger.logInfo('userController - changePassword - sent sms successfully: ' + user.email);
                        }
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
                }
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
            if (user.account.type === 'comp') {
                return res.status(409).send('CompUser');
            }
            async.waterfall([
                // login to freeside
                function (callback) {
                    billing.login(user.email, user.account.key, user.createdAt.getTime(), function (err, sessionId) {
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
        User.findOne({email: req.email.toLowerCase()}).populate('account').exec(function (err, user) {
            if (err) {
                logger.logError('userController - updatePreferences - error fetching user: ' + req.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            var currentValues = {
                defaultLanguage: user.preferences.defaultLanguage,
                emailSmsSubscription: user.preferences.emailSmsSubscription
            };
            user.preferences.defaultLanguage = req.body.defaultLanguage;
            user.preferences.emailSmsSubscription = req.body.emailSmsSubscription;
            user.save(function (err) {
                if (err) {
                    logger.logError('userController - updatePreferences - error fetching user: ' + req.email.toLowerCase());
                    logger.logError(err);
                    return res.status(500).end();
                }
                billing.login(user.email, user.account.key, user.createdAt.getTime(), function (err, sessionId) {
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

    updateLanguage: function (req, res) {
        User.findOne({email: req.email.toLowerCase()}).populate('account').exec(function (err, user) {
            if (err) {
                logger.logError('userController - updateLanguage - error fetching user: ' + req.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            var currentValues = {defaultLanguage: user.preferences.defaultLanguage};
            user.preferences.defaultLanguage = req.body.defaultLanguage;
            user.save(function (err) {
                if (err) {
                    logger.logError('userController - updateLanguage - error fetching user: ' + req.email.toLowerCase());
                    logger.logError(err);
                    return res.status(500).end();
                }
                billing.login(user.email, user.account.key, user.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('userController - updateLanguage - error logging into freeside: ' + req.email.toLowerCase());
                        logger.logError(err);
                        rollbackLanguage(user, currentValues);
                        return res.status(500).end();
                    }
                    billing.updateLocale(sessionId, user.preferences.defaultLanguage + '_US', function (err) {
                        if (err) {
                            logger.logError('userController - updateLanguage - error updating locale in freeside: ' + req.email.toLowerCase());
                            logger.logError(err);
                            rollbackLanguage(user, currentValues);
                            return res.status(500).end();
                        }
                        return res.status(200).end();
                    });
                });
            });
        });

        function rollbackLanguage(user, currentValues, cb) {
            user.preferences.defaultLanguage = currentValues.defaultLanguage;
            user.preferences.emailSubscription = currentValues.emailSubscription;
            user.preferences.smsSubscription = currentValues.smsSubscription;
            user.save(function (err) {
                if (err) {
                    if (err) {
                        logger.logError('userController - updateLanguage - error rolling back update: ' + user.email);
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
    },

    getEmailSmsSubscriptionStatus: function (req, res) {
        var validationError = validation.validateGetEmailSmsSubscriptionStatusInputs(req.query.email);
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
                var preferences = {
                    emailSubscription: user.preferences.emailSubscription,
                    smsSubscription: user.preferences.smsSubscription
                };
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
    },

    getFavoriteChannels: function (req, res) {
        FavoriteChannel.findOne({email: req.email.toLowerCase()}, function (err, data) {
            if (err) {
                logger.logError('userController - getFavoriteChannels - error finding user: ' + req.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }

            var favoriteChannels = [];
            if (data && data.channels.length > 0) {
                for (var i = 0; i < data.channels.length; ++i) {
                    favoriteChannels.push({channelId: data.channels[i].channelId});
                }
            }
            return res.send(favoriteChannels);
        });
    },

    addFavoriteChannel: function (req, res) {
        FavoriteChannel.findOne({email: req.email.toLowerCase()}, function (err, data) {
            if (err) {
                logger.logError('userController - addFavoriteChannel - error finding user: ' + req.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            if (!data) {
                var favoriteChannel = new FavoriteChannel();
                favoriteChannel.email = req.email.toLowerCase();
                favoriteChannel.channels.push({channelId: req.query.channelId, userType: 0});
                favoriteChannel.save(function (err) {
                    if (err) {
                        logger.logError('userController - addFavoriteChannel - error save favorite channel for user: ' + req.email.toLowerCase());
                        logger.logError(err);
                        return res.status(500).send('failed to save to db to add the favorite channel!');
                    } else {
                        logger.logInfo('userController - addFavoriteChannel - succeed to add favorite channel for use: ' + req.email.toLowerCase());
                        return res.status(200).end();
                    }
                });
            } else {
                var channelFound = false;
                for (var i = 0; i < data.channels.length; ++i) {
                    if (data.channels[i].channelId === req.query.channelId && data.channels[i].userType === 0) {
                        channelFound = true;
                        break;
                    }
                }
                if (channelFound) {
                    return res.status(200).send('favorite channel exists!');
                } else {
                    data.channels.push({channelId: req.query.channelId, userType: 0});
                    data.save(function (err) {
                        if (err) {
                            logger.logError('userController - addFavoriteChannel - error save favorite channel for user: ' + req.email.toLowerCase());
                            logger.logError(err);
                            return res.status(500).send('failed to save to db to add the favorite channel!');
                        } else {
                            logger.logInfo('userController - addFavoriteChannel - succeed to add favorite channel for use: ' + req.email.toLowerCase());
                            return res.status(200).end();
                        }
                    });
                }
            }
        });
    },

    removeFavoriteChannel: function (req, res) {
        FavoriteChannel.findOne({email: req.email.toLowerCase()}, function (err, data) {
            if (err) {
                logger.logError('userController - removeFavoriteChannel - error finding user: ' + req.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            if (!data) {
                return res.status(404).send('UserNotFound');
            } else {
                var index = _.findIndex(data.channels, {channelId: req.query.channelId, userType: 0});
                if (index >= 0) {
                    data.channels.splice(index, 1);
                    data.save(function (err) {
                        if (err) {
                            logger.logError('userController - removeFavoriteChannel - error remove favorite channel: ' + req.chanelId);
                            logger.logError(err);
                            return res.status(500).send('failed to save to db to remove the favorite channel!');
                        } else {
                            logger.logInfo('userController - removeFavoriteChannel - succeed to remove favorite channel: ' + req.query.channelId);
                            return res.status(200).end();
                        }
                    });
                } else {
                    logger.logInfo('userController - removeFavoriteChannel - favorite channel could not be found: ' + req.chanelId);
                    return res.status(500).send('favorite channel could not be found!');
                }
            }
        });
    }
};

function addFreeTvCampaign(user, cb) {
    var freeSideSessionId;
    async.waterfall([
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
            billing.login(user.email, user.account.key, user.createdAt.getTime(), function (err, sessionId) {
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
