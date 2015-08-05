'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    moment = require('moment'),
    mongoose = require('../../server/node_modules/mongoose');

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/setup/models')(modelsPath);
var User = mongoose.model('User');

User.find({}).populate('account').exec(function (err, users) {
    if (err) {
        logger.logError('adminCLI - exportUsers - error fetching users');
        logger.logError(err);
        process.exit(1);
    } else if (!users || users.length === 0) {
        logger.logError('adminCLI - exportUsers - no users found!');
        process.exit(0);
    } else {
        console.log('"Email","First Name","Last Name","Telephone","Status","Type","FreeSide Customer Number","AIO Account ID","Is Payment Pending","Create Date","Upgrade Date","Cancel Date","Cancel On Date","Valid Till Date","Complimentary Code","Referred By","Merchant","Old Status","Start Date"');
        for (var i = 0; i < users.length; i++) {
            if (users[i].account) {
                console.log(
                    formatString(users[i].email) + ',' + formatString(users[i].firstName) + ',' + formatString(users[i].lastName) + ',' + formatString(users[i].telephone) + ',' + formatString(users[i].status) + ',' +
                    formatString(users[i].account.type) + ',' + formatString(users[i].account.freeSideCustomerNumber) + ',' + formatString(users[i].account.aioAccountId) + ',' +
                    formatDate(users[i].createdAt) + ',' + formatDate(users[i].upgradeDate) + ',' + formatDate(users[i].cancelDate) + ',' + formatDate(users[i].cancelOn) + ',' + formatDate(users[i].validTill) + ',' +
                    formatString(users[i].account.complimentaryCode) + ',' + formatString(users[i].account.referredBy) + ',' + formatString(users[i].account.merchant) + ',' + formatString(users[i].oldInactiveUser) + ',' + formatDate(users[i].account.startDate)
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

