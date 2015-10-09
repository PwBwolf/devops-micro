'use strict';

var mongoose = require('mongoose'),
    sf = require('sf'),
    jwt = require('jwt-simple'),
    logger = require('../../common/setup/logger'),
    moment = require('moment'),
    config = require('../../common/setup/config'),
    email = require('../../common/services/email'),
    CrmUser = mongoose.model('CrmUser');

module.exports = {
    signIn: function (req, res) {
        CrmUser.findOne({email: req.body.email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError('userController - signIn - error fetching user: ' + req.body.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(401).send('SignInFailed');
            }
            if (user.status !== 'active') {
                return res.status(401).send('SignInFailed');
            }
            if (!user.authenticate(req.body.password)) {
                return res.status(401).send('SignInFailed');
            }
            user.lastLoginTime = (new Date()).toUTCString();
            user.save(function (err) {
                if (err) {
                    logger.logError('userController - signIn - error saving user lastLoginTime: ' + req.body.email.toLowerCase());
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
        CrmUser.findOne({email: req.email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError('userController - getUserProfile - error fetching user: ' + req.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            return res.send({
                email: req.email,
                role: req.role.title,
                firstName: user.firstName,
                lastName: user.lastName,
                status: user.status,
                changePassword: user.changePassword
            });
        });
    },

    changePassword: function (req, res) {
        CrmUser.findOne({email: req.email.toLowerCase()}, function (err, user) {
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
            user.save(function (err) {
                if (err) {
                    logger.logError('userController - changePassword - error saving user: ' + req.email.toLowerCase());
                    logger.logError(err);
                    return res.status(500).end();
                }
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: user.email,
                    subject: config.crmPasswordChangedEmailSubject[user.preferences.defaultLanguage],
                    html: sf(config.crmPasswordChangedEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.customerCareNumber)
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
            });
        });
    },

    updateLanguage: function (req, res) {
        CrmUser.findOne({email: req.email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError('userController - updateLanguage - error fetching user: ' + req.email.toLowerCase());
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
            }
            user.preferences.defaultLanguage = req.body.defaultLanguage;
            user.save(function (err) {
                if (err) {
                    logger.logError('userController - updateLanguage - error fetching user: ' + req.email.toLowerCase());
                    logger.logError(err);
                    return res.status(500).end();
                }
                return res.status(200).end();
            });
        });
    }
};
