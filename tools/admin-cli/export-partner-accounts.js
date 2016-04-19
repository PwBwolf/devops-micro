'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    mongoose = require('../../server/node_modules/mongoose'),
    moment = require('moment');

var modelsPath = config.root + '/server/common/models';
mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - exportPartnerAccounts - db connection error');
    } else {
        require('../../server/common/setup/models')(modelsPath);
        var Account = mongoose.model('Account');
        if (process.argv[2] === '-h') {
            printUsage();
            process.exit(0);
        }
        if (process.argv.length > 5) {
            logger.logError('adminCLI - exportPartnerAccounts - you have passed more number of parameters than the tool accepts.');
            printUsage();
            process.exit(1);
        }
        var merchant = process.argv[2];
        var startDate = process.argv[3];
        var endDate = process.argv[4];
        if (merchant) {
            merchant = merchant.toUpperCase();
        } else {
            logger.logError('adminCLI - exportPartnerAccounts - enter a merchant name.');
            printUsage();
            process.exit(1);
        }
        var query = {merchant: merchant};
        if (startDate) {
            if (!moment(startDate, 'MM/DD/YYYY', true).isValid()) {
                logger.logError('adminCLI - exportPartnerAccounts - enter a valid start date in MM/DD/YYYY format');
                printUsage();
                process.exit(1);
            }
            query.createdAt = {$gte: moment.utc(startDate, 'MM/DD/YYYY').toDate().toUTCString()};
            if (endDate) {
                if (!moment(endDate, 'MM/DD/YYYY', true).isValid()) {
                    logger.logError('adminCLI - exportPartnerAccounts - enter a valid end date in MM/DD/YYYY format');
                    printUsage();
                    process.exit(1);
                }
                if (moment(startDate, 'MM/DD/YYYY', true).isAfter(moment(endDate, 'MM/DD/YYYY', true))) {
                    logger.logError('adminCLI - exportPartnerAccounts - end date should be greater than start date');
                    printUsage();
                    process.exit(1);
                }
                query.createdAt.$lt = moment.utc(endDate, 'MM/DD/YYYY').add(1, 'days').toDate().toUTCString();
            }
        }
        Account.find(query, {}, {sort: {createdAt: 1}}).populate('primaryUser').exec(function (err, accounts) {
            if (err) {
                logger.logError('adminCLI - exportPartnerAccounts - error fetching partner accounts');
                logger.logError(err);
                process.exit(1);
            } else if (!accounts || accounts.length === 0) {
                logger.logError('adminCLI - exportPartnerAccounts - no accounts found!');
                process.exit(0);
            } else {
                console.log('"Email","First Name","Last Name","Status","Freeside Customer Number","Account Create Date","Account Type","User Cancel Date","Cancel On Date","Merchant"');
                for (var i = 0; i < accounts.length; i++) {
                    if (accounts[i].primaryUser) {
                        console.log(
                            formatString(accounts[i].primaryUser.email) + ',' + formatString(accounts[i].primaryUser.firstName) + ',' +
                            formatString(accounts[i].primaryUser.lastName) + ',' + formatString(accounts[i].primaryUser.status) + ',' +
                            formatString(accounts[i].freeSideCustomerNumber) + ',' + formatDate(accounts[i].createdAt) + ',' + formatString(accounts[i].type) + ',' +
                            formatDate(accounts[i].primaryUser.cancelDate) + ',' + formatDate(accounts[i].primaryUser.cancelOn) + ',' + formatString(accounts[i].merchant)
                        );
                    }
                }
                process.exit(0);
            }
        });
    }

    function formatDate(date) {
        if (date) {
            return '"' + moment.utc(date).format('MM/DD/YYYY') + '"';
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
        logger.logInfo('Usage: node export-partner-accounts <merchant-name> <start-date> <end-date>');
        logger.logInfo('       <start-date> and <end-date> are optional, date format is MM/DD/YYYY');
        logger.logInfo('       Example usage: node export-partner-accounts TRUCONN 08/01/2015 08/30/2015');
        logger.logInfo('       Use -h option to get this usage information');
    }
});
