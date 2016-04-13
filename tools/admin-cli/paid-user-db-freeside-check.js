'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    validation = require('../../server/common/services/validation'),
    billing = require('../../server/common/services/billing'),
    async = require('async'),
    mongoose = require('../../server/node_modules/mongoose');

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/setup/models')(modelsPath);
var Account = mongoose.model('Account');

Account.find({'type': 'paid'}).populate('primaryUser').exec(function (err, accounts) {
    if (err) {
        logger.logError('adminCLI - paidUserDbFreesideCheck - error fetching accounts');
        logger.logError(err);
        process.exit(1);
    } else if (!accounts || accounts.length === 0) {
        logger.logError('adminCLI - paidUserDbFreesideCheck - no accounts found!');
        process.exit(0);
    } else {
        var csv = '';
        async.eachSeries(
            accounts,
            function (account, callback) {
                billing.login(account.primaryUser.email, account.key, account.primaryUser.createdAt.getTime(), function (err, sessionId) {
                    if (err) {
                        logger.logError('error logging into freeside for user ' + account.primaryUser.email);
                        logger.logError(err);
                        callback();
                    } else {
                        billing.getPackages(sessionId, function (err, packages) {
                            if (err) {
                                logger.logError(err);
                                logger.logError('error getting packages for user ' + account.primaryUser.email);
                                callback();
                            } else {
                                var pkg = [];
                                for (var i = 0; i < packages.length; i++) {
                                    pkg.push(packages[i].pkg);
                                }
                                csv += account.primaryUser.email + ',' + account.packages.length + ',' + pkg.length + ',' + account.primaryUser.cancelOn + '\n';
                                callback();
                            }
                        });
                    }
                });
            },
            function () {
                console.log(csv);
                logger.logInfo('done');
                process.exit(0);
            }
        );
    }
});
