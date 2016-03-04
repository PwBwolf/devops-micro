'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var fs = require('fs-extended');
var mongoose = require('../../../server/node_modules/mongoose/index');
var async = require('async');
var config = require('../../../server/common/setup/config');
var logFile = fs.createWriteStream(__dirname + '/remove-unused-fields.log', {flags: 'w'});
var logStdOut = process.stdout;
var modelsPath = config.root + '/server/common/models';
var db = mongoose.connect(config.db);

require('../../../server/common/setup/models')(modelsPath);

console.log = function (data) {
    logFile.write(data + '\n');
    logStdOut.write(data + '\n');
};

var User = mongoose.model('User');
var Account = mongoose.model('Account');
var ContactUs = mongoose.model('Account');

function removeUnusedFieldsFromUser(callback) {
    User.update({}, {
        $unset: {
            telephone: '',
            verificationCode: '',
            resetPasswordCode: ''
        }
    }, {upsert: false, multi: true}).exec(function (err, result) {
        if (err) {
            console.log('Error removing unused fields from User collection: ' + err);
        } else {
            console.log('Number of documents from which unused fields were removed from Users collection: ' + result);
        }
        callback();
    });
}

function removeUnusedFieldsFromAccount(callback) {
    Account.update({}, {
        $unset: {
            aioAccountId: ''
        }
    }, {upsert: false, multi: true}).exec(function (err, result) {
        if (err) {
            console.log('Error removing unused fields from Account collection: ' + err);
        } else {
            console.log('Number of documents from which unused fields were removed from Accounts collection: ' + result);
        }
        callback();
    });
}

function removeUnusedFieldsFromContactUs(callback) {
    ContactUs.update({}, {
        $unset: {
            telephone: ''
        }
    }, {upsert: false, multi: true}).exec(function (err, result) {
        if (err) {
            console.log('Error removing unused fields from ContactUs collection: ' + err);
        } else {
            console.log('Number of documents from which unused fields were removed from ContactUs collection: ' + result);
        }
        callback();
    });
}

async.waterfall([
    function (callback) {
        removeUnusedFieldsFromUser(function () {
            callback();
        });
    },
    function (callback) {
        removeUnusedFieldsFromAccount(function () {
            callback();
        });
    }
], function () {
    setTimeout(function () {
        process.exit(0);
    }, 3000);
});
