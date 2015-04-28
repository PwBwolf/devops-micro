'use strict';

var config = require('../../../common/config/config'),
    email = require('../../../common/services/email'),
    logger = require('../../../common/config/logger'),
    subscription = require('../../../common/services/subscription'),
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
            logger.logError('freeUserProcessor - sendReminderEmail - error sending ' + bodyDays + ' day email to ' + user.email);
            logger.logError(err);
        } else {
            logger.logInfo('freeUserProcessor - sendReminderEmail - ' + bodyDays + ' day email sent to ' + user.email);
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
            logger.logError('freeUserProcessor - sendLastButOneReminderEmail - error sending last but one reminder email to ' + user.email);
            logger.logError(err);
        } else {
            logger.logInfo('freeUserProcessor - sendLastButOneReminderEmail - last but one reminder email sent to ' + user.email);
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
            logger.logError('freeUserProcessor - sendLastReminderEmail - error sending last reminder email to ' + user.email);
            logger.logError(err);
        } else {
            logger.logInfo('freeUserProcessor - sendLastReminderEmail - last reminder email sent to ' + user.email);
        }
    });
}

function suspendAndSendEmail(user) {
    if (config.cancelSubscriptionForTrialUsers) {
        subscription.endFreeTrial(user.email);
    } else {
        var mailOptions = {
            from: config.email.fromName + ' <' + config.email.fromEmail + '>',
            to: user.email,
            subject: config.trialPeriodCompleteEmailSubject[user.preferences.defaultLanguage],
            html: sf(config.trialPeriodCompleteEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.url + 'upgrade-subscription')
        };
        email.sendEmail(mailOptions, function (err) {
            if (err) {
                logger.logError('freeUserProcessor - suspendAndSendEmail - error sending suspension email to ' + user.email);
                logger.logError(err);
            } else {
                logger.logInfo('freeUserProcessor - suspendAndSendEmail - suspension email sent to ' + user.email);
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
            logger.logError('freeUserProcessor - sendReacquireEmail - error sending re-acquire email to ' + user.email);
            logger.logError(err);
        } else {
            logger.logInfo('freeUserProcessor - sendReacquireEmail - re-acquire email sent to ' + user.email);
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
