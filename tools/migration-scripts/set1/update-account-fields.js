'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var fs = require('fs-extended');
var async = require('async');
var mongoose = require('../../../server/node_modules/mongoose/index');
var config = require('../../../server/common/setup/config');
var logFile = fs.createWriteStream(__dirname + '/update-account-fields.log', {flags: 'w'});
var logStdOut = process.stdout;
var modelsPath = config.root + '/server/common/models';
var db = mongoose.connect(config.db);

require('../../../server/common/setup/models')(modelsPath);

console.log = function (data) {
    logFile.write(data + '\n');
    logStdOut.write(data + '\n');
};

var Accounts = mongoose.model('Account');

function updateMerchantField(cb) {
    Accounts.update({}, {$set: {merchant: 'YIPTV'}}, {upsert: false, multi: true}, function (err, result) {
        if (err) {
            console.log('Error updating merchant field in accounts : ' + err);
        } else {
            console.log('Number of accounts updated with merchant field: ' + result);
        }
        cb(err);
    });
}

function addStartDateField(cb) {
    Accounts.find({}).populate('primaryUser').exec(function (err, accounts) {
            var counter = 0;
            var successCounter = 0;
            async.eachSeries(
                accounts,
                function (account, callback) {
                    counter++;
                    if (account.primaryUser) {
                        account.startDate = account.primaryUser.createdAt;
                        account.save(function (err) {
                            if (err) {
                                console.log('Error setting startDate for ' + account.primaryUser.email + ': ' + err);
                            } else {
                                successCounter++;
                            }
                            callback();
                        });
                    } else {
                        console.log('User not found for account id ' + account._id);
                        callback();
                    }
                },
                function () {
                    console.log('Total accounts: ' + counter);
                    console.log('Total accounts successfully updated with start date: ' + successCounter);
                    cb();
                }
            );
        }
    );
}

async.waterfall([
    function (callback) {
        updateMerchantField(function () {
            callback();
        });
    },
    function (callback) {
        addStartDateField(function () {
            callback();
        });
    }
], function () {
    setTimeout(function () {
        process.exit(0);
    }, 3000);
});
