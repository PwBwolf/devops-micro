'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var fs = require('fs-extended');
var async = require('async');
var mongoose = require('../../../server/node_modules/mongoose/index');
var config = require('../../../server/common/setup/config');
var aio = require('../../../server/common/services/aio');
var logFile = fs.createWriteStream(__dirname + '/migrate-comp-ended-users.log', {flags: 'w'});
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
                if (account.primaryUser && account.primaryUser.status === 'comp-ended') {
                    counter++;
                    migrate(account, function (err) {
                        if (err) {
                            console.log('Error in migrating user ' + account.primaryUser.email);
                        } else {
                            console.log('Successfully migrated user ' + account.primaryUser.email);
                            successCounter++;
                        }
                        callback();
                    });
                } else {
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

function migrate(account, cb) {
    var email = account.primaryUser.email;
    async.waterfall([
        // update db
        function (callback) {
            account.type = 'free';
            account.primaryUser.status = 'active';
            account.primaryUser.oldInactiveUser = 200;
            account.primaryUser.validTill = undefined;
            account.complimentaryCode = undefined;
            account.primaryUser.save(function (err) {
                if (err) {
                    console.log('Error saving user ' + email);
                } else {
                    account.save(function (err) {
                        if (err) {
                            console.log('Error saving user ' + email);
                        }
                        callback(err);
                    });
                }
            });
        },
        // make user inactive in aio
        function (callback) {
            aio.updateUserStatus(email, false, function (err) {
                if (err) {
                    console.log('Error setting user inactive in aio for ' + email);
                }
                callback(err);
            });
        },
        // update packages in aio
        function (callback) {
            aio.updateUserPackages(email, config.aioFreePremiumUserPackages, function (err) {
                if (err) {
                    console.log('Error adding new packages in aio for ' + email);
                }
                callback(err);
            });
        }
    ], function (err) {
        cb(err);
    });
}
