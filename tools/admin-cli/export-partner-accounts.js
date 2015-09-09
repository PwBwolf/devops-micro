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

if(process.argv[2] === '-h' || process.argv.length > 5){
    printUsage();
    process.exit(0);
}

var merchant = process.argv[2];
var startDate = process.argv[3];
var endDate = process.argv[4];

if(merchant) {
    merchant = merchant.toUpperCase();
}else{
    logger.logError("Merchant is required. Please enter the  merchnant short name. Try -h for help");
    process.exit(1);
}
if(startDate ){
    if( !moment(startDate, 'MM/DD/YYYY',true).isValid() ) {
    logger.logError("Invalid Start Date. Please use MM/DD/YYYY format. ex:08/01/2015. Preceeding 0 required.");
    process.exit(1);
    }
}
if(endDate ){
    if( !moment(endDate, 'MM/DD/YYYY',true).isValid() ) {
    logger.logError("Invalid End Date. Please use MM/DD/YYYY format. ex:08/01/2015. Preceeding 0 required.");
    process.exit(1);
    }
}

var query = merchant ? {merchant: merchant} : {merchant: {$exists: true}};
if (startDate) {
    query.createdAt = {$gte: moment.utc(startDate, 'MM/DD/YYYY').toDate()};
    query.createdAt.$lt = endDate ? moment(endDate, 'MM/DD/YYYY').add(1,'days').toDate() : moment().add(1,'days').toDate();
}
Account.find(query).populate('primaryUser').exec(function (err, accounts) {
    if (err) {
        logger.logError('adminCLI - partnerUsersReport - error fetching partner accounts');
        logger.logError(err);

        process.exit(1);
    } else if (!accounts || accounts.length === 0) {
        logger.logError('adminCLI - partnerUsersReport - no accounts found!. Try changing options. Use -h for help');
        process.exit(0);
    } else {
        console.log('"Email","First Name","Last Name","Telephone","Status","Freeside Customer Number","Account Create Date","Account Bill Date","Account Type","User Cancel Date","Cancel On Date","Merchant"');
        for (var i = 0; i < accounts.length; i++) {
            if(accounts[i].primaryUser){
                console.log(
                    formatString(accounts[i].primaryUser.email) + ',' + formatString(accounts[i].primaryUser.firstName) + ',' +
                    formatString(accounts[i].primaryUser.lastName) + ',' + formatString(accounts[i].primaryUser.telephone) + ',' + formatString(accounts[i].primaryUser.status) + ',' +
                    formatString(accounts[i].freeSideCustomerNumber) + ',' + formatDate(accounts[i].createdAt) + ',' + formatDate(accounts[i].billingDate) + ',' + 
                    formatString(accounts[i].type) + ',' + formatDate(accounts[i].primaryUser.cancelDate) + ',' + formatDate(accounts[i].primaryUser.cancelOn) + ',' +
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

function printUsage() {
    logger.logInfo('Usage:node export-partner-accounts.js merchant [start date [end date] ]');
    logger.logInfo('start date, end date optional.');
    logger.logInfo('use -h option for usage info only');
    logger.logInfo('For merchant please use short name in uppercase.');
    logger.logInfo('Date format in MM/DD/YYYY, ex: 08/01/2015. preceeding 0 reqd.');
    logger.logInfo('Ex: node export-partner-accounts.js TRUCONN 08/01/2015 08/30/2015');
    
}