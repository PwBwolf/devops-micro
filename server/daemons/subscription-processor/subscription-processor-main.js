'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var CronJob = require('cron').CronJob,
    config = require('../../common/setup/config'),
    logger = require('../../common/setup/logger'),
    MongoClient = require('mongodb').MongoClient,
    async = require('async'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    modelsPath = config.root + '/server/common/models';

mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError('subscriptionProcessorMain - mongoose connection error');
        logger.logError(err);
    } else {
        require('../../common/setup/models')(modelsPath);
        var subscription = require('../../common/services/subscription');
        MongoClient.connect(config.db, function (err, db) {
            if (err) {
                logger.logError('subscriptionProcessorMain - db connection error');
                logger.logError(err);
            } else {
                new CronJob(config.subscriptionProcessorRecurrence, function () {
                    logger.logInfo('subscriptionProcessorMain - subscription processor starting');
                    processTasks(db, subscription, function () {
                        logger.logInfo('subscriptionProcessorMain - subscription processor ending');
                    });
                }, function () {
                    logger.logInfo('subscriptionProcessorMain - subscription processor has stopped');
                }, true, 'America/Anchorage');
            }
        });
    }
});

function processTasks(db, subscription, cb) {
    async.waterfall([
        // remove 7 day packages
        function remove7DayPackage(callback) {
            var Accounts = db.collection('Accounts');
            var Users = db.collection('Users');
            var date = moment();
            date = moment.utc(date.subtract(7, 'days')).startOf('day');
            var query = {type: 'free', packages: {$size: 2}, startDate: {$lte: new Date(date.format())}};
            Accounts.count(query, function (err, accountCount) {
                if (err) {
                    logger.logError('subscriptionProcessorMain - remove7DayPackage - error fetching account count');
                    logger.logError(err);
                    callback(err);
                } else {
                    logger.logInfo('subscriptionProcessorMain - remove7DayPackage - account count ' + accountCount);
                    Accounts.find(query).toArray(function (err, accounts) {
                        if (err) {
                            logger.logError('subscriptionProcessorMain - remove7DayPackage - error fetching accounts');
                            logger.logError(err);
                            callback(err);
                        } else {
                            async.eachSeries(
                                accounts,
                                function (account, callback) {
                                    Users.findOne({account: account._id}, function (err, user) {
                                        if (err) {
                                            logger.logError('subscriptionProcessorMain - remove7DayPackage - error fetching user');
                                            logger.logError(err);
                                            callback();
                                        } else if (!user) {
                                            logger.logError('subscriptionProcessorMain - remove7DayPackage - user not found ' + account._id);
                                            callback();
                                        } else if (user.status === 'active' || user.status === 'registered') {
                                            subscription.removePremiumPackage(user.email, function (err) {
                                                if (err) {
                                                    logger.logError('subscriptionProcessorMain - remove7DayPackage - error removing premium package ' + user.email);
                                                }
                                                callback();
                                            });
                                        }
                                    });
                                },
                                function () {
                                    callback();
                                }
                            );
                        }
                    });
                }
            });
        },
        // end complimentary subscription
        function endComplimentarySubscription(callback) {
            var Users = db.collection('Users');
            var date = moment();
            date = moment.utc(date).startOf('day');
            var query = {validTill: {$lte: new Date(date.format())}};
            Users.count(query, function (err, userCount) {
                if (err) {
                    logger.logError('subscriptionProcessorMain - endComplimentarySubscription - error fetching user count');
                    logger.logError(err);
                    callback(err);
                } else {
                    logger.logInfo('subscriptionProcessorMain - endComplimentarySubscription - user count ' + userCount);
                    Users.find(query).toArray(function (err, users) {
                        if (err) {
                            logger.logError('subscriptionProcessorMain - endComplimentarySubscription - error fetching users');
                            logger.logError(err);
                            callback(err);
                        } else {
                            async.eachSeries(
                                users,
                                function (user, callback) {
                                    if (user.status === 'active' || user.status === 'registered') {
                                        subscription.endComplimentarySubscription(user.email, function (err) {
                                            if (err) {
                                                logger.logError('subscriptionProcessorMain - endComplimentarySubscription - error ending complimentary subscription ' + user.email);
                                            }
                                            callback();
                                        });
                                    }
                                },
                                function () {
                                    callback();
                                }
                            );
                        }
                    });
                }
            });
        },
        // end premium subscription
        function endPaidSubscription(callback) {
            var Users = db.collection('Users');
            var date = moment();
            date = moment.utc(date).startOf('day');
            var query = {cancelOn: {$lte: new Date(date.format())}};
            Users.count(query, function (err, userCount) {
                if (err) {
                    logger.logError('subscriptionProcessorMain - endPaidSubscription - error fetching user count');
                    logger.logError(err);
                    callback(err);
                } else {
                    logger.logInfo('subscriptionProcessorMain - endPaidSubscription - user count ' + userCount);
                    Users.find(query).toArray(function (err, users) {
                        if (err) {
                            logger.logError('subscriptionProcessorMain - endPaidSubscription - error fetching users');
                            logger.logError(err);
                            callback(err);
                        } else {
                            async.eachSeries(
                                users,
                                function (user, callback) {
                                    if (user.status === 'active' || user.status === 'registered') {
                                        subscription.endPremiumSubscriptionDbOnly(user.email, function (err) {
                                            if (err) {
                                                logger.logError('subscriptionProcessorMain - endPaidSubscription - error ending premium subscription ' + user.email);
                                            }
                                            callback();
                                        });
                                    }
                                },
                                function () {
                                    callback();
                                }
                            );
                        }
                    });
                }
            });
        }
    ], function () {
        cb();
    });
}
