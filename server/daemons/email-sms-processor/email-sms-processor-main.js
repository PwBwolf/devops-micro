'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var CronJob = require('cron').CronJob,
    config = require('../../common/setup/config'),
    logger = require('../../common/setup/logger'),
    MongoClient = require('mongodb').MongoClient,
    async = require('async'),
    twilio = require('../../common/services/twilio'),
    email = require('../../common/services/email'),
    validation = require('../../common/services/validation'),
    sf = require('sf'),
    moment = require('moment');

MongoClient.connect(config.db, function (err, db) {
    if (err) {
        logger.logError(err);
        logger.logError('emailSmsProcessorMain - db connection error');
    } else {
        new CronJob(config.emailSmsProcessorRecurrence, function () {
            logger.logInfo('emailSmsProcessorMain - email sms processor starting');
            processEmailSms(db, function (err) {
                if (err) {
                    logger.logError('emailSmsProcessorMain - error processing email / sms');
                    logger.logError(err);
                }
            });
        }, function () {
            logger.logInfo('emailSmsProcessorMain - email sms processor has stopped');
        }, true, 'America/Anchorage');
    }
});

function processEmailSms(db, cb) {
    var users = {second: [], third: [], fifth: [], sixth: [], seventh: []};
    var Accounts = db.collection('Accounts');
    var Users = db.collection('Users');
    var date = moment();
    date = moment.utc(date.subtract(8, 'days')).startOf('day');
    Accounts.count({type: 'free', startDate: {$gte: new Date(date.format())}}, function (err, accountCount) {
        if (err) {
            logger.logError('emailSmsProcessorMain - processEmailSms - error fetching account count');
            logger.logError(err);
            callback(err);
        } else {
            logger.logInfo('emailSmsProcessorMain - processEmailSms - account count ' + accountCount);
            Accounts.find({type: 'free', startDate: {$gte: new Date(date.format())}}).toArray(function (err, accounts) {
                if (err) {
                    logger.logError('emailSmsProcessorMain - processEmailSms - error fetching accounts');
                    logger.logError(err);
                    callback(err);
                } else {
                    async.eachSeries(
                        accounts,
                        function (account, callback) {
                            Users.findOne({account: account._id}, function (err, user) {
                                if (err) {
                                    logger.logError('emailSmsProcessorMain - processEmailSms - error fetching user');
                                    logger.logError(err);
                                    callback(err);
                                } else if (!user) {
                                    logger.logError('emailSmsProcessorMain - processEmailSms - user not found' + account._id);
                                    callback(err);
                                } else if (user.preferences.emailSmsSubscription && (user.status === 'active' || user.status === 'registered')) {
                                    var diff = moment.utc().startOf('day').diff(moment(account.startDate).utc().startOf('day'), 'days');
                                    switch (diff) {
                                        case 2:
                                            sendReminderEmailSms(user, '5', '2');
                                            users.second.push(user.email);
                                            callback();
                                            break;
                                        case 3:
                                            sendReminderEmailSms(user, '4', '3');
                                            users.third.push(user.email);
                                            callback();
                                            break;
                                        case 5:
                                            sendReminderEmailSms(user, '2', '5');
                                            users.fifth.push(user.email);
                                            callback();
                                            break;
                                        case 6:
                                            sendLastButOneReminderEmailSms(user);
                                            users.sixth.push(user.email);
                                            callback();
                                            break;
                                        case 7:
                                            sendLastReminderEmailSms(user);
                                            users.seventh.push(user.email);
                                            callback();
                                            break;
                                        default:
                                            callback();
                                            break;
                                    }
                                }
                            });
                        },
                        function (err) {
                            logger.logInfo('emailSmsProcessorMain - processEmailSms - 2nd day users ' + users.second.length);
                            logger.logInfo('emailSmsProcessorMain - processEmailSms - 3rd day users ' + users.third.length);
                            logger.logInfo('emailSmsProcessorMain - processEmailSms - 5th day users ' + users.fifth.length);
                            logger.logInfo('emailSmsProcessorMain - processEmailSms - 6th day users ' + users.sixth.length);
                            logger.logInfo('emailSmsProcessorMain - processEmailSms - 7th day users ' + users.seventh.length);
                            cb(err);
                        }
                    );
                }
            });
        }
    });
}

function sendReminderEmailSms(user, subjectDays, bodyDays) {
    if (validation.isUsPhoneNumberInternationalFormat(user.email)) {
        var message = sf(config.reminderSmsMessage[user.preferences.defaultLanguage], subjectDays);
        twilio.sendSms(config.twilioPromoSmsNumber, user.email, message, function (err) {
            if (err) {
                logger.logError('emailSmsProcessorMain - sendReminderEmailSms - error sending sms: ' + user.email);
                logger.logError(err);
            } else {
                logger.logInfo('emailSmsProcessorMain - sendReminderEmailSms - sms sent successfully: ' + user.email);
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
                logger.logError('emailSmsProcessorMain - sendReminderEmailSms - error sending ' + bodyDays + ' day email to ' + user.email);
                logger.logError(err);
            } else {
                logger.logInfo('emailSmsProcessorMain - sendReminderEmailSms - ' + bodyDays + ' day email sent to ' + user.email);
            }
        });
    }
}

function sendLastButOneReminderEmailSms(user) {
    if (validation.isUsPhoneNumberInternationalFormat(user.email)) {
        var message = config.lastButOneReminderSmsMessage[user.preferences.defaultLanguage];
        twilio.sendSms(config.twilioPromoSmsNumber, user.email, message, function (err) {
            if (err) {
                logger.logError('emailSmsProcessorMain - sendLastButOneReminderEmailSms - error sending sms: ' + user.email);
                logger.logError(err);
            } else {
                logger.logInfo('emailSmsProcessorMain - sendLastButOneReminderEmailSms - sms sent successfully: ' + user.email);
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
                logger.logError('emailSmsProcessorMain - sendLastButOneReminderEmailSms - error sending last but one reminder email to ' + user.email);
                logger.logError(err);
            } else {
                logger.logInfo('emailSmsProcessorMain - sendLastButOneReminderEmailSms - last but one reminder email sent to ' + user.email);
            }
        });
    }
}

function sendLastReminderEmailSms(user) {
    if (validation.isUsPhoneNumberInternationalFormat(user.email)) {
        var message = config.lastReminderSmsMessage[user.preferences.defaultLanguage];
        twilio.sendSms(config.twilioPromoSmsNumber, user.email, message, function (err) {
            if (err) {
                logger.logError('emailSmsProcessorMain - sendLastReminderEmailSms - error sending sms: ' + user.email);
                logger.logError(err);
            } else {
                logger.logInfo('emailSmsProcessorMain - sendLastReminderEmailSms - sms sent successfully: ' + user.email);
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
                logger.logError('emailSmsProcessorMain - sendLastReminderEmailSms - error sending last reminder email to ' + user.email);
                logger.logError(err);
            } else {
                logger.logInfo('emailSmsProcessorMain - sendLastReminderEmailSms - last reminder email sent to ' + user.email);
            }
        });
    }
}
