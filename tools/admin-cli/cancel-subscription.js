'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    mongoose = require('../../server/node_modules/mongoose');

var email = process.argv[2];

if (typeof email === 'undefined') {
    logger.logError('adminCLI - cancelSubscription - email is missing!\n\r\tusage: node cancel-subscription <email>');
    process.exit(1);
} else {
    var regex = config.emailRegex;
    var isEmail = regex.test(email);
    if (!isEmail) {
        logger.logError('adminCLI - cancelSubscription - enter a valid email address.');
        process.exit(1);
    }
}

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/setup/models')(modelsPath);
var Users = mongoose.model('User');
var subscription = require('../../server/common/services/subscription');

Users.findOne({email: email.toLowerCase()}).populate('account').exec(function (err, user) {
    if (err) {
        logger.logError('adminCLI - cancelSubscription - error fetching user: ' + email.toLowerCase());
        logger.logError(err);
        process.exit(1);
    } else if (!user) {
        logger.logError('adminCLI - cancelSubscription - user not found: ' + email.toLowerCase());
        process.exit(1);
    } else if (user.status === 'failed') {
        logger.logError('adminCLI - cancelSubscription - failed user: ' + email.toLowerCase());
        process.exit(1);
    } else if (user.account.type === 'free') {
        logger.logError('adminCLI - cancelSubscription - free user: ' + email.toLowerCase());
        process.exit(1);
    } else if (user.account.type === 'comp') {
        logger.logError('adminCLI - cancelSubscription - complimentary user: ' + email.toLowerCase());
        process.exit(1);
    } else {
        subscription.cancelSubscription(email.toLowerCase(), function (err) {
            if (err) {
                logger.logError('adminCLI - cancelSubscription - error canceling subscription');
                logger.logError(err);
                if (err.message) {
                    logger.logError(err.message);
                }
                setTimeout(function () {
                    process.exit(1);
                }, 3000);
            } else {
                logger.logInfo('adminCLI - cancelSubscription - user subscription canceled');
                setTimeout(function () {
                    process.exit(0);
                }, 10000);
            }
        });
    }
});


