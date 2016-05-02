'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    validation = require('../../server/common/services/validation'),
    billing = require('../../server/common/services/billing'),
    async = require('async'),
    fs = require('fs-extended'),
    mongoose = require('../../server/node_modules/mongoose'),
    logFile = fs.createWriteStream(__dirname + '/compare-complimentary-fs-db-packages-1.log', {flags: 'w'});

var modelsPath = config.root + '/server/common/models';
mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - compareComplimentaryFsDbPackages1 - db connection error');
    } else {
        require('../../server/common/setup/models')(modelsPath);
        var Account = mongoose.model('Account');
        Account.find({'type': 'comp'}).populate('primaryUser').exec(function (err, accounts) {
            if (err) {
                logger.logError('adminCLI - compareComplimentaryFsDbPackages1 - error fetching accounts');
                logger.logError(err);
                process.exit(1);
            } else if (!accounts || accounts.length === 0) {
                logger.logError('adminCLI - compareComplimentaryFsDbPackages1 - no accounts found!');
                process.exit(0);
            } else {
                var csv = '';
                var count = 0;
                async.eachSeries(
                    accounts,
                    function (account, callback) {
                        count++;
                        logger.logInfo('processing account ' + count);
                        if (account.primaryUser) {
                            billing.login(account.primaryUser.email, account.key, account.primaryUser.createdAt.getTime(), function (err, sessionId) {
                                if (err) {
                                    logger.logError('adminCLI - compareComplimentaryFsDbPackages1 - error logging into freeside for user ' + account.primaryUser.email);
                                    logger.logError(err);
                                    callback();
                                } else {
                                    billing.getPackages(sessionId, function (err, packages) {
                                        if (err) {
                                            logger.logError(err);
                                            logger.logError('adminCLI - compareComplimentaryFsDbPackages1 - error getting packages for user ' + account.primaryUser.email);
                                            callback();
                                        } else {
                                            var pkg = [];
                                            for (var i = 0; i < packages.length; i++) {
                                                pkg.push(packages[i].pkg);
                                            }
                                            csv += account.primaryUser.email + ',' + account.packages.length + ',' + pkg.length + '\n';
                                            callback();
                                        }
                                    });
                                }
                            });
                        } else {
                            callback();
                        }
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
