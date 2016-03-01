'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var fs = require('fs-extended');
var async = require('async');
var mongoose = require('../../../server/node_modules/mongoose/index');
var config = require('../../../server/common/setup/config');
var logFile = fs.createWriteStream(__dirname + '/create-email-sms-subscription-field.log', {flags: 'w'});
var logStdOut = process.stdout;
var modelsPath = config.root + '/server/common/models';
var db = mongoose.connect(config.db);

require('../../../server/common/setup/models')(modelsPath);

console.log = function (data) {
    logFile.write(data + '\n');
    logStdOut.write(data + '\n');
};

var User = mongoose.model('User');

function createEmailSmsSubscriptionField(cb) {
    User.find({}).exec(function (err, users) {
            var counter = 0;
            var successCounter = 0;
            async.eachSeries(
                users,
                function (user, callback) {
                    counter++;
                    if (user.preferences.emailSubscription === true || user.preferences.emailSubscription === false) {
                        user.preferences.emailSmsSubscription = user.preferences.emailSubscription;
                        user.preferences.emailSubscription = undefined;
                    }
                    if (user.preferences.smsSubscription === true || user.preferences.smsSubscription === false) {
                        user.preferences.smsSubscription = undefined;
                    }
                    user.save(function (err) {
                        if (err) {
                            console.log('Error adding emailSmsSubscription for ' + user.email + ': ' + err);
                        } else {
                            successCounter++;
                        }
                        callback();
                    });
                },
                function () {
                    console.log('Total users: ' + counter);
                    console.log('Total users successfully updated with emailSmsSubscription field: ' + successCounter);
                    cb();
                }
            );
        }
    );
}

async.waterfall([
    function (callback) {
        createEmailSmsSubscriptionField(function () {
            callback();
        });
    }
], function () {
    setTimeout(function () {
        process.exit(0);
    }, 3000);
});
