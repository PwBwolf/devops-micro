'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var sf = require('sf'),
    config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    emailService = require('../../server/common/services/email'),
    aio = require('../../server/common/services/aio'),
    mongoose = require('../../server/node_modules/mongoose');

var email = process.argv[2],
    password = process.argv[3];

if (typeof email === 'undefined') {
    logger.logError('resetPassword - email is missing!\n\r\tusage: node reset-password <email> <password>');
    process.exit(1);
} else {
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
    var isEmail = regex.test(email);
    if (!isEmail) {
        logger.logError('adminCLI - resetPassword - enter a valid email address.');
        process.exit(1);
    }
}

if (typeof password === 'undefined') {
    logger.logError('adminCLI - resetPassword - password is missing!\n\r\tusage: node reset-password <email> <password>');
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

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/setup/models')(modelsPath);
var Users = mongoose.model('User');

Users.findOne({email: email.toLowerCase()}, function (err, user) {
    if (err) {
        logger.logError('adminCLI - resetPassword - error fetching user: ' + email.toLowerCase());
        logger.logError(err);
        process.exit(1);
    } else if (!user) {
        logger.logError('adminCLI - resetPassword - password cannot be changed as the user was not found: ' + email.toLowerCase());
        process.exit(1);
    } else if (user.status === 'registered') {
        logger.logError('adminCLI - resetPassword - password cannot be changed as the account is not verified: ' + email.toLowerCase());
        process.exit(1);
    } else if (user.status === 'failed') {
        logger.logError('adminCLI - resetPassword - password cannot be changed as the account was not created successfully: ' + email.toLowerCase());
        process.exit(1);
    } else {
        var hashedPassword = user.hashedPassword;
        var salt = user.salt;
        user.password = password;
        user.save(function (err) {
            if (err) {
                logger.logError('adminCLI - resetPassword - error saving new password to user: ' + email.toLowerCase());
                logger.logError(err);
                process.exit(1);
            } else {
                aio.updatePassword(user.email, password, function (err) {
                    if (err) {
                        logger.logError('adminCLI - resetPassword - error updating password in aio: ' + email.toLowerCase());
                        logger.logError(err);
                        user.hashedPassword = hashedPassword;
                        user.salt = salt;
                        user.save(function (err) {
                            if (err) {
                                logger.logError('adminCLI - resetPassword - error reverting password in db: ' + email.toLowerCase());
                                logger.logError(err);
                            }
                            process.exit(1);
                        });
                    } else {
                        logger.logInfo('adminCLI - resetPassword - password changed successfully: ' + email.toLowerCase());
                        logger.logInfo('adminCLI - resetPassword - sending password changed email to ' + email.toLowerCase());
                        var mailOptions = {
                            from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                            to: user.email,
                            subject: config.passwordChangedEmailSubject[user.preferences.defaultLanguage],
                            html: sf(config.passwordChangedEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName)
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
                });
            }
        });
    }
});
