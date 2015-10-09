'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    mongoose = require('../../server/node_modules/mongoose');

var email = process.argv[2],
    status = process.argv[3];

if (typeof email === 'undefined') {
    logger.logError('adminCli - crmUserSetStatus - email is missing!\n\r\tusage: node crm-user-set-status <email> <status>');
    process.exit(1);
} else {
    var regex = config.regex.email;
    var isEmail = regex.test(email);
    if (!isEmail) {
        logger.logError('adminCLI - crmUserSetStatus - enter a valid email address.');
        process.exit(1);
    }
}

if (status !== 'active' && status !== 'inactive') {
    logger.logError('adminCLI - crmUserSetStatus - enter a valid status (active or inactive)');
    process.exit(1);
}

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/setup/models')(modelsPath);
var CrmUser = mongoose.model('CrmUser');

CrmUser.findOne({email: email.toLowerCase()}, function (err, user) {
    if (err) {
        logger.logError('adminCLI - crmUserSetStatus - error fetching user: ' + email.toLowerCase());
        logger.logError(err);
        process.exit(1);
    } else if (!user) {
        logger.logError('adminCLI - crmUserSetStatus - status cannot be changed as the user was not found: ' + email.toLowerCase());
        process.exit(1);
    } else {
        user.status = status;
        user.save(function (err) {
            if (err) {
                logger.logError('adminCLI - crmUserSetStatus - error changing user status: ' + email.toLowerCase());
                logger.logError(err);
                process.exit(1);
            }
            logger.logInfo('adminCLI - crmUserSetStatus - status changed successfully for user: ' + email.toLowerCase());
            process.exit(0);
        });
    }
});
