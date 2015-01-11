'use strict';

var config = require('../../../common/config/config'),
    email = require('../../../common/services/email'),
    sf = require('sf');

function sendReminderEmail(user, subjectDays, bodyDays) {
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: sf(config.reminderEmailSubject[user.preferences.defaultLanguage], subjectDays),
        html: sf(config.reminderEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, bodyDays, config.url + 'upgrade-subscription')
    };

    email.sendEmail(mailOptions, function (err) {
        console.log('email sent...');
        if (err) {
            console.log(err);
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
        console.log('email sent...');
        if (err) {
            console.log(err);
        }
    });
}

function sendSuspensionEmail(user) {

    // TODO: suspend this users account

    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.trialPeriodCompleteEmailSubject[user.preferences.defaultLanguage],
        html: sf(config.trialPeriodCompleteEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.url + 'upgrade-subscription')
    };

    email.sendEmail(mailOptions, function (err) {
        console.log('email sent...');
        if (err) {
            console.log(err);
        }
    });
}

function sendReacquireEmail(user) {
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.reacquireUserEmailSubject[user.preferences.defaultLanguage],
        html: sf(config.reacquireUserEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.url + 'upgrade-subscription')
    };

    email.sendEmail(mailOptions, function (err) {
        console.log('email sent...');
        if (err) {
            console.log(err);
        }
    });
}

module.exports.send14DayReminderEmail = function(user) {
    delete user.postProcessorKey;
    sendReminderEmail(user, '16', '14');
};

module.exports.send21DayReminderEmail = function(user) {
    delete user.postProcessorKey;
    sendReminderEmail(user, '9', '21');
};

module.exports.send28DayReminderEmail = function(user) {
    delete user.postProcessorKey;
    sendReminderEmail(user, '2', '28');
};

module.exports.send30DayReminderEmail = function(user) {
    delete user.postProcessorKey;
    sendLastReminderEmail(user);
};

module.exports.send31DaySuspensionEmail = function(user) {
    delete user.postProcessorKey;
    sendSuspensionEmail(user);
};

module.exports.send32DayReacquireEmail = function(user) {
    delete user.postProcessorKey;
    sendReacquireEmail(user);
};

config.postProcessors.freeUser14 = module.exports.send14DayReminderEmail;
config.postProcessors.freeUser21 = module.exports.send21DayReminderEmail;
config.postProcessors.freeUser28 = module.exports.send28DayReminderEmail;
config.postProcessors.freeUser30 = module.exports.send30DayReminderEmail;
config.postProcessors.freeUser31 = module.exports.send31DaySuspensionEmail;
config.postProcessors.freeUser32 = module.exports.send32DayReacquireEmail;
