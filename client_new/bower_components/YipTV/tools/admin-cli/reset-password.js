'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var sf = require('sf'),
    config = require('../../server/common/config/config'),
    logger = require('../../server/common/config/logger'),
    emailService = require('../../server/common/services/email'),
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
    var hasLowerCase = /[a-z]/.test(password);
    var hasNumbers = /\d/.test(password);
    var hasNonAlphas = /\W|_/.test(password);
    var characterGroupCount = hasUpperCase + hasLowerCase + hasNumbers + hasNonAlphas;
    var isComplexPassword = (password.length >= 8) && (password.length <= 20) && (characterGroupCount > 3);
    if (!isComplexPassword) {
        logger.logError('adminCLI - resetPassword - password should be between 8 to 20 characters, contain 1 uppercase & 1 lowercase letter, 1 number & 1 special character');
        process.exit(1);
    }
}

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/config/models')(modelsPath);
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
        user.password = password;
        user.save(function (err1) {
            if (err1) {
                logger.logError('adminCLI - resetPassword - error saving new password to user: ' + email.toLowerCase());
                logger.logError(err1);
                process.exit(1);
            } else {
                logger.logInfo('adminCLI - resetPassword - password changed successfully: ' + email.toLowerCase());
                var mailOptions = {
                    from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                    to: user.email,
                    subject: config.passwordChangedEmailSubject[user.preferences.defaultLanguage],
                    html: sf(config.passwordChangedEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName)
                };
                emailService.sendEmail(mailOptions, function (err2) {
                    if (err2) {
                        logger.logError(err2);
                        logger.logError('adminCLI - resetPassword - unable to send password changed email notification but password has been changed successfully: ' + mailOptions.to);
                        process.exit(1);
                    } else {
                        logger.logInfo('adminCLI - resetPassword - password changed email notification sent successfully: ' + mailOptions.to);
                        process.exit(0);
                    }
                });
            }
        });
    }
});
