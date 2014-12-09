var config = require('../config/config');
var email = require('../utils/email');
var logger = require('../config/logger');
var sf = require('sf');

function sendReminderEmail(user, subjectDays, bodyDays) {
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: sf(config.reminderEmailSubject[user.preferences.defaultLanguage], subjectDays),
        html: sf(config.reminderEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, bodyDays)
    };

    email.sendEmail(mailOptions, function (err) {
        console.log('email sent...');
        if (err) {
            logger.logError(err);
        }
    });
}

module.exports.send14DayReminderEmail = function(user) {
    // first lets delete the postProcessorKey
    delete user.postProcessorKey;

    // now send email to this user
    sendReminderEmail(user, 'in 15 days', 'last 15 days');
};

module.exports.send21DayReminderEmail = function(user) {
    // first lets delete the postProcessorKey
    delete user.postProcessorKey;

    // now send email to this user
    sendReminderEmail(user, 'in 7 days', 'last 7 days');
};

module.exports.send28DayReminderEmail = function(user) {
    // first lets delete the postProcessorKey
    delete user.postProcessorKey;

    // now send email to this user
    sendReminderEmail(user, 'in 2 days', 'last 2 days');
};

module.exports.send30DayReminderEmail = function(user) {
    // first lets delete the postProcessorKey
    delete user.postProcessorKey;

    // now send email to this user
    sendReminderEmail(user, 'tomorrow', 'last day');
};

module.exports.send31DaySuspensionEmail = function(user) {
    // first lets delete the postProcessorKey
    delete user.postProcessorKey;

    // now send email to this user
    console.log('email sent...');
};

config.ruleMatchProcessor['freeUser14'] = module.exports.send14DayReminderEmail;
config.ruleMatchProcessor['freeUser21'] = module.exports.send21DayReminderEmail;
config.ruleMatchProcessor['freeUser28'] = module.exports.send28DayReminderEmail;
config.ruleMatchProcessor['freeUser30'] = module.exports.send30DayReminderEmail;
config.ruleMatchProcessor['freeUser31'] = module.exports.send31DaySuspensionEmail;


