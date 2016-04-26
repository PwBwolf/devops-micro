'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    validation = require('../../server/common/services/validation'),
    billing = require('../../server/common/services/billing'),
    moment = require('moment'),
    async = require('async'),
    fs = require('fs-extended'),
    mongoose = require('../../server/node_modules/mongoose');

var modelsPath = config.root + '/server/common/models';

mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - exportCompUsersWithExpiryDate - db connection error');
    } else {
        require('../../server/common/setup/models')(modelsPath);
        var Account = mongoose.model('Account');
        Account.find({'type': 'comp'}).populate('primaryUser').exec(function (err, accounts) {
            if (err) {
                logger.logError('adminCLI - exportCompUsersWithExpiryDate - error fetching accounts');
                logger.logError(err);
                process.exit(1);
            } else if (!accounts || accounts.length === 0) {
                logger.logError('adminCLI - exportCompUsersWithExpiryDate - no accounts found!');
                process.exit(0);
            } else {
                console.log('Expiry Date,Username');
                for (var i = 0; i < accounts.length; i++) {
                    if (accounts[i].primaryUser) {
                        console.log(formatDate(accounts[i].primaryUser.validTill) + ',' + accounts[i].primaryUser.email);
                    }
                }
                process.exit(0);
            }
        });
    }
});

function formatDate(date) {
    if (date) {
        return moment.utc(date).format('MM/DD/YYYY');
    } else {
        return '';
    }
}
