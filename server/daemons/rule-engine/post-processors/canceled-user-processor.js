'use strict';

var config = require('../../../common/setup/config'),
    email = require('../../../common/services/email'),
    logger = require('../../../common/setup/logger'),
    subscription = require('../../../common/services/subscription'),
    sf = require('sf');

function sendReminderEmail(user) {
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.cancellationNextDayEmailSubject[user.preferences.defaultLanguage],
        html: sf(config.cancellationNextDayEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.url + 'reactivate-subscription')
    };

    email.sendEmail(mailOptions, function (err) {
        if (err) {
            logger.logError('canceledUserProcessor - sendReminderEmail - error sending next day cancellation email to ' + user.email);
            logger.logError(err);
        } else {
            logger.logInfo('canceledUserProcessor - sendReminderEmail - next day cancellation email sent to ' + user.email);
        }
    });
}

module.exports.sendNextDayReminderEmail = function (user) {
    delete user.postProcessorKey;
    sendReminderEmail(user);
};

module.exports.cancelUserAndSendEmail = function (user) {
    delete user.postProcessorKey;
    subscription.endPaidSubscription(user.email);
};

config.postProcessors.canceledNextDay = module.exports.sendNextDayReminderEmail;
config.postProcessors.canceledUser = module.exports.cancelUserAndSendEmail;
