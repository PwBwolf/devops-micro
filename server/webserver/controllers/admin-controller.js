'use strict';

var mongoose = require('mongoose'),
    logger = require('../../common/config/logger'),
    config = require('../../common/config/config'),
    sf = require('sf'),
    email = require('../../common/services/email'),
    User = mongoose.model('User');

module.exports = {
    getAllUsers: function (req, res) {
        User.find({}, {_id: 0, email:1, firstName:1, lastName:1, account: 1, status: 1}).populate('account', 'type').exec(function (err, data) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            return res.json(data);
        });
    },

    getUserDetails: function (req, res) {
        User.findOne({email: req.query.email}).populate('account').exec(function (err, data) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            return res.json(data);
        });
    },

    changePassword: function (req, res) {
        User.findOne({email: req.body.email}, function (err, user) {
            if (err) {
                logger.logError(err);
                return res.status(500).end();
            }
            if (!user) {
                return res.status(404).send('UserNotFound');
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
    }
};
