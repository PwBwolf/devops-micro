'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var sf = require('sf'),
    config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    emailService = require('../../server/common/services/email'),
    mongoose = require('../../server/node_modules/mongoose');

var email = process.argv[2],
    password = process.argv[3];

if (typeof email === 'undefined') {
    logger.logError('adminCli - crmUserResetPassword - email is missing!\n\r\tusage: node crm-user-reset-password <email> <password>');
    process.exit(1);
} else {
    var regex = config.regex.email;
    var isEmail = regex.test(email);
    if (!isEmail) {
        logger.logError('adminCLI - crmUserResetPassword - enter a valid email address.');
        process.exit(1);
    }
}

if (typeof password === 'undefined') {
    logger.logError('adminCLI - crmUserResetPassword - password is missing!\n\r\tusage: node reset-password <email> <password>');
    process.exit(1);
} else {
    var hasUpperCase = /[A-Z]/.test(password);
    var hasNumbers = /\d/.test(password);
    var characterGroupCount = hasUpperCase + hasNumbers;
    var isComplexPassword = (password.length >= 6) && (password.length <= 20) && (characterGroupCount >= 2);
    if (!isComplexPassword) {
        logger.logError('adminCLI - crmUserResetPassword - password should be between 6 to 20 characters, contain 1 uppercase and 1 number');
        process.exit(1);
    }
}

var modelsPath = config.root + '/server/common/models';
mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - crmUserResetPassword - db connection error');
    } else {
        require('../../server/common/setup/models')(modelsPath);
        var CrmUser = mongoose.model('CrmUser');
        CrmUser.findOne({email: email.toLowerCase()}, function (err, user) {
            if (err) {
                logger.logError('adminCLI - crmUserResetPassword - error fetching user: ' + email.toLowerCase());
                logger.logError(err);
                process.exit(1);
            } else if (!user) {
                logger.logError('adminCLI - crmUserResetPassword - password cannot be changed as the user was not found: ' + email.toLowerCase());
                process.exit(1);
            } else if (user.status === 'inactive') {
                logger.logError('adminCLI - crmUserResetPassword - password cannot be changed as the user is inactive: ' + email.toLowerCase());
                process.exit(1);
            } else {
                user.password = password;
                user.save(function (err) {
                    if (err) {
                        logger.logError('adminCLI - crmUserResetPassword - error saving new password to user: ' + email.toLowerCase());
                        logger.logError(err);
                        process.exit(1);
                    }
                    logger.logInfo('adminCLI - crmUserResetPassword - password changed successfully: ' + email.toLowerCase());
                    logger.logInfo('adminCLI - crmUserResetPassword - sending password changed email to ' + email.toLowerCase());
                    var mailOptions = {
                        from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                        to: user.email,
                        subject: config.crmPasswordChangedEmailSubject[user.preferences.defaultLanguage],
                        html: sf(config.crmPasswordChangedEmailBody[user.preferences.defaultLanguage], config.imageUrl, user.firstName, user.lastName, config.customerCareNumber)
                    };
                    emailService.sendEmail(mailOptions, function (err) {
                        if (err) {
                            logger.logError('adminCLI - crmUserResetPassword - error sending password changed email to: ' + mailOptions.to);
                            logger.logError(err);
                            process.exit(1);
                        } else {
                            logger.logInfo('adminCLI - crmUserResetPassword - password changed email sent to ' + mailOptions.to);
                            process.exit(0);
                        }
                    });
                });
            }
        });
    }
});
