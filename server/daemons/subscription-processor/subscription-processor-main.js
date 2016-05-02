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
        logger.logError('subscriptionProcessorMain - db connection error');
    } else {
        new CronJob(config.emailSmsProcessorRecurrence, function () {
            logger.logInfo('subscriptionProcessorMain - email sms processor starting');
            processTasks(db, function (err) {
                if (err) {
                    logger.logError('subscriptionProcessorMain - error processing tasks');
                    logger.logError(err);
                }
            });
        }, function () {
            logger.logInfo('subscriptionProcessorMain - subscription processor has stopped');
        }, true, 'America/Anchorage');
    }
});

function processTasks(db, cb) {
    async.waterfall([
        // remove 7 day packages
        function (callback) {
            var Accounts = db.collection('Accounts');
            var Users = db.collection('Users');
            var date = moment();
            date = moment.utc(date.subtract(8, 'days')).startOf('day');
            Accounts.count({type: 'free', startDate: {$lte: new Date(date.format())}}, function (err, accountCount) {
                if (err) {
                    logger.logError('subscriptionProcessorMain - processEmailSms - error fetching account count');
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

                                        }
                                    });
                                },
                                function (err) {
                                    cb(err);
                                }
                            );
                        }
                    });
                }
            });
        },
        // end complimentary subscription
        function (callback) {

        },
        // end premium subscription
        function (callback) {

        }
    ], function () {

    });
}
