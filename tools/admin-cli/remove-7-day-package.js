'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var MongoClient = require('mongodb').MongoClient;
var config = require('../../server/common/setup/config');
var mongoose = require('../../server/node_modules/mongoose');
var modelsPath = config.root + '/server/common/models';
var moment = require('moment');
var async = require('async');

mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - remove7DayPackage - db connection error 1');
    } else {
        require('../../server/common/setup/models')(modelsPath);
        var subscription = require('../../server/common/services/subscription');
        MongoClient.connect(config.db, function (err, db) {
            if (err) {
                logger.logError(err);
                logger.logError('adminCLI - remove7DayPackage - db connection error 2');
            } else {
                var accounts = db.collection('Accounts');
                var users = db.collection('Users');
                var date = moment();
                date = moment.utc(date.subtract(8, 'days')).startOf('day');
                console.log(date.format());
                var count = 0;
                accounts.count({type: 'free', packages: {$size: 2}, startDate: {$lt: new Date(date.format())}}, function (err, count) {
                    console.log(count);
                    accounts.find({type: 'free', packages: {$size: 2}, startDate: {$lt: new Date(date.format())}}).toArray(function (err, accounts) {
                        console.log(accounts.length);
                        async.eachSeries(
                            accounts,
                            function (account, callback) {
                                users.findOne({_id: account.primaryUser}, function (err, user) {
                                    console.log(count, user.email, user.createdAt.getTime());
                                    subscription.removePremiumPackage(user.email, function (err) {
                                        callback();
                                    })
                                });
                            },
                            function () {
                                console.log('done');
                                process.exit(0);
                            }
                        );
                    });
                });
            }
        });
    }
});
