var config = require('../../../common/config/config');
var email = require('../../../common/services/email');
var sf = require('sf');

function sendReminderEmail(user, subjectDays, bodyDays) {
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: sf(config.reminderEmailSubject[user.preferences.defaultLanguage], subjectDays),
        html: sf(config.reminderEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, bodyDays, config.url + 'subscribe')
    };

    email.sendEmail(mailOptions, function (err) {
        console.log('email sent...');
        if (err) {
            console.log(err);
        }
    });
}

function sendSuspensionEmail(user) {

    // suspend this users account

    // send an email
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.trialPeriodCompleteSubject[user.preferences.defaultLanguage],
        html: sf(config.trialPeriodComplete[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.url + 'subscribe')
    };

    email.sendEmail(mailOptions, function (err) {
        console.log('email sent...');
        if (err) {
            console.log(err);
        }
    });
}

function sendReacquireEmail(user) {
    // send an email
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.reacquireUserSubject[user.preferences.defaultLanguage],
        html: sf(config.reacquireUser[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.url + 'reactivate')
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
    sendReminderEmail(user, 'in 16 days', 'last 14 days');
};

module.exports.send21DayReminderEmail = function(user) {
    // first lets delete the postProcessorKey
    delete user.postProcessorKey;

    // now send email to this user
    sendReminderEmail(user, 'in 9 days', 'last 21 days');
};

module.exports.send28DayReminderEmail = function(user) {
    // first lets delete the postProcessorKey
    delete user.postProcessorKey;

    // now send email to this user
    sendReminderEmail(user, 'in 2 days', 'last 28 days');
};

module.exports.send30DayReminderEmail = function(user) {
    // first lets delete the postProcessorKey
    delete user.postProcessorKey;

    // now send email to this user
    sendReminderEmail(user, 'today', 'past month');
};

module.exports.send31DaySuspensionEmail = function(user) {
    // first lets delete the postProcessorKey
    delete user.postProcessorKey;

    // suspend this user's account and send an email
    sendSuspensionEmail(user);
};

module.exports.send32DayReacquireEmail = function(user) {
    // first lets delete the postProcessorKey
    delete user.postProcessorKey;

    // suspend this user's account and send an email
    sendReacquireEmail(user);
};

config.postProcessors['freeUser14'] = module.exports.send14DayReminderEmail;
config.postProcessors['freeUser21'] = module.exports.send21DayReminderEmail;
config.postProcessors['freeUser28'] = module.exports.send28DayReminderEmail;
config.postProcessors['freeUser30'] = module.exports.send30DayReminderEmail;
config.postProcessors['freeUser31'] = module.exports.send31DaySuspensionEmail;
config.postProcessors['freeUser32'] = module.exports.send32DayReacquireEmail;
