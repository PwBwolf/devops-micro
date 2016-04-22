'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    validation = require('../../server/common/services/validation'),
    mongoose = require('../../server/node_modules/mongoose');

var email = process.argv[2];

if (typeof email === 'undefined') {
    logger.logError('adminCLI - endComplimentarySubscription - email or mobile number is missing!\n\r\tusage: node end-complimentary-subscription <email/mobile>');
    process.exit(1);
} else {
    var emailRegex = config.regex.email;
    var phoneRegex = config.regex.telephone;
    var isEmail = emailRegex.test(email);
    var isPhone = phoneRegex.test(email);
    if (!isEmail && !isPhone) {
        logger.logError('adminCLI - endComplimentarySubscription - enter a valid email address or mobile number.');
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
                logger.logError('adminCLI - endComplimentarySubscription - error fetching user: ' + username);
                logger.logError(err);
                process.exit(1);
            } else if (!user) {
                logger.logError('adminCLI - endComplimentarySubscription - user not found: ' + username);
                process.exit(1);
            } else if (user.status === 'failed') {
                logger.logError('adminCLI - endComplimentarySubscription - failed user: ' + username);
                process.exit(1);
            } else if (user.account.type === 'free') {
                logger.logError('adminCLI - endComplimentarySubscription - free user: ' + username);
                process.exit(1);
            } else if (user.account.type === 'paid') {
                logger.logError('adminCLI - endComplimentarySubscription - premium user: ' + username);
                process.exit(1);
            } else {
                subscription.endComplimentarySubscription(username, function (err) {
                    if (err) {
                        logger.logError('adminCLI - endComplimentarySubscription - error ending complimentary subscription');
                        logger.logError(err);
                        setTimeout(function () {
                            process.exit(1);
                        }, 3000);
                    } else {
                        logger.logInfo('adminCLI - endComplimentarySubscription - complimentary subscription canceled');
                        setTimeout(function () {
                            process.exit(0);
                        }, 10000);
                    }
                });
            }
        });
    }
});

