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

var NotificationClient = dbYip.model('NotificationClient');

var schema = {
    properties: {
        name: {
            description: 'Notification Client Name',
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
        logger.logError('adminCLI - createNotificationClient - error in reading console inputs');
        logger.logError(err);
        process.exit(1);
    }
    if (result) {
        NotificationClient.findOne({email: result.email.toLowerCase()}, function (err, client) {
            if (err) {
                logger.logError('adminCLI - createNotificationClient - error in checking if email exists');
                logger.logError(err);
                process.exit(1);
            } else {
                if (client) {
                    logger.logError('adminCLI - createNotificationClient - email address already registered');
                    process.exit(1);
                } else {
                    var notificationClient = new NotificationClient(result);
                    notificationClient.createdAt = (new Date()).toUTCString();
                    notificationClient.apiKey = uuid.v4();
                    notificationClient.save(function (err) {
                        if (err) {
                            logger.logError('adminCLI - createNotificationClient - error in creating notification client in db');
                            logger.logError(err);
                            process.exit(1);
                        }
                        logger.logInfo('adminCLI - createNotificationClient - notification client created successfully!');
                        logger.logInfo('adminCLI - createNotificationClient - clientId: ' + notificationClient._id);
                        logger.logInfo('adminCLI - createNotificationClient - apiKey: ' + notificationClient.apiKey);
                        process.exit(0);
                    });
                }
            }
        });
    }
});
