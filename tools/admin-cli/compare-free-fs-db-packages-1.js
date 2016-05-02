'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    validation = require('../../server/common/services/validation'),
    billing = require('../../server/common/services/billing'),
    async = require('async'),
    fs = require('fs-extended'),
    MongoClient = require('mongodb').MongoClient,
    logFile = fs.createWriteStream(__dirname + '/compare-free-fs-db-packages-1.log', {flags: 'w'});

MongoClient.connect(config.db, function (err, db) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - compareFreeFsDbPackages1 - db connection error');
    } else {
        var accounts = db.collection('Accounts');
        var users = db.collection('Users');
        accounts.find({'type': 'free'}).toArray(function (err, accounts) {
            if (err) {
                logger.logError('adminCLI - compareFreeFsDbPackages1 - error fetching accounts');
                logger.logError(err);
                process.exit(1);
            } else if (!accounts || accounts.length === 0) {
                logger.logError('adminCLI - compareFreeFsDbPackages1 - no accounts found!');
                process.exit(0);
            } else {
                var csv = '';
                var count = 0;
                async.eachSeries(
                    accounts,
                    function (account, callback) {
                        count++;
                        logger.logInfo('processing account ' + count);
                        users.findOne({_id: account.primaryUser}, function (err, user) {
                            if (err) {
                                logger.logError('adminCLI - compareFreeFsDbPackages1 - error fetching user');
                                logger.logError(err);
                                process.exit(1);
                            } else if (user) {
                                billing.login(user.email, account.key, user.createdAt.getTime(), function (err, sessionId) {
                                    if (err) {
                                        logger.logError('adminCLI - compareFreeFsDbPackages1 - error logging into freeside for user ' + user.email);
                                        logger.logError(err);
                                        callback();
                                    } else {
                                        billing.getPackages(sessionId, function (err, packages) {
                                            if (err) {
                                                logger.logError(err);
                                                logger.logError('adminCLI - compareFreeFsDbPackages1 - error getting packages for user ' + user.email);
                                                callback();
                                            } else {
                                                var pkg = [];
                                                for (var i = 0; i < packages.length; i++) {
                                                    pkg.push(packages[i].pkg);
                                                }
                                                if(pkg.length !== account.packages.length || user.cancelOn) {
                                                    csv += user.email + ',' + account.packages.length + ',' + pkg.length + ',' + user.cancelOn + '\n';
                                                }
                                                callback();
                                            }
                                        });
                                    }
                                });
                            } else {
                                callback();
                            }
                        });
                    },
                    function () {
                        logFile.write(csv);
                        logger.logInfo(csv);
                        logger.logInfo('done');
                        process.exit(0);
                    }
                );
            }
        });
    }
});
