'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var fs = require('fs-extended');
var async = require('async');
var mongoose = require('../../../server/node_modules/mongoose/index');
var config = require('../../../server/common/setup/config');
var aio = require('../../../server/common/services/aio');
var logFile = fs.createWriteStream(__dirname + '/migrate-paid-active-users.log', {flags: 'w'});
var logStdOut = process.stdout;
var modelsPath = config.root + '/server/common/models';
var db = mongoose.connect(config.db);

require('../../../server/common/setup/models')(modelsPath);

console.log = function (data) {
    logFile.write(data + '\n');
    logStdOut.write(data + '\n');
};

var Accounts = mongoose.model('Account');

Accounts.find({type: 'paid'}).populate('primaryUser').exec(function (err, accounts) {
        var counter = 0;
        var successCounter = 0;
        async.eachSeries(
            accounts,
            function (account, callback) {
                if (account.primaryUser && (account.primaryUser.status === 'active' || account.primaryUser.status === 'registered')) {
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
        // update packages in aio
        function (callback) {
            aio.updateUserPackages(email, config.aioPaidUserPackages, function (err) {
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
