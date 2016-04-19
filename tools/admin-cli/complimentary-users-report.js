'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    mongoose = require('../../server/node_modules/mongoose'),
    Table = require('cli-table');

var modelsPath = config.root + '/server/common/models';

mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - complimentaryUsersReport - db connection error');
    } else {
        require('../../server/common/setup/models')(modelsPath);
        var Account = mongoose.model('Account');
        var code = process.argv[2];
        var query = code ? {complimentaryCode: code} : {complimentaryCode: {$exists: true}};
        Account.find(query).populate('primaryUser').exec(function (err, accounts) {
            if (err) {
                logger.logError('adminCLI - complimentaryUsersReport - error fetching complimentary accounts');
                logger.logError(err);
                process.exit(1);
            } else if (!accounts || accounts.length === 0) {
                logger.logError('adminCLI - complimentaryUsersReport - no complimentary accounts found!');
                process.exit(0);
            } else {
                var table = new Table({head: ['User', 'Complimentary Code', 'User Sign Up Date', 'User Status']});
                for (var i = 0; i < accounts.length; i++) {
                    table.push([accounts[i].primaryUser.email, accounts[i].complimentaryCode, accounts[i].primaryUser.createdAt.toString(), accounts[i].primaryUser.status]);
                }
                console.log(table.toString());
                process.exit(0);
            }
        });
    }
});
