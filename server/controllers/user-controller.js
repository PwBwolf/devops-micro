'use strict';

var mongoose = require('mongoose'),
    sf = require('sf'),
    validator = require('validator'),
    async = require('async'),
    jwt = require('jwt-simple'),
    uuid = require('node-uuid'),
    logger = require('../config/logger'),
    moment = require('moment'),
    config = require('../config/config'),
    email = require('../utils/email'),
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
                    callback(err);
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
            var verificationUrl = config.url + 'verify-account?code=' + userObj.verificationCode;
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
    User.findOne({email: req.body.email}, function (err, user) {

    });
    if (req.body.email === 'admin@yiptv.com' && req.body.password === 'admin') {
        var token = jwt.encode({
            email: req.body.email,
            role: userRoles.user,
            expiry: moment().add(7, 'days').valueOf()
        }, config.secretToken);
        return res.json({user: req.email, token: token});
    }
    return res.json(401, 'SignInFailed');
    /*passport.authenticate('local', function (err, user) {
     if (err) {
     return res.send(500, err.message);
     }
     if (!user) {
     return res.send(401, 'Login failed');
     }
     req.logIn(user, function (err) {
     if (err) {
     return res.send(500, err.message);
     }
     if (req.body.rememberMe) {
     req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
     }
     return res.json(200, { 'role': user.role, 'email': user.email });
     });
     })(req, res);*/
};

exports.signOut = function (req, res) {
    req.logout();
    return res.status(200).end();
};

exports.getUserProfile = function (req, res) {
    return res.send({email: req.email, role: req.role.title, firstName: 'YipTV', lastName: 'Admin'});
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
