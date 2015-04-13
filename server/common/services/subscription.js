'use strict';

var async = require('async'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    aio = require('./aio'),
    billing = require('./billing'),
    config = require('../config/config'),
    email = require('./email'),
    logger = require('../config/logger'),
    User = mongoose.model('User'),
    sf = require('sf');

module.exports = {
    endFreeTrial: function (user) {
        async.waterfall([
            // set user status to 'trial-ended'
            function (callback) {
                User.findOne({email: user.email}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        callback(err);
                    } else {
                        userObj.status = 'trial-ended';
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
                        setUserActive(userObj);
                        callback(err);
                    } else {
                        callback(null, userObj);
                    }
                });
            },
            // change credit card to dummy and modify billing address
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
                        logger.logError('error sending suspension email to ' + user.email);
                        logger.logError(err);
                        callback(err);
                    } else {
                        logger.logInfo('suspension email sent to ' + userObj.email);
                        callback(null, userObj);
                    }
                });
            }
        ], function (err) {
            if (err) {
                logger.logError(err);
            }
        });

        function setUserActive(user, cb) {
            user.status = 'active';
            user.save(function (err) {
                if (err) {
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
                    logger.logError(err);
                }
                if (cb) {
                    cb();
                }
            });
        }
    },

    endComplimentarySubscription: function (user) {
        async.waterfall([
            // set user status to 'comp-ended'
            function (callback) {
                User.findOne({email: user.email}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        callback(err);
                    } else {
                        userObj.status = 'comp-ended';
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
                        setUserActive(userObj);
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
                    to: user.email,
                    subject: config.complimentaryAccountEndedEmailSubject[user.preferences.defaultLanguage],
                    html: sf(config.complimentayAccountEndedEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.url + 'upgrade-subscription')
                };
                email.sendEmail(mailOptions, function (err) {
                    if (err) {
                        logger.logError('error sending complimentary account ended email to ' + userObj.email);
                        logger.logError(err);
                        callback(err);
                    } else {
                        logger.logInfo('complimentary account ended email sent to ' + userObj.email);
                        callback(null, userObj);
                    }
                });
            }
        ], function (err) {
            if (err) {
                logger.logError(err);
            }
        });

        function setUserActive(user, cb) {
            user.status = 'active';
            user.save(function (err) {
                if (err) {
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
                    logger.logError(err);
                }
                if (cb) {
                    cb();
                }
            });
        }
    }
};
