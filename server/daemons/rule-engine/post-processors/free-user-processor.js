'use strict';

var config = require('../../../common/setup/config'),
    email = require('../../../common/services/email'),
    logger = require('../../../common/setup/logger'),
    subscription = require('../../../common/services/subscription'),
    twilio = require('../../../common/services/twilio'),
    validation = require('../../../common/services/validation'),
    sf = require('sf');



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
