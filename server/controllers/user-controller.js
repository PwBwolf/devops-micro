'use strict';

var mongoose = require('mongoose'),
    sf = require('sf'),
    _ = require('lodash'),
    validator = require('validator'),
    async = require('async'),
    jwt = require('jwt-simple'),
    uuid = require('node-uuid'),
    logger = require('../config/logger'),
    moment = require('moment'),
    config = require('../config/config'),
    email = require('../services/email'),
    userRoles = require('../../client/scripts/config/routing').userRoles,
    User = mongoose.model('User'),
    Account = mongoose.model('Account'),
    Visitor = mongoose.model('Visitor');

exports.signUp = function (req, res) {

    async.waterfall([
        // create user in db
        function (callback) {
            User.findOne({email: req.body.email}, function (err, user) {
                if (err) {
                    callback('Error');
                } else if (!user) {
                    var userObj = new User(req.body);
                    userObj.role = userRoles.user;
                    userObj.createdAt = (new Date()).toUTCString();
                    userObj.verificationCode = uuid.v4();
                    userObj.save(function (err) {
                        if (err) {
                            callback(err);
                        }
                        callback(null, userObj);
                    });
                } else {
                    callback('UserExists');
                }
            });
        },
        // create account in db
        function (userObj, callback) {
            var accountObj = new Account({primaryUser: userObj, users: [userObj], createdAt: (new Date()).toUTCString()});
            accountObj.save(function (err) {
                if (err) {
                    logger.logError(err);
                    // if account creation fails delete user as well
                    userObj.remove(function (err) {
                        callback(err);
                    });
                }
                userObj.account = accountObj;
                userObj.save(function (err) {
                    if (err) {
                        callback(err);
                    }
                    callback(null, userObj, accountObj);
                });
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
                    logger.logError(err);
                }
            });
            callback(null, userObj, accountObj);
        },
        // delete user from visitor
        function (userObj, accountObj, callback) {
            Visitor.findOne({email: userObj.email}, function (err, visitor) {
                if (err) {
                    callback(err);
                }
                if (visitor) {
                    visitor.remove(function (err) {
                        if (err) {
                            logger.logError(err);
                        }
                        callback(null, userObj, accountObj);
                    });
                }
                callback(null, userObj, accountObj);
            });
        }
    ], function (err) {
        if (err) {
            logger.logError(err);
            return res.status(500).send(JSON.stringify(err));
        }
        return res.status(200).end();
    });
};

exports.signIn = function (req, res) {
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
        if (!user.activated) {
            return res.status(401).send('UnverifiedAccount');
        }
        user.lastSignedInDate = (new Date()).toUTCString();
        user.save(function (err) {
            if (err) {
                logger.logError(err);
            }
        });
        var token = jwt.encode({
            email: req.body.email,
            role: userRoles.user,
            expiry: moment().add(7, 'days').valueOf()
        }, config.secretToken);
        return res.json({token: token});
    });
};

exports.signOut = function (req, res) {
    req.logout();
    return res.status(200).end();
};

exports.getUserProfile = function (req, res) {
    User.findOne({email: req.email}, function (err, user) {
        if (err) {
            logger.logError(err);
            return res.status(500).end();
        }
        if (!user) {
            return res.status(404).send('UserNotFound');
        }
        return res.send({email: req.email, role: req.role.title, firstName: user.firstName, lastName: user.lastName});
    });
};

exports.verifyUser = function (req, res) {
    User.findOne({verificationCode: req.body.code}, function (err, user) {
        if (err) {
            logger.logError(err);
            return res.status(500).end();
        }
        if (!user) {
            return res.status(404).send('UserNotFound');
        }
        user.activated = true;
        user.verificationCode = undefined;
        user.save(function (err) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            return res.status(200).end();
        });
    });
};

exports.forgotPassword = function (req, res) {
    User.findOne({email: req.body.email}, function (err, user) {
        if (err) {
            logger.logError(err);
            return res.status(500).end();
        }
        if (!user) {
            return res.status(404).send('UserNotFound');
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
};

exports.checkResetCode = function(req, res) {
    console.log(req.query.code);
    User.findOne({resetPasswordCode: req.query.code}, function (err, user) {
        if (err) {
            logger.logError(err);
            return res.status(500).end();
        }
        console.dir(user);
        if (!user) {
            return res.status(404).send('UserNotFound');
        }
        return res.status(200).end();
    });
};

exports.resetPassword = function (req, res) {
    User.findOne({resetPasswordCode: req.body.code}, function (err, user) {
        if (err) {
            logger.logError(err);
            return res.status(500).end();
        }
        if (!user) {
            return res.status(404).send('UserNotFound');
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
};

exports.isEmailUnique = function (req, res) {
    User.findOne({email: req.query.email}, function (err, user) {
        if (err) {
            logger.logError(err);
            return res.send(false);
        }
        if (!user) {
            if (validator.isEmail(req.query.email)) {
                Visitor.findOne({email: req.query.email}, function (err, visitor) {
                    if (err) {
                        logger.error(JSON.stringify(err));
                    }
                    if (!visitor) {
                        var visitorObj = new Visitor({email: req.query.email, firstName: req.query.firstName, lastName: req.query.lastName});
                        visitorObj.save(function (err) {
                            if (err) {
                                logger.error(JSON.stringify(err));
                            }
                        });
                    } else {
                        if (req.query.firstName) {
                            visitor.firstName = req.query.firstName;
                        }
                        if (req.query.lastName) {
                            visitor.lastName = req.query.lastName;
                        }
                        if (req.query.firstName || req.query.lastName) {
                            visitor.save(function (err) {
                                if (err) {
                                    logger.logError(err);
                                }
                            });
                        }
                    }
                });
            }
            return res.send(true);
        } else {
            return res.send(false);
        }
    });
};

exports.resendVerification = function (req, res) {
    User.findOne({email: req.body.email}, function (err, user) {
        if (err) {
            logger.logError(err);
            return res.status(500).end();
        }
        if (!user) {
            return res.status(404).send('UserNotFound');
        }
        if (user.activated) {
            return res.status(409).send('AccountActivated');
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
};

exports.changePassword = function (req, res) {
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
};

exports.changeCreditCard = function (req, res) {
    return res.status(200).end();
};
