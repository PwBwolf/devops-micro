'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    mongoose = require('../../server/node_modules/mongoose');

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/setup/models')(modelsPath);
var User = mongoose.model('User');

User.find({}).populate('account').exec(function (err, users) {
    if (err) {
        logger.logError('adminCLI - exportPassword - error fetching users');
        logger.logError(err);
        process.exit(1);
    } else if (!users || users.length === 0) {
        logger.logError('adminCLI - exportPassword - no users found!');
        process.exit(0);
    } else {
        console.log('FreeSide Customer Number,Email,Password');
        for (var i = 0; i < users.length; i++) {
            if (users[i].account) {
                console.log(users[i].account.freeSideCustomerNumber + ',' + users[i].email + ',' + users[i].createdAt.getTime()+',');
            }
        }
        process.exit(0);
    }
});

