'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    validation = require('../../server/common/services/validation'),
    mongoose = require('../../server/node_modules/mongoose');

var email = process.argv[2];

if (typeof email === 'undefined') {
    logger.logError('adminCLI - convertToFreeDbOnly - email or mobile number is missing!\n\r\tusage: node convert-to-free-db-only <email/mobile>');
    process.exit(1);
} else {
    var emailRegex = config.regex.email;
    var phoneRegex = config.regex.telephone;
    var isEmail = emailRegex.test(email);
    var isPhone = phoneRegex.test(email);
    if (!isEmail && !isPhone) {
        logger.logError('adminCLI - convertToFreeDbOnly - enter a valid email address or mobile number.');
        process.exit(1);
    }
}

var modelsPath = config.root + '/server/common/models';
mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - convertToFreeDbOnly - db connection error');
    } else {
        require('../../server/common/setup/models')(modelsPath);
        var Users = mongoose.model('User');
        var username = validation.getUsername(email);
        Users.findOne({email: username}).populate('account').exec(function (err, user) {
            if (err) {
                logger.logError('adminCLI - convertToFreeDbOnly - error fetching user: ' + username);
                logger.logError(err);
                process.exit(1);
            } else if (!user) {
                logger.logError('adminCLI - convertToFreeDbOnly - user not found: ' + username);
                process.exit(1);
            } else if (user.status === 'failed') {
                logger.logError('adminCLI - convertToFreeDbOnly - failed user: ' + username);
                process.exit(1);
            } else if (user.status === 'suspended') {
                logger.logError('adminCLI - convertToFreeDbOnly - suspended user: ' + username);
                process.exit(1);
            } else if (user.account.type === 'free') {
                logger.logError('adminCLI - convertToFreeDbOnly - free user: ' + username);
                process.exit(1);
            } else if (user.account.type === 'comp') {
                logger.logError('adminCLI - convertToFreeDbOnly - complimentary user: ' + username);
                process.exit(1);
            } else {
                user.account.billingDate = undefined;
                user.account.type = 'free';
                user.account.packages = config.freeUserPackages;
                user.cancelDate = (new Date()).toUTCString();
                user.cancelOn = undefined;
                user.save(function (err) {
                    if (err) {
                        logger.logError('subscription - convertToFreeDbOnly - error saving user with canceled status: ' + user.email);
                        process.exit(1);
                    } else {
                        user.account.save(function (err) {
                            if (err) {
                                logger.logError('subscription - convertToFreeDbOnly - error updating account: ' + user.email);
                                process.exit(1);
                            } else {
                                logger.logInfo('subscription - convertToFreeDbOnly - successfully converted user to free subscription: ' + user.email);
                                process.exit(0);
                            }
                        });
                    }
                });
            }
        });
    }
});
