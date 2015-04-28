'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/config/config'),
    logger = require('../../server/common/config/logger'),
    mongoose = require('../../server/node_modules/mongoose'),
    prompt = require('prompt'),
    uuid = require('node-uuid');


var modelsPath = config.root + '/server/common/models',
    dbYip = mongoose.createConnection(config.db),
    dbMerchant = mongoose.createConnection(config.merchantDb);

require('../../server/common/config/models')(modelsPath);
var MerchantYip = dbYip.model('Merchant'),
    MerchantMG = dbMerchant.model('Merchant');

var schema = {
    properties: {
        name: {
            description: 'Merchant name',
            pattern: /^[a-zA-Z0-9\s\-,.']+$/,
            message: 'Enter a valid name',
            required: true,
            conform: function (value) {
                return value && value.trim();
            }
        },
        email: {
            description: 'Email',
            pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm,
            message: 'Enter a valid and unique email address',
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
        MerchantYip.findOne({email: result.email}, function (err, mer) {
            if (err) {
                logger.logError('adminCLI - createMerchant - error in checking if email exists');
                logger.logError(err);
                process.exit(1);
            } else {
                if (mer) {
                    logger.logError('adminCLI - createMerchant - email address already registered');
                    process.exit(1);
                } else {
                    var merchant = new MerchantYip(result);
                    merchant.createdAt = (new Date()).toUTCString();
                    merchant.apiKey = uuid.v4();
                    merchant.save(function (err1) {
                        if (err1) {
                            logger.logError('adminCLI - createMerchant - error in creating merchant in yiptv db');
                            logger.logError(err1);
                            process.exit(1);
                        }
                        var mg = new MerchantMG(result);
                        mg._id = merchant._id;
                        mg.createdAt = merchant.createdAt;
                        mg.apiKey = merchant.apiKey;
                        mg.save(function (err2) {
                            if (err2) {
                                logger.logError('adminCLI - createMerchant - error in creating merchant in merchant db');
                                logger.logError(err2);
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
});