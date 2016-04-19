'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    mongoose = require('../../server/node_modules/mongoose'),
    async = require('async'),
    Table = require('cli-table'),
    _ = require('lodash');

var modelsPath = config.root + '/server/common/models';
mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - rafReport - db connection error');
    } else {
        require('../../server/common/setup/models')(modelsPath);
        var Account = mongoose.model('Account');
        var Referrer = mongoose.model('Referrer');
        var User = mongoose.model('User');
        Account.find({referredBy: {$exists: true}}).populate('primaryUser').exec(function (err, accounts) {
            if (err) {
                logger.logError('adminCLI - rafReport - error fetching referred accounts');
                logger.logError(err);
                process.exit(1);
            } else if (!accounts || accounts.length === 0) {
                logger.logError('adminCLI - rafReport - no referred accounts found!');
                process.exit(0);
            } else {
                Referrer.find({}, function (err, referrers) {
                    if (err) {
                        logger.logError('adminCLI - rafReport - error fetching referrers');
                        logger.logError(err);
                        process.exit(2);
                    } else if (!referrers || referrers.length === 0) {
                        logger.logError('adminCLI - rafReport - no referrers found!');
                        process.exit(0);
                    } else {
                        var table = new Table({head: ['User', 'User Sign Up Date', 'User Type', 'User Status', 'Referrer', 'Referrer Sign Up Date', 'Referrer Type', 'Referrer Status']});
                        for (var i = 0; i < accounts.length; i++) {
                            table.push([accounts[i].primaryUser.email, (accounts[i].primaryUser.createdAt).toString(), accounts[i].type, accounts[i].primaryUser.status, _.result(_.find(referrers, {referralCode: accounts[i].referredBy}), 'email')]);
                        }
                        async.each(table, function (row, callback) {
                            User.findOne({email: row[4]}).populate('account').exec(function (err, user) {
                                if (err) {
                                    callback(err);
                                } else if (user) {
                                    row.push(user.createdAt.toString(), user.account.type, user.status);
                                    callback();
                                } else {
                                    row.push('', '', '');
                                    callback();
                                }
                            });
                        }, function (err) {
                            if (err) {
                                logger.logError('adminCLI - rafReport - an error occurred');
                                logger.logError(3);
                            } else {
                                console.log(table.toString());
                                process.exit(0);
                            }
                        });
                    }
                });
            }
        });
    }
});
