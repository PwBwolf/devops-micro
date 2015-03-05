'use strict';

var config = require('../../../common/config/config'),
    email = require('../../../common/services/email'),
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
            console.log(err);
        } else {
            console.log('Next day of cancellation email sent to ' + user.email);
        }
    });
}

module.exports.sendNextDayReminderEmail = function (user) {
    delete user.postProcessorKey;
    sendReminderEmail(user);
};

config.postProcessors.canceledNextDay = module.exports.sendNextDayReminderEmail;

