'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/config/config'),
    logger = require('../../server/common/config/logger'),
    mongoose = require('../../server/node_modules/mongoose');

logger.cli();

var email = process.argv[2];

if (typeof email === 'undefined') {
    logger.logError('adminCLI - verifyAccount - email is missing!\n\r\tusage: node verify-account <email>');
    process.exit(1);
} else {
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
    var isEmail = regex.test(email);
    if (!isEmail) {
        logger.logError('adminCLI - verifyAccount - enter a valid email address.');
        process.exit(1);
    }
}

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/config/models')(modelsPath);
var Users = mongoose.model('User');

Users.findOne({email: email.toLowerCase()}, function (err, user) {
    if (err) {
        logger.logError('adminCLI - verifyAccount - error fetching user: ' + email.toLowerCase());
        logger.logError(err);
        process.exit(1);
    } else if (!user) {
        logger.logError('adminCLI - verifyAccount - account cannot be verified as the user was not found: ' + email.toLowerCase());
        process.exit(1);
    } else if (user.status === 'failed') {
        logger.logError('adminCLI - verifyAccount - account cannot be changed as the account was not created successfully: ' + email.toLowerCase());
        process.exit(1);
    } else if (user.status !== 'registered') {
        logger.logError('adminCLI - verifyAccount - account is already verified.');
        process.exit(1);
    } else {
        user.status = 'active';
        user.verificationCode = undefined;
        user.save(function (err1) {
            if (err1) {
                console.log(err1);
                process.exit(1);
            } else {
                logger.logInfo('adminCLI - verifyAccount - account verified successfully: ' + email.toLowerCase());
                process.exit(0);
            }
        });
    }
});
