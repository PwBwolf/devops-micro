'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    mongoose = require('../../server/node_modules/mongoose'),
    prompt = require('prompt'),
    fs = require('fs'),
    _ = require('lodash');

var modelsPath = config.root + '/server/common/models',
    db = mongoose.createConnection(config.db);

require('../../server/common/setup/models')(modelsPath);
var subscription = require('../../server/common/services/subscription');
var User = db.model('User');

var schema = {
    properties: {
        email: {
            description: 'User Email',
            pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm,
            message: 'Enter a valid email address',
            required: true,
            conform: function (value) {
                User.findOne({email: value.toLowerCase()}).populate('account').exec(function (err, userObj) {
                    if (err) {
                        logger.logError('adminCLI - upgradeSubscription - error fetching user: ' + value.toLowerCase());
                        process.exit(1);
                    } else if (!userObj) {
                        logger.logError('adminCLI - upgradeSubscription - user not found: ' + value.toLowerCase());
                        process.exit(1);
                    } else if (userObj.status === 'failed') {
                        logger.logError('adminCLI - upgradeSubscription - failed user: ' + value.toLowerCase());
                        process.exit(1);
                    } else if (userObj.account.type === 'paid') {
                        logger.logError('adminCLI - upgradeSubscription - paid user: ' + value.toLowerCase());
                        process.exit(1);
                    } else if (userObj.account.type === 'comp') {
                        logger.logError('adminCLI - upgradeSubscription - complimentary user: ' + value.toLowerCase());
                        process.exit(1);
                    }
                });
                return value && value.trim() && value.trim().length <= 50;
            }
        },
        cardName: {
            description: 'Name on Credit Card',
            pattern: /^[a-zA-Z0-9\s\-,.']+$/,
            message: 'Enter a valid name',
            required: true,
            conform: function (value) {
                return value && value.trim() && value.trim().length <= 128;
            }
        },
        cardNumber: {
            description: 'Credit Card Number',
            pattern: /^[0-9]{14,16}$/,
            message: 'Enter a valid credit card number',
            required: true,
            conform: function (value) {
                return value && value.trim() && checkMod10(value.trim());
            }
        },
        expiryDate: {
            description: 'Expiration Date (MM/YYYY)',
            pattern: /^(0[1-9]|1[0-2])\/([0-9]{4})$/,
            message: 'Enter a valid expiration date',
            required: true,
            conform: function (value) {
                var text = value.split('/');
                if (text && text.length === 2) {
                    var month = text[0];
                    var year = text[1];
                    var expiry = new Date(year, month);
                    var currentTime = new Date();
                    expiry.setMonth(expiry.getMonth() - 1);
                    expiry.setMonth(expiry.getMonth() + 1, 1);
                    return expiry > currentTime;
                } else {
                    return false;
                }
            }
        },
        cvv: {
            description: 'CVV',
            pattern: /^[0-9]{3,4}$/,
            message: 'Enter a valid cvv',
            required: true,
            conform: function (value) {
                var cardNumber = prompt.history('cardNumber').value.trim();
                if ((cardNumber.indexOf('34') === 0 || cardNumber.indexOf('37') === 0) && cardNumber.length === 15) {
                    return value && value.trim() && value.trim().length === 4;
                } else {
                    return value && value.trim() && value.trim().length === 3;
                }
            }
        },
        address: {
            description: 'Billing Address',
            pattern: /^[a-zA-Z0-9\s\-!@#$%&\(\)\+;:'",.\?/=\[\]<>]+$/,
            message: 'Enter a valid address',
            required: true,
            conform: function (value) {
                return value && value.trim() && value.trim().length <= 80;
            }
        },
        city: {
            description: 'City',
            pattern: /^[a-zA-Z0-9\s\-!@#$%&\(\)\+;:'",.\?/=\[\]<>]+$/,
            message: 'Enter a valid city',
            required: true,
            conform: function (value) {
                return value && value.trim() && value.trim().length <= 80;
            }
        },
        state: {
            description: 'State',
            pattern: /^[A-Z]{2}/,
            message: 'Enter a valid 2 letter state code in uppercase',
            required: true,
            conform: function (value) {
                var states = JSON.parse(fs.readFileSync(__dirname + '/../../server/common/database/states.json', 'utf8'));
                var index = _.findIndex(states.docs, {code: value});
                return (index >= 0);
            }
        },
        zipCode: {
            description: 'Zip',
            pattern: /^[0-9]{5}$/,
            message: 'Enter a valid zip code',
            required: true,
            conform: function (value) {
                return value && value.trim();
            }
        }
    }
};

prompt.colors = false;
prompt.start();

prompt.get(schema, function (err, result) {
    if (err) {
        logger.logError('adminCLI - upgradeSubscription - error in reading console inputs');
        logger.logError(err);
        process.exit(1);
    }
    if (result) {
        subscription.upgradeSubscription(result.email.toLowerCase(), result, function (err) {
            if (err) {
                logger.logError('adminCLI - upgradeSubscription - error upgrading user');
                logger.logError(err);
                if (err.message) {
                    logger.logError(err.message);
                }
                var timeout = 1000;
                if (err.message === 'PaymentFailed' || err.message === 'PaymentFailedActive') {
                    logger.logInfo('adminCLI - upgradeSubscription - reverting to free user');
                    logger.logInfo('please wait...');
                    timeout = 10000;
                }
                setTimeout(function () {
                    logger.logError('adminCLI - upgradeSubscription - error upgrading user');
                    process.exit(1);
                }, timeout);
            } else {
                logger.logInfo('adminCLI - upgradeSubscription - user subscription upgraded');
                logger.logInfo('please wait');
                setTimeout(function () {
                    logger.logInfo('adminCLI - upgradeSubscription - user subscription upgraded');
                    process.exit(0);
                }, 10000);
            }
        });
    }
});

function checkMod10(input) {
    var sum = 0;
    var numDigits = input.length;
    var parity = numDigits % 2;
    for (var i = 0; i < numDigits; i++) {
        var digit = parseInt(input.charAt(i));
        if (i % 2 === parity) {
            digit *= 2;
        }
        if (digit > 9) {
            digit -= 9;
        }
        sum += digit;
    }
    return (sum % 10) === 0;
}
