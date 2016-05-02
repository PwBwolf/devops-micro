'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    validation = require('../../server/common/services/validation'),
    billing = require('../../server/common/services/billing'),
    async = require('async'),
    fs = require('fs-extended'),
    MongoClient = require('mongodb').MongoClient,
    logFile = fs.createWriteStream(__dirname + '/compare-complimentary-fs-db-packages-2.log', {flags: 'w'});

MongoClient.connect(config.db, function (err, db) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - compareComplimentaryFsDbPackages2 - db connection error');
    } else {
        var accounts = db.collection('Accounts');
        var users = db.collection('Users');
        users.find({complimentaryEndDate: {$exists: true}}).toArray(function (err, users) {
            if (err) {
                logger.logError('adminCLI - compareComplimentaryFsDbPackages2 - error fetching users');
                logger.logError(err);
                process.exit(1);
            } else if (!accounts || accounts.length === 0) {
                logger.logError('adminCLI - compareComplimentaryFsDbPackages2 - no users found!');
                process.exit(0);
            } else {
                var csv = '';
                var count = 0;
                async.eachSeries(
                    users,
                    function (user, callback) {
                        count++;
                        logger.logInfo('processing user ' + count);
                        accounts.findOne({_id: user.account}, function (err, account) {
                            if (err) {
                                logger.logError('adminCLI - compareComplimentaryFsDbPackages2 - error fetching user');
                                logger.logError(err);
                                process.exit(1);
                            } else if (account) {
                                billing.login(user.email, account.key, user.createdAt.getTime(), function (err, sessionId) {
                                    if (err) {
                                        logger.logError('adminCLI - compareComplimentaryFsDbPackages2 - error logging into freeside for user ' + user.email);
                                        logger.logError(err);
                                        callback();
                                    } else {
                                        billing.getPackages(sessionId, function (err, packages) {
                                            if (err) {
                                                logger.logError(err);
                                                logger.logError('adminCLI - compareComplimentaryFsDbPackages2 - error getting packages for user ' + user.email);
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
