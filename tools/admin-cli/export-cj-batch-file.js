'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var fs = require('fs'),
    config = require('../../server/common/setup/config'),
    mongoose = require('../../server/node_modules/mongoose'),
    moment = require('moment-timezone');


var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/setup/models')(modelsPath);
var Account = mongoose.model('Account');

if (process.argv[2] === '-h') {
    printUsage();
    process.exit(0);
}

if (process.argv.length !== 4) {
    console.log('adminCLI - exportCjBatchFile - required parameters missing.');
    printUsage();
    process.exit(1);
}

var startDate = process.argv[2];
var endDate = process.argv[3];
var query = {merchant: 'CJ'};
if (!moment(startDate, 'MM/DD/YYYY', true).isValid()) {
    console.log('adminCLI - exportCjBatchFile - enter a valid start date in MM/DD/YYYY format');
    printUsage();
    process.exit(1);
}
var utcStartDate = moment.tz(startDate, 'MM/DD/YYYY', 'America/Los_Angeles').toDate().toUTCString();
query.createdAt = {$gte: utcStartDate};
if (!moment(endDate, 'MM/DD/YYYY', true).isValid()) {
    console.log('adminCLI - exportCjBatchFile - enter a valid end date in MM/DD/YYYY format');
    printUsage();
    process.exit(1);
}
if (moment(startDate, 'MM/DD/YYYY', true).isAfter(moment(endDate, 'MM/DD/YYYY', true))) {
    console.log('adminCLI - exportCjBatchFile - end date should be greater than start date');
    printUsage();
    process.exit(1);
}
var utcEndDate = moment.tz(endDate, 'MM/DD/YYYY', 'America/Los_Angeles').add(1, 'days').toDate().toUTCString();
query.createdAt.$lt = utcEndDate;
Account.find(query, {}, {$sort:{createdAt: 1}}).populate('primaryUser').exec(function (err, accounts) {
    if (err) {
        console.log('adminCLI - exportCjBatchFile - error fetching partner accounts');
        console.log(err);
        process.exit(1);
    } else if (!accounts || accounts.length === 0) {
        console.log('adminCLI - exportCjBatchFile - no accounts found!');
        process.exit(0);
    } else {
        var data = '&CID=4630657' + '\n';
        data += '&SUBID=180563' + '\n';
        for (var i = 0; i < accounts.length; i++) {
            if (accounts[i].primaryUser && accounts[i].primaryUser.status === 'active') {
                data += getOid(accounts[i]) + ',' + getOriginalActionId(accounts[i]) + ',' + getNewActionId(accounts[i]) + ',' + getEventDate(accounts[i]) + '\n';
            }
        }
        fs.writeFile(__dirname + '/cj-batch-report-' + getDateTime(new Date()) + '.csv', data, function (err) {
            if (err) {
                console.log(err);
                process.exit(1);
            } else {
                process.exit(0);
            }
        });
    }
});

function printUsage() {
    console.log('Usage: node export-cj-batch-file <start-date> <end-date>');
    console.log('Example usage: node export-cj-batch-file 01/01/2016 01/31/2016');
    console.log('Use -h option to get this usage information');
}

function getDateTime(date) {
    return date.getUTCFullYear() + pad(date.getUTCMonth() + 1) + pad(date.getUTCDate()) + '-' + pad(date.getUTCHours()) + pad(date.getUTCMinutes()) + pad(date.getUTCSeconds());
}

function pad(number) {
    var num = String(number);
    if (num.length === 1) {
        num = '0' + num;
    }
    return num;
}

function getOid(account) {
    if (account.type === 'free') {
        return account.primaryUser._id + '_free_' + account.primaryUser.createdAt.getTime() + '_0';
    } else if (account.type === 'paid') {
        var upgradeDate = account.primaryUser.upgradeDate ? account.primaryUser.upgradeDate.getTime() : '0';
        return account.primaryUser._id + '_paid_' + account.primaryUser.createdAt.getTime() + '_' + upgradeDate;
    } else {
        return '0_0_0_0';
    }
}

function getOriginalActionId(account) {
    if (account.type === 'free') {
        return '383212';
    } else if (account.type === 'paid' && account.primaryUser.upgradeDate) {
        return '385174';
    } else {
        return '384431';
    }
}

function getNewActionId(account) {
    if (account.type === 'free') {
        return '385174';
    } else if (account.type === 'paid' && account.primaryUser.upgradeDate) {
        return '383213';
    } else {
        return '385175';
    }
}

function getEventDate(account) {
    var eventDate = account.primaryUser.createdAt;
    return moment(eventDate).tz('America/Los_Angeles').format('MM/DD/YYYY hh:mm A');
}
