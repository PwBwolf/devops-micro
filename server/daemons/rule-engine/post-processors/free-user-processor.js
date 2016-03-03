'use strict';

var config = require('../../../common/setup/config'),
    email = require('../../../common/services/email'),
    logger = require('../../../common/setup/logger'),
    subscription = require('../../../common/services/subscription'),
    twilio = require('../../../common/services/twilio'),
    validation = require('../../../common/services/validation'),
    sf = require('sf');

function sendReminderEmailSms(user, subjectDays, bodyDays) {
    if (validation.isUsPhoneNumberInternationalFormat(user.email)) {
        var message = sf(config.reminderSmsMessage[user.preferences.defaultLanguage], subjectDays);
        twilio.sendSms(config.twilioSmsSendMobileNumber, user.email, message, function (err) {
            if (err) {
                logger.logError('subscription - sendReminderEmailSms - error sending sms: ' + user.email);
                logger.logError(err);
            } else {
                logger.logInfo('subscription - sendReminderEmailSms - sms sent successfully: ' + user.email);
            }
        });
    } else {
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
}

function sendLastButOneReminderEmailSms(user) {
    if (validation.isUsPhoneNumberInternationalFormat(user.email)) {
        var message = config.lastButOneReminderSmsMessage[user.preferences.defaultLanguage];
        twilio.sendSms(config.twilioSmsSendMobileNumber, user.email, message, function (err) {
            if (err) {
                logger.logError('subscription - sendLastButOneReminderEmailSms - error sending sms: ' + user.email);
                logger.logError(err);
            } else {
                logger.logInfo('subscription - sendLastButOneReminderEmailSms - sms sent successfully: ' + user.email);
            }
        });
    } else {
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
}

function sendLastReminderEmailSms(user) {
    if (validation.isUsPhoneNumberInternationalFormat(user.email)) {
        var message = config.lastReminderSmsMessage[user.preferences.defaultLanguage];
        twilio.sendSms(config.twilioSmsSendMobileNumber, user.email, message, function (err) {
            if (err) {
                logger.logError('subscription - sendLastReminderEmailSms - error sending sms: ' + user.email);
                logger.logError(err);
            } else {
                logger.logInfo('subscription - sendLastReminderEmailSms - sms sent successfully: ' + user.email);
            }
        });
    } else {
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
}

module.exports.send2DayReminderEmailSms = function (user) {
    delete user.postProcessorKey;
    if (user.preferences.emailSmsSubscription) {
        sendReminderEmailSms(user, '5', '2');
    }
};

module.exports.send3DayReminderEmailSms = function (user) {
    delete user.postProcessorKey;
    if (user.preferences.emailSmsSubscription) {
        sendReminderEmailSms(user, '4', '3');
    }
};

module.exports.send5DayReminderEmailSms = function (user) {
    delete user.postProcessorKey;
    if (user.preferences.emailSmsSubscription) {
        sendReminderEmailSms(user, '2', '5');
    }
};

module.exports.send6DayReminderEmailSms = function (user) {
    delete user.postProcessorKey;
    if (user.preferences.emailSmsSubscription) {
        sendLastButOneReminderEmailSms(user);
    }
};

module.exports.send7DayReminderEmailSms = function (user) {
    delete user.postProcessorKey;
    if (user.preferences.emailSmsSubscription) {
        sendLastReminderEmailSms(user);
    }
};

module.exports.send8DaySuspendPremiumEmailSms = function (user) {
    delete user.postProcessorKey;
    subscription.removePremiumPackage(user.email);
};

config.postProcessors.freeUser2 = module.exports.send2DayReminderEmailSms;
config.postProcessors.freeUser3 = module.exports.send3DayReminderEmailSms;
config.postProcessors.freeUser5 = module.exports.send5DayReminderEmailSms;
config.postProcessors.freeUser6 = module.exports.send6DayReminderEmailSms;
config.postProcessors.freeUser7 = module.exports.send7DayReminderEmailSms;
config.postProcessors.freeUser8 = module.exports.send8DaySuspendPremiumEmailSms;
