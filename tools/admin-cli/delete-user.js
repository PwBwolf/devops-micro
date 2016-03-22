'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    validation = require('../../server/common/services/validation'),
    mongoose = require('../../server/node_modules/mongoose'),
    prompt = require('prompt');

logger.cli();
var email = process.argv[2];

if (typeof email === 'undefined') {
    logger.logError('adminCLI - deleteUser - email or mobile number is missing!\n\r\tusage: node delete-user <email/mobile>');
    process.exit(1);
} else {
    var emailRegex = config.regex.email;
    var phoneRegex = config.regex.telephone;
    var isEmail = emailRegex.test(email);
    var isPhone = phoneRegex.test(email);
    if (!isEmail && !isPhone) {
        logger.logError('adminCLI - deleteUser - enter a valid email address or mobile number.');
        process.exit(1);
    }
}

var modelsPath = config.root + '/server/common/models',
    db = mongoose.createConnection(config.db);

require('../../server/common/setup/models')(modelsPath);
var User = db.model('User');
var Account = db.model('Account');

var schema = {
    properties: {
        confirmation: {
            description: 'ARE YOU SURE? Type YES to confirm, NO to exit',
            pattern: /^[A-Z]+$/,
            message: 'Invalid input. Type YES to confirm, NO to exit',
            required: true,
            conform: function (value) {
                return value.trim() === 'YES' || value.trim() === 'NO';
            }
        }
    }
};

prompt.colors = false;
prompt.start();

prompt.get(schema, function (err, result) {
    if (err) {
        logger.logError('adminCLI - deleteUser - error in reading console inputs');
        logger.logError(err);
        process.exit(1);
    }
    if (result && result.confirmation === 'YES') {
        var username = validation.getUsername(email);
        User.findOne({email: username}, function (err, user) {
            if (err) {
                logger.logError('adminCLI - deleteUser - error fetching user');
                logger.logError(err);
                process.exit(1);
            }
            if (!user) {
                logger.logError('adminCLI - deleteUser - user not found');
                process.exit(1);
            } else {
                Account.findOne({_id: user.account}, function (err, account) {
                    if (err) {
                        logger.logError('adminCLI - deleteUser - error fetching account');
                        logger.logError(err);
                        process.exit(1);
                    }
                    if (account) {
                        account.remove(function (err) {
                            if (err) {
                                logger.logError('adminCLI - deleteUser - error removing account');
                                logger.logError(err);
                                process.exit(1);
                            } else {
                                removeUser(user, function (err) {
                                    if (err) {
                                        logger.logError('adminCLI - deleteUser - error removing user record from db but account record removed from db');
                                        logger.logError(err);
                                        process.exit(1);
                                    } else {
                                        logger.logInfo('adminCLI - deleteUser - both user and account records deleted successfully from db');
                                        process.exit(0);
                                    }
                                });
                            }
                        });
                    } else {
                        removeUser(user, function (err) {
                            if (err) {
                                logger.logError('adminCLI - deleteUser - error removing user');
                                logger.logError(err);
                                process.exit(1);
                            } else {
                                logger.logInfo('adminCLI - deleteUser - account record not found in db but user record deleted successfully from db');
                                process.exit(0);
                            }
                        });
                    }
                });
            }
        });
    } else {
        logger.logError('adminCLI - deleteUser - delete user canceled');
        process.exit(1);
    }
});

function removeUser(user, cb) {
    user.remove(function (err) {
        if (cb) {
            cb(err);
        }
    });
}
