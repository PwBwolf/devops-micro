'use strict';

var async = require('async'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    aio = require('../../../common/services/aio'),
    billing = require('../../../common/services/billing'),
    config = require('../../../common/config/config'),
    email = require('../../../common/services/email'),
    User = mongoose.model('User'),
    sf = require('sf');

function sendReminderEmail(user, subjectDays, bodyDays) {
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: sf(config.reminderEmailSubject[user.preferences.defaultLanguage], subjectDays),
        html: sf(config.reminderEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, bodyDays, config.url + 'upgrade-subscription')
    };

    email.sendEmail(mailOptions, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log(bodyDays + ' day email sent to ' + user.email);
        }
    });
}

function sendLastButOneReminderEmail(user) {
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.lastButOneReminderEmailSubject[user.preferences.defaultLanguage],
        html: sf(config.lastButOneReminderEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.url + 'upgrade-subscription')
    };

    email.sendEmail(mailOptions, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('last but one reminder email sent to ' + user.email);
        }
    });
}

function sendLastReminderEmail(user) {
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.lastReminderEmailSubject[user.preferences.defaultLanguage],
        html: sf(config.lastReminderEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.url + 'upgrade-subscription')
    };

    email.sendEmail(mailOptions, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('last reminder email sent to ' + user.email);
        }
    });
}

function suspendAndSendEmail(user) {
    if(config.cancelSubscriptionForTrialUsers) {
        async.waterfall([
            // set user status to 'trial-ended'
            function (callback) {
                User.findOne({email: user.email}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        callback(err);
                    } else {
                        userObj.status = 'trial-ended';
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
                billing.setTrialEnded(userObj.account.freeSideCustomerNumber, address, city, state, country, zip, function (err) {
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
                        console.log(err);
                        callback(err);
                    } else {
                        console.log('suspension email sent to ' + userObj.email);
                        callback(null, userObj);
                    }
                });
            }
        ], function (err) {
            if (err) {
                console.log(err);
            }
        });
    } else {
        var mailOptions = {
            from: config.email.fromName + ' <' + config.email.fromEmail + '>',
            to: user.email,
            subject: config.trialPeriodCompleteEmailSubject[user.preferences.defaultLanguage],
            html: sf(config.trialPeriodCompleteEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.url + 'upgrade-subscription')
        };
        email.sendEmail(mailOptions, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('suspension email sent to ' + user.email);
            }
        });
    }
}

function sendReacquireEmail(user) {
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.reacquireUserEmailSubject[user.preferences.defaultLanguage],
        html: sf(config.reacquireUserEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.url + 'upgrade-subscription')
    };

    email.sendEmail(mailOptions, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('re-acquire email sent to ' + user.email);
        }
    });
}

function setUserActive(user, cb) {
    user.status = 'active';
    user.save(function (err) {
        if (err) {
            console.log(JSON.stringify(err));
        }
        if (cb) {
            cb();
        }
    });
}

function setUserActiveInAio(email, cb) {
    aio.updateUserStatus(email, true, function (err) {
        if (err) {
            console.log(JSON.stringify(err));
        }
        if (cb) {
            cb();
        }
    });
}

module.exports.send4DayReminderEmail = function (user) {
    delete user.postProcessorKey;
    sendReminderEmail(user, '3', '4');
};

module.exports.send6DayReminderEmail = function (user) {
    delete user.postProcessorKey;
    sendLastButOneReminderEmail(user, '1', '6');
};

module.exports.send7DayReminderEmail = function (user) {
    delete user.postProcessorKey;
    sendLastReminderEmail(user);
};

module.exports.send8DaySuspensionEmail = function (user) {
    delete user.postProcessorKey;
    suspendAndSendEmail(user);
};

module.exports.send9DayReacquireEmail = function (user) {
    delete user.postProcessorKey;
    sendReacquireEmail(user);
};

config.postProcessors.freeUser4 = module.exports.send4DayReminderEmail;
config.postProcessors.freeUser6 = module.exports.send6DayReminderEmail;
config.postProcessors.freeUser7 = module.exports.send7DayReminderEmail;
config.postProcessors.freeUser8 = module.exports.send8DaySuspensionEmail;
config.postProcessors.freeUser9 = module.exports.send9DayReacquireEmail;
