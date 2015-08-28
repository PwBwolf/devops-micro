'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    mongoose = require('../../server/node_modules/mongoose'),
    moment = require('moment');

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/setup/models')(modelsPath);
var Account = mongoose.model('Account');

var merchant = process.argv[2];
var startDate = process.argv[3];
var endDate = process.argv[4];

var query = merchant ? {merchant: merchant} : {merchant: {$exists: true}};
if (startDate) {
    query.createdAt = {$gte: (moment(startDate, 'MM/DD/YYYY').toDate())};
    query.createdAt.$lt = endDate ? (moment(endDate, 'MM/DD/YYYY').toDate()) : (moment().toDate());
}

logger.logInfo('Usage: node export-partner-accounts.js (merchant (start date (end date) ) ) Date format in mm/dd/yyyy');

Account.find(query).populate('primaryUser').exec(function (err, accounts) {
    if (err) {
        logger.logError('adminCLI - partnerUsersReport - error fetching partner accounts');
        logger.logError(err);

        process.exit(1);
    } else if (!accounts || accounts.length === 0) {
        logger.logError('adminCLI - partnerUsersReport - no accounts found!');
        process.exit(0);
    } else {
        console.log('"Email","First Name","Last Name","Telephone","Status","Freeside Customer Number","Account Create Date","User Cancel Date","Cancel On Date","Merchant"');
        for (var i = 0; i < accounts.length; i++) {
            if(accounts[i].primaryUser){
                console.log(
                    formatString(accounts[i].primaryUser.email) + ',' + formatString(accounts[i].primaryUser.firstName) + ',' +
                    formatString(accounts[i].primaryUser.lastName) + ',' + formatString(accounts[i].primaryUser.telephone) + ',' + formatString(accounts[i].primaryUser.status) + ',' +
                    formatString(accounts[i].freeSideCustomerNumber) + ',' +
                    formatDate(accounts[i].createdAt) + ',' + formatDate(accounts[i].primaryUser.cancelDate) + ',' + formatDate(accounts[i].primaryUser.cancelOn) + ',' +
                    formatString(accounts[i].merchant)
            );
            }
        }
        process.exit(0);
    }
});

function formatDate(date) {
    if (date) {
        return '"' + moment(date).format('MM/DD/YYYY') + '"';
    } else {
        return '""';
    }
}

function formatString(value) {
    if (value) {
        return '"' + value + '"';
    } else {
        return '""';
    }
}