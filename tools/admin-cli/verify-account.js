'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var sf = require('sf'),
    config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    aio = require('../../server/common/services/aio'),
    emailService = require('../../server/common/services/email'),
    mongoose = require('../../server/node_modules/mongoose');

var email = process.argv[2];

if (typeof email === 'undefined') {
    logger.logError('adminCLI - verifyAccount - email is missing!\n\r\tusage: node verify-account <email>');
    process.exit(1);
} else {
    var regex = config.regex.email;
    var isEmail = regex.test(email);
    if (!isEmail) {
        logger.logError('adminCLI - verifyAccount - enter a valid email address.');
        process.exit(1);
    }
}

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/setup/models')(modelsPath);
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
        var status = user.status;
        var verificationCode = user.verificationCode;
        var verificationPin = user.verificationPin;
        user.status = 'active';
        user.verificationCode = undefined;
        user.verificationPin = undefined;
        user.save(function (err) {
            if (err) {
                logger.logError('adminCLI - verifyAccount - error saving user.');
                logger.logError(err);
                process.exit(1);
            } else {
                aio.updateUserStatus(user.email, true, function (err) {
                    if (err) {
                        logger.logError('adminCLI - verifyAccount - error setting user active in aio');
                        logger.logError(err);
                        user.status = status;
                        user.verificationCode = verificationCode;
                        user.verificationPin = verificationPin;
                        user.save(function (err) {
                            if (err) {
                                logger.logError('adminCLI - verifyAccount - error reverting user');
                                logger.logError(err);
                            }
                            process.exit(1);
                        });
                    } else {
                        logger.logInfo('adminCLI - verifyAccount - account verified successfully');
                        sendAccountVerifiedEmail(user, function (err) {
                            if (err) {
                                logger.logError('adminCLI - verifyAccount - error sending email');
                                process.exit(1);
                            } else {
                                logger.logInfo('adminCLI - verifyAccount - email sent to user');
                                process.exit(0);
                            }
                        });
                    }
                });
            }
        });
    }
});

function sendAccountVerifiedEmail(user, cb) {
    var signInUrl = config.url + 'sign-in?email=' + encodeURIComponent(user.email);
    var mailOptions = {
        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
        to: user.email,
        subject: config.accountVerifiedEmailSubject[user.preferences.defaultLanguage],
        html: sf(config.accountVerifiedEmailBody[user.preferences.defaultLanguage], config.imageUrl, signInUrl)
    };
    emailService.sendEmail(mailOptions, function (err) {
        if (cb) {
            cb(err);
        }
    });
}
