'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    mongoose = require('../../server/node_modules/mongoose'),
    prompt = require('prompt'),
    uuid = require('node-uuid');

var modelsPath = config.root + '/server/common/models',
    db = mongoose.createConnection(config.db);

require('../../server/common/setup/models')(modelsPath);
var Merchant = db.model('Merchant');
var ApiClient = db.model('ApiClient');

var schema = {
    properties: {
        name: {
            description: 'Merchant short name',
            pattern: /^[A-Z]+$/,
            message: 'Enter a valid short name in uppercase up to 16 alphabets',
            required: true,
            conform: function (value) {
                return value && value.trim() && value.trim().length <= 16;
            }
        },
        fullName: {
            description: 'Merchant full name',
            pattern: /^[a-zA-Z0-9\s\-,.']+$/,
            message: 'Enter a valid full name',
            required: true,
            conform: function (value) {
                return value && value.trim();
            }
        },
        email: {
            description: 'Email',
            pattern: config.regex.email,
            message: 'Enter a valid email address',
            required: true,
            conform: function (value) {
                return value && value.trim();
            }
        },
        address: {
            description: 'Address',
            pattern: /^[a-zA-Z0-9\s\-!@#$%&\(\)\+;:'",.\?/=\[\]<>]+$/,
            message: 'Enter a valid address',
            required: true,
            conform: function (value) {
                return value && value.trim();
            }

        },
        telephone: {
            description: 'Telephone',
            pattern: /^[2-9]{1}[0-9]{2}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/,
            message: 'Enter a valid telephone number',
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
        logger.logError('adminCLI - createMerchant - error in reading console inputs');
        logger.logError(err);
        process.exit(1);
    }
    if (result) {
        Merchant.findOne({name: result.name.toUpperCase()}, function (err, mer) {
            if (err) {
                logger.logError('adminCLI - createMerchant - error in checking if short name exists in merchant collection');
                logger.logError(err);
                process.exit(1);
            } else {
                if (mer) {
                    logger.logError('adminCLI - createMerchant - short name already exists in merchant collection');
                    process.exit(1);
                } else {
                    ApiClient.findOne({name: result.name.toUpperCase()}, function (err, client) {
                        if (err) {
                            logger.logError('adminCLI - createApiClient - error in checking if short name exists in api client collection');
                            logger.logError(err);
                            process.exit(1);
                        } else {
                            if (client) {
                                logger.logError('adminCLI - createMerchant - short name already exists in api client collection');
                                process.exit(1);
                            } else {
                                var merchant = new Merchant(result);
                                merchant.createdAt = (new Date()).toUTCString();
                                merchant.apiKey = uuid.v4();
                                merchant.save(function (err) {
                                    if (err) {
                                        logger.logError('adminCLI - createMerchant - error in creating merchant');
                                        logger.logError(err);
                                        process.exit(1);
                                    }
                                    var client = new ApiClient(result);
                                    client._id = merchant._id;
                                    client.createdAt = merchant.createdAt;
                                    client.apiKey = merchant.apiKey;
                                    client.apiType = 'MERCHANT';
                                    client.save(function (err) {
                                        if (err) {
                                            logger.logError('adminCLI - createMerchant - error in creating api client');
                                            logger.logError(err);
                                            process.exit(1);
                                        } else {
                                            logger.logInfo('adminCLI - createMerchant - merchant created successfully!');
                                            logger.logInfo('adminCLI - createMerchant - merchantId: ' + merchant._id);
                                            logger.logInfo('adminCLI - createMerchant - apiKey: ' + merchant.apiKey);
                                            process.exit(0);
                                        }
                                    });
                                });
                            }
                        }
                    });
                }
            }
        });
    } else {
        logger.logError('adminCLI - createMerchant - input empty');
        process.exit(1);
    }
});
