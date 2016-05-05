'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var sf = require('sf'),
    config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    emailService = require('../../server/common/services/email'),
    validation = require('../../server/common/services/validation'),
    twilio = require('../../server/common/services/twilio'),
    mongoose = require('../../server/node_modules/mongoose');

var email = process.argv[2],
    password = process.argv[3];

if (typeof email === 'undefined') {
    logger.logError('adminCli - resetPassword - email or mobile number is missing!\n\r\tusage: node reset-password <email/mobile> <password>');
    process.exit(1);
} else {
    var emailRegex = config.regex.email;
    var phoneRegex = config.regex.telephone;
    var isEmail = emailRegex.test(email);
    var isPhone = phoneRegex.test(email);
    if (!isEmail && !isPhone) {
        logger.logError('adminCLI - resetPassword - enter a valid email address or mobile number.');
        process.exit(1);
    }
}

if (typeof password === 'undefined') {
    logger.logError('adminCLI - resetPassword - password is missing!\n\r\tusage: node reset-password <email/mobile> <password>');
    process.exit(1);
} else {
    var hasUpperCase = /[A-Z]/.test(password);
    var hasNumbers = /\d/.test(password);
    var characterGroupCount = hasUpperCase + hasNumbers;
    var isComplexPassword = (password.length >= 6) && (password.length <= 20) && (characterGroupCount >= 2);
    if (!isComplexPassword) {
        logger.logError('adminCLI - resetPassword - password should be between 6 to 20 characters, contain 1 uppercase and 1 number');
        process.exit(1);
    }
}

var modelsPath = config.root + '/server/common/models';
mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - resetPassword - db connection error');
    } else {
        require('../../server/common/setup/models')(modelsPath);
        var User = mongoose.model('User');

        var username = validation.getUsername(email);
        User.findOne({email: username}, function (err, user) {
            if (err) {
                logger.logError('adminCLI - resetPassword - error fetching user: ' + username);
                logger.logError(err);
                process.exit(1);
            } else if (!user) {
                logger.logError('adminCLI - resetPassword - password cannot be changed as the user was not found: ' + username);
                process.exit(1);
            } else if (user.status === 'registered') {
                logger.logError('adminCLI - resetPassword - password cannot be changed as the account is not verified: ' + username);
                process.exit(1);
            } else if (user.status === 'failed') {
                logger.logError('adminCLI - resetPassword - password cannot be changed as the account was not created successfully: ' + username);
                process.exit(1);
            } else if (user.status === 'suspended') {
                logger.logError('adminCLI - resetPassword - password cannot be changed as the account is suspended: ' + username);
                process.exit(1);
            } else {
                var hashedPassword = user.hashedPassword;
                var salt = user.salt;
                user.password = password;
                user.save(function (err) {
                    if (err) {
                        logger.logError('adminCLI - resetPassword - error saving new password to user: ' + username);
                        logger.logError(err);
                        process.exit(1);
                    } else {
                        logger.logInfo('adminCLI - resetPassword - password changed successfully: ' + username);
                        if (validation.isUsPhoneNumberInternationalFormat(username)) {
                            logger.logInfo('adminCLI - resetPassword - sending password changed sms to ' + username);
                            var message = sf(config.passwordChangedSmsMessage[user.preferences.defaultLanguage], config.customerCareNumber);
                            twilio.sendSms(config.twilioAccountSmsNumber, user.email, message, function (err) {
                                if (err) {
                                    logger.logError('adminCLI - resetPassword - error sending sms: ' + user.email);
                                    logger.logError(err);
                                } else {
                                    logger.logInfo('adminCLI - resetPassword - sent sms successfully: ' + user.email);
                                    process.exit(0);
                                }
                            });
                        } else {
                            logger.logInfo('adminCLI - resetPassword - sending password changed email to ' + username);
                            var mailOptions = {
                                from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                                to: user.email,
                                subject: config.passwordChangedEmailSubject[user.preferences.defaultLanguage],
                                html: sf(config.passwordChangedEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.customerCareNumber)
                            };
                            emailService.sendEmail(mailOptions, function (err) {
                                if (err) {
                                    logger.logError('adminCLI - resetPassword - error sending password changed email to: ' + mailOptions.to);
                                    logger.logError(err);
                                    process.exit(1);
                                } else {
                                    logger.logInfo('adminCLI - resetPassword - password changed email sent to ' + mailOptions.to);
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
