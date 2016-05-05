'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    billing = require('../../server/common/services/billing'),
    mongoose = require('../../server/node_modules/mongoose');

logger.logError('adminCLI - changeEmail - this tool should not be used.');
process.exit(1);

var currentEmail = process.argv[2];
var newEmail = process.argv[3];

if (typeof currentEmail === 'undefined') {
    logger.logError('adminCLI - changeEmail - current email address is missing!\n\r\tusage: node change-email <current-email> <new-email>');
    process.exit(1);
} else if (typeof newEmail === 'undefined') {
    logger.logError('adminCLI - changeEmail - new email address is missing!\n\r\tusage: node change-email <current-email> <new-email>');
    process.exit(1);
} else {
    var regex = config.regex.email;
    var isCurrentEmailValid = regex.test(currentEmail);
    var isNewEmailValid = regex.test(newEmail);
    if (!isCurrentEmailValid) {
        logger.logError('adminCLI - changeEmail - enter a valid current email address.');
        process.exit(1);
    }
    if (!isNewEmailValid) {
        logger.logError('adminCLI - changeEmail - enter a valid new email address.');
        process.exit(1);
    }
    if (currentEmail === newEmail) {
        logger.logError('adminCLI - changeEmail - current and new email address cannot be the same.');
        process.exit(1);
    }
}

var modelsPath = config.root + '/server/common/models';

mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError(err);
        logger.logError('cjReportProcessorMain - db connection error');
    } else {
        require('../../server/common/setup/models')(modelsPath);
        var Users = mongoose.model('User');
        Users.findOne({email: currentEmail.toLowerCase()}).populate('account').exec(function (err, user) {
            if (err) {
                logger.logError('adminCLI - changeEmail - error fetching user for current email address: ' + currentEmail.toLowerCase());
                logger.logError(err);
                process.exit(1);
            } else if (!user) {
                logger.logError('adminCLI - changeEmail - current email address not found: ' + currentEmail.toLowerCase());
                process.exit(1);
            } else if (user.status === 'failed') {
                logger.logError('adminCLI - changeEmail - current email address is that of a failed user: ' + currentEmail.toLowerCase());
                process.exit(1);
            } else if (user.status === 'suspended') {
                logger.logError('adminCLI - changeEmail - current email address is that of a suspended user: ' + currentEmail.toLowerCase());
                process.exit(1);
            } else {
                Users.findOne({email: newEmail.toLowerCase()}).populate('account').exec(function (err, newUser) {
                    if (err) {
                        logger.logError('adminCLI - changeEmail - error fetching user for new email address: ' + newEmail.toLowerCase());
                        logger.logError(err);
                        process.exit(1);
                    } else if (newUser) {
                        logger.logError('adminCLI - changeEmail - an user already exists with the new email address: ' + newEmail.toLowerCase());
                        process.exit(1);
                    } else {
                        user.email = newEmail.toLowerCase();
                        user.save(function (err) {
                            if (err) {
                                logger.logError('adminCLI - changeEmail - error saving user with new email address: ' + newEmail.toLowerCase());
                                logger.logError(err);
                                process.exit(1);
                            } else {
                                billing.login(currentEmail, user.createdAt.getTime(), function (err, sessionId) {
                                    if (err) {
                                        logger.logError('adminCLI - changeEmail - error logging into freeside: ' + newEmail.toLowerCase());
                                        logger.logError(err);
                                        revertEmailInDatabase(user, currentEmail.toLowerCase(), function (err) {
                                            if (err) {
                                                logger.logError('adminCLI - changeEmail - error changing back to old email in db: ' + newEmail.toLowerCase());
                                                logger.logError(err);
                                            }
                                            process.exit(1);
                                        });
                                    } else {
                                        billing.changeEmail(sessionId, newEmail, function (err) {
                                            if (err) {
                                                logger.logError('adminCLI - changeEmail - error changing email address in freeside: ' + newEmail.toLowerCase());
                                                logger.logError(err);
                                                revertEmailInDatabase(user, currentEmail.toLowerCase(), function (err) {
                                                    if (err) {
                                                        logger.logError('adminCLI - changeEmail - error changing back to old email in db: ' + newEmail.toLowerCase());
                                                        logger.logError(err);
                                                    }
                                                    process.exit(1);
                                                });
                                            } else {
                                                logger.logInfo('adminCLI - changeEmail - successfully change email address');
                                                process.exit(0);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

function revertEmailInDatabase(user, email, cb) {
    user.email = email;
    user.save(function (err) {
        if (err) {
            logger.logError('adminCLI - revertEmailInDatabase - error changing email address in db: ' + email);
            logger.logError(err);
        }
        if (cb) {
            cb(err);
        }
    });
}
