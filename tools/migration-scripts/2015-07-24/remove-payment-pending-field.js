'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var fs = require('fs-extended');
var mongoose = require('../../../server/node_modules/mongoose/index');
var config = require('../../../server/common/setup/config');
var logFile = fs.createWriteStream(__dirname + '/remove-payment-pending-field.log', {flags: 'w'});
var logStdOut = process.stdout;
var modelsPath = config.root + '/server/common/models';
var db = mongoose.connect(config.db);

require('../../../server/common/setup/models')(modelsPath);

console.log = function (data) {
    logFile.write(data + '\n');
    logStdOut.write(data + '\n');
};

var Accounts = mongoose.model('Account');


Accounts.update({}, {$unset: {paymentPending: ''}}, {upsert: false, multi: true}, function (err, result) {
    if (err) {
        console.log('Error removing paymentPending from accounts: ' + err);
    } else {
        console.log('Number of accounts from which paymentPending was removed: ' + result);
    }
    setTimeout(function () {
        process.exit(0);
    }, 3000);
});
