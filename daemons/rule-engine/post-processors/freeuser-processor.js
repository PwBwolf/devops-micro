var config = require('../config');
var email = require('../services/email');
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
            console.log(err);
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

config.postProcessors['freeUser14'] = module.exports.send14DayReminderEmail;
config.postProcessors['freeUser21'] = module.exports.send21DayReminderEmail;
config.postProcessors['freeUser28'] = module.exports.send28DayReminderEmail;
config.postProcessors['freeUser30'] = module.exports.send30DayReminderEmail;
config.postProcessors['freeUser31'] = module.exports.send31DaySuspensionEmail;
