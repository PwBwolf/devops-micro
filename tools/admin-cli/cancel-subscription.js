'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    validation = require('../../server/common/services/validation'),
    mongoose = require('../../server/node_modules/mongoose');

var email = process.argv[2];

if (typeof email === 'undefined') {
    logger.logError('adminCLI - cancelSubscription - email or mobile number is missing!\n\r\tusage: node cancel-subscription <email/mobile>');
    process.exit(1);
} else {
    var emailRegex = config.regex.email;
    var phoneRegex = config.regex.telephone;
    var isEmail = emailRegex.test(email);
    var isPhone = phoneRegex.test(email);
    if (!isEmail && !isPhone) {
        logger.logError('adminCLI - cancelSubscription - enter a valid email address or mobile number.');
        process.exit(1);
    }
}

var modelsPath = config.root + '/server/common/models';

mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - cancelSubscription - db connection error');
    } else {
        require('../../server/common/setup/models')(modelsPath);
        var Users = mongoose.model('User');
        var subscription = require('../../server/common/services/subscription');
        var username = validation.getUsername(email);
        Users.findOne({email: username}).populate('account').exec(function (err, user) {
            if (err) {
                logger.logError('adminCLI - cancelSubscription - error fetching user: ' + username);
                logger.logError(err);
                process.exit(1);
            } else if (!user) {
                logger.logError('adminCLI - cancelSubscription - user not found: ' + username);
                process.exit(1);
            } else if (user.cancelOn) {
                logger.logError('adminCLI - cancelSubscription - user\'s premium subscription is already due for cancellation on ' + getFormattedDate(user.cancelOn) + ' for user: ' + username);
                process.exit(1);
            } else if (user.status === 'failed') {
                logger.logError('adminCLI - cancelSubscription - failed user: ' + username);
                process.exit(1);
            } else if (user.status === 'suspended') {
                logger.logError('adminCLI - cancelSubscription - suspended user: ' + username);
                process.exit(1);
            } else if (user.account.type === 'free') {
                logger.logError('adminCLI - cancelSubscription - free user: ' + username);
                process.exit(1);
            } else if (user.account.type === 'comp') {
                logger.logError('adminCLI - cancelSubscription - complimentary user: ' + username);
                process.exit(1);
            } else {
                subscription.cancelSubscription(username, function (err) {
                    if (err) {
                        logger.logError('adminCLI - cancelSubscription - error canceling subscription');
                        logger.logError(err);
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
    }
});

function getFormattedDate(date) {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    return month + '/' + day + '/' + year;
}
