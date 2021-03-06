'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    validation = require('../../server/common/services/validation'),
    mongoose = require('../../server/node_modules/mongoose');

var modelsPath = config.root + '/server/common/models';

mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - exportCjUsers - db connection error');
    } else {
        require('../../server/common/setup/models')(modelsPath);
        var Account = mongoose.model('Account');
        Account.find({'merchant': 'CJ'}).populate('primaryUser').exec(function (err, accounts) {
            if (err) {
                logger.logError('adminCLI - exportCjUsers - error fetching accounts');
                logger.logError(err);
                process.exit(1);
            } else if (!accounts || accounts.length === 0) {
                logger.logError('adminCLI - exportCjUsers - no accounts found!');
                process.exit(0);
            } else {
                for (var i = 0; i < accounts.length; i++) {
                    if (accounts[i].primaryUser) {
                        console.log(accounts[i].primaryUser.email + ',' + accounts[i].primaryUser.status + ',' + accounts[i].type);
                    }
                }
                process.exit(0);
            }
        });
    }
});
