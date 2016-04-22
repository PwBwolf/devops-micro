'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    validation = require('../../server/common/services/validation'),
    mongoose = require('../../server/node_modules/mongoose');

var email = process.argv[2];
var code = process.argv[3];

if (typeof email === 'undefined') {
    logger.logError('adminCLI - convertToComplimentarySubscription - email or mobile number is missing!\n\r\tusage: node convert-to-complimentary-subscription <email/mobile> code');
    process.exit(1);
} else if (typeof code === 'undefined') {
    logger.logError('adminCLI - convertToComplimentarySubscription - complimentary code is missing!\n\r\tusage: node convert-to-complimentary-subscription <email/mobile> code');
    process.exit(1);
} else {
    var emailRegex = config.regex.email;
    var phoneRegex = config.regex.telephone;
    var isEmail = emailRegex.test(email);
    var isPhone = phoneRegex.test(email);
    if (!isEmail && !isPhone) {
        logger.logError('adminCLI - convertToComplimentarySubscription - enter a valid email address or mobile number.');
        process.exit(1);
    }
}

var modelsPath = config.root + '/server/common/models';

mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - endComplimentarySubscription - db connection error');
    } else {
        require('../../server/common/setup/models')(modelsPath);
        var Users = mongoose.model('User');
        var subscription = require('../../server/common/services/subscription');
        var username = validation.getUsername(email);
        Users.findOne({email: username}).populate('account').exec(function (err, user) {
            if (err) {
                logger.logError('adminCLI - convertToComplimentarySubscription - error fetching user: ' + username);
                logger.logError(err);
                process.exit(1);
            } else if (!user) {
                logger.logError('adminCLI - convertToComplimentarySubscription - user not found: ' + username);
                process.exit(1);
            } else if (user.status === 'failed') {
                logger.logError('adminCLI - convertToComplimentarySubscription - failed user: ' + username);
                process.exit(1);
            } else if (user.account.type === 'comp') {
                logger.logError('adminCLI - convertToComplimentarySubscription - complimentary user: ' + username);
                process.exit(1);
            } else if (user.account.type === 'paid') {
                logger.logError('adminCLI - convertToComplimentarySubscription - premium user: ' + username);
                process.exit(1);
            } else {
                subscription.convertToComplimentary(username, {code:code}, function (err) {
                    if (err) {
                        logger.logError('adminCLI - convertToComplimentarySubscription - error converting to complimentary subscription');
                        logger.logError(err);
                        setTimeout(function () {
                            process.exit(1);
                        }, 3000);
                    } else {
                        logger.logInfo('adminCLI - convertToComplimentarySubscription - successfully converted to complimentary subscription');
                        setTimeout(function () {
                            process.exit(0);
                        }, 10000);
                    }
                });
            }
        });
    }
});
