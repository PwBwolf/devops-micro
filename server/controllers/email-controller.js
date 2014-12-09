var config = require('../config/config');

module.exports.send14DayReminderEmail = function(user) {
    // first lets delete the postProcessorKey
    delete user.postProcessorKey;

    // now send email to this user
    console.log('email sent...');
};

module.exports.send28DayReminderEmail = function(user) {
    // first lets delete the postProcessorKey
    delete user.postProcessorKey;

    // now send email to this user
    console.log('email sent...');
};

module.exports.send29DayReminderEmail = function(user) {
    // first lets delete the postProcessorKey
    delete user.postProcessorKey;

    // now send email to this user
    console.log('email sent...');
};

module.exports.send30DayReminderEmail = function(user) {
    // first lets delete the postProcessorKey
    delete user.postProcessorKey;

    // now send email to this user
    console.log('email sent...');
};

module.exports.send31DaySuspensionEmail = function(user) {
    // first lets delete the postProcessorKey
    delete user.postProcessorKey;

    // now send email to this user
    console.log('email sent...');
};

config.ruleMatchProcessor['freeUser14'] = module.exports.send14DayReminderEmail;
config.ruleMatchProcessor['freeUser28'] = module.exports.send28DayReminderEmail;
config.ruleMatchProcessor['freeUser29'] = module.exports.send29DayReminderEmail;
config.ruleMatchProcessor['freeUser30'] = module.exports.send30DayReminderEmail;
config.ruleMatchProcessor['freeUser31'] = module.exports.send31DaySuspensionEmail;


