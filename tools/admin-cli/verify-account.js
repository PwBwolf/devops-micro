'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var sf = require('sf'),
    config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    emailService = require('../../server/common/services/email'),
    validation = require('../../server/common/services/validation'),
    twilio = require('../../server/common/services/twilio'),
    mongoose = require('../../server/node_modules/mongoose');

var email = process.argv[2];

if (typeof email === 'undefined') {
    logger.logError('adminCLI - verifyAccount - email or mobile number is missing!\n\r\tusage: node verify-account <email/mobile>');
    process.exit(1);
} else {
    var emailRegex = config.regex.email;
    var phoneRegex = config.regex.telephone;
    var isEmail = emailRegex.test(email);
    var isPhone = phoneRegex.test(email);
    if (!isEmail && !isPhone) {
        logger.logError('adminCLI - verifyAccount - enter a valid email address or mobile number.');
        process.exit(1);
    }
}

var modelsPath = config.root + '/server/common/models';
mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - verifyAccount - db connection error');
    } else {
        require('../../server/common/setup/models')(modelsPath);
        var Users = mongoose.model('User');
        var username = validation.getUsername(email);
        Users.findOne({email: username}, function (err, user) {
            if (err) {
                logger.logError('adminCLI - verifyAccount - error fetching user: ' + username);
                logger.logError(err);
                process.exit(1);
            } else if (!user) {
                logger.logError('adminCLI - verifyAccount - account cannot be verified as the user was not found: ' + username);
                process.exit(1);
            } else if (user.status === 'failed') {
                logger.logError('adminCLI - verifyAccount - account cannot be verified as the account was not created successfully: ' + username);
                process.exit(1);
            } else if (user.status === 'suspended') {
                logger.logError('adminCLI - verifyAccount - account cannot be verified as the account is suspended: ' + username);
                process.exit(1);
            } else if (user.status !== 'registered') {
                logger.logError('adminCLI - verifyAccount - account is already verified.');
                process.exit(1);
            } else {
                user.status = 'active';
                user.verificationPin = undefined;
                user.save(function (err) {
                    if (err) {
                        logger.logError('adminCLI - verifyAccount - error saving user.');
                        logger.logError(err);
                        process.exit(1);
                    } else {
                        logger.logInfo('adminCLI - verifyAccount - account verified successfully');
                        if (validation.isUsPhoneNumberInternationalFormat(username)) {
                            sendAccountVerifiedSms(user, function (err) {
                                if (err) {
                                    logger.logError('adminCLI - verifyAccount - error sending sms');
                                    process.exit(1);
                                } else {
                                    logger.logInfo('adminCLI - verifyAccount - sms sent to user');
                                    process.exit(0);
                                }
                            });
                        } else {
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
        html: sf(config.accountVerifiedEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, config.url, config.wordPressUrl)
    };
    emailService.sendEmail(mailOptions, function (err) {
        if (cb) {
            cb(err);
        }
    });
}

function sendAccountVerifiedSms(user, cb) {
    var message = sf(config.accountVerifiedSmsMessage[user.preferences.defaultLanguage]);
    twilio.sendSms(config.twilioAccountSmsNumber, user.email, message, function (err) {
        if (cb) {
            cb(err);
        }
    });
}
