'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var fs = require('fs-extended');
var async = require('async');
var mongoose = require('../../../server/node_modules/mongoose/index');
var config = require('../../../server/common/setup/config');
var logFile = fs.createWriteStream(__dirname + '/update-comp-user-packages.log', {flags: 'w'});
var logStdOut = process.stdout;
var modelsPath = config.root + '/server/common/models';
var db = mongoose.connect(config.db);

require('../../../server/common/setup/models')(modelsPath);

console.log = function (data) {
    logFile.write(data + '\n');
    logStdOut.write(data + '\n');
};

var Accounts = mongoose.model('Account');

Accounts.find({type: 'comp'}).populate('primaryUser').exec(function (err, accounts) {
        var counter = 0;
        var successCounter = 0;
        async.eachSeries(
            accounts,
            function (account, callback) {
                counter++;
                if (account.primaryUser) {
                    updateAccount(account, function (err) {
                        if (err) {
                            console.log('Error updating packages for ' + account.primaryUser.email);
                        } else {
                            console.log('Successfully updated packages for ' + account.primaryUser.email);
                            successCounter++;
                        }
                        callback();
                    });
                } else {
                    console.log('User not found for ' + account._id);
                    callback();
                }
            },
            function () {
                console.log('Total accounts: ' + counter);
                console.log('Total accounts successfully updated: ' + successCounter);
                setTimeout(function () {
                    process.exit(0);
                }, 3000);
            }
        );
    }
);

function updateAccount(account, cb) {
    account.packages = config.complimentaryUserPackages;
    account.save(function (err) {
        if (err) {
            console.log('Error saving account for ' + account.primaryUser.email);
        }
        cb(err);
    });
}
