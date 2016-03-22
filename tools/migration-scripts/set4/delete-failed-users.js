'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var fs = require('fs-extended');
var async = require('async');
var mongoose = require('../../../server/node_modules/mongoose/index');
var config = require('../../../server/common/setup/config');
var logFile = fs.createWriteStream(__dirname + '/delete-failed-users.log', {flags: 'w'});
var logStdOut = process.stdout;
var modelsPath = config.root + '/server/common/models';
var db = mongoose.connect(config.db);

require('../../../server/common/setup/models')(modelsPath);

console.log = function (data) {
    logFile.write(data + '\n');
    logStdOut.write(data + '\n');
};

var Users = mongoose.model('User');

var userCounter = 0;
var accountCounter = 0;

Users.find({status: 'failed'}).populate('account').exec(function (err, users) {
    if (err) {
        console.log('Error finding failed users: ' + err);
        process.exit(1);
    } else {
        console.log('Total failed users: ' + users.length);
        async.eachSeries(
            users,
            function (user, callback) {
                if (user.account) {
                    user.account.remove(function (err) {
                        if (err) {
                            console.log('Error removing account for ' + user.email);
                            callback(err);
                        } else {
                            accountCounter++;
                            console.log('Removed account for ' + user.email);
                            removeUser(user, function (err) {
                                if (err) {
                                    console.log('Error removing account for ' + user.email);
                                }
                                callback(err);
                            });
                        }
                    });
                } else {
                    removeUser(user, function (err) {
                        callback(err);
                    });
                }
            },
            function (err) {
                if (err) {
                    console.log(err);
                }
                console.log('Total failed users successfully deleted: ' + userCounter);
                console.log('Total failed accounts successfully deleted: ' + accountCounter);
                setTimeout(function () {
                    process.exit(0);
                }, 3000);
            }
        );
    }
});

function removeUser(user, cb) {
    if (user) {
        user.remove(function (err) {
            if (err) {
                console.log('Error removing user for ' + user.email);
            } else {
                console.log('Removed user for ' + user.email);
                userCounter++;
            }
            cb(err);
        });
    } else {
        cb();
    }
}

