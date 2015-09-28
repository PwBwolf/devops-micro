'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    mongoose = require('../../server/node_modules/mongoose'),
    prompt = require('prompt'),
    uuid = require('node-uuid');

var modelsPath = config.root + '/server/common/models',
    dbYip = mongoose.createConnection(config.db);

require('../../server/common/setup/models')(modelsPath);

var ApiClient = dbYip.model('ApiClient');

var schema = {
    properties: {
        name: {
            description: 'Client short name',
            pattern: /^[A-Z]+$/,
            message: 'Enter a valid short name in uppercase up to 16 alphabets',
            required: true,
            conform: function (value) {
                return value && value.trim() && value.trim().length <= 16;
            }
        },
        fullName: {
            description: 'Client full name',
            pattern: /^[a-zA-Z0-9\s\-,.']+$/,
            message: 'Enter a valid full name',
            required: true,
            conform: function (value) {
                return value && value.trim();
            }
        },
        email: {
            description: 'Email',
            pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm,
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
        },
        apiType: {
            description: 'API type',
            pattern: /^[A-Z]+$/,
            message: 'Enter a valid API type (NOTIFICATION or FRONTEND) in uppercase',
            required: true,
            conform: function (value) {
                if (value === 'NOTIFICATION' || value === 'FRONTEND') {
                    return value && value.trim();
                } else {
                    return false;
                }
            }
        }
    }
};

prompt.colors = false;
prompt.start();

prompt.get(schema, function (err, result) {
    if (err) {
        logger.logError('adminCLI - createApiClient - error in reading console inputs');
        logger.logError(err);
        process.exit(1);
    }
    if (result) {
        ApiClient.findOne({name: result.name.toUpperCase()}, function (err, client) {
            if (err) {
                logger.logError('adminCLI - createApiClient - error in checking if short name exists');
                logger.logError(err);
                process.exit(1);
            } else {
                if (client) {
                    logger.logError('adminCLI - createApiClient - short name already exists');
                    process.exit(1);
                } else {
                    var apiClient = new ApiClient(result);
                    apiClient.createdAt = (new Date()).toUTCString();
                    apiClient.apiKey = uuid.v4();
                    apiClient.save(function (err) {
                        if (err) {
                            logger.logError('adminCLI - createApiClient - error in creating api client in db');
                            logger.logError(err);
                            process.exit(1);
                        }
                        logger.logInfo('adminCLI - createApiClient - api client created successfully!');
                        logger.logInfo('adminCLI - createApiClient - clientId: ' + apiClient._id);
                        logger.logInfo('adminCLI - createApiClient - apiKey: ' + apiClient.apiKey);
                        process.exit(0);
                    });
                }
            }
        });
    }
});
