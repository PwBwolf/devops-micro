'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    mongoose = require('../../server/node_modules/mongoose');

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/setup/models')(modelsPath);
var Account = mongoose.model('Account');

Account.find({}).populate('primaryUser').exec(function (err, accounts) {
    if (err) {
        logger.logError('adminCLI - exportUsers - error fetching accounts');
        logger.logError(err);
        process.exit(1);
    } else if (!accounts || accounts.length === 0) {
        logger.logError('adminCLI - exportUsers - no accounts found!');
        process.exit(0);
    } else {
        for (var i = 0; i < accounts.length; i++) {
            if (accounts[i].primaryUser && accounts[i].freeSideCustomerNumber) {
                console.log(accounts[i].freeSideCustomerNumber + ',' + accounts[i].primaryUser.email + ',' + accounts[i].primaryUser.createdAt.getTime());
            }
        }
        process.exit(0);
    }
});