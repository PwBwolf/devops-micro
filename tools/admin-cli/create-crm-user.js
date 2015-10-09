'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    mongoose = require('../../server/node_modules/mongoose'),
    uuid = require('node-uuid'),
    prompt = require('prompt');

var modelsPath = config.root + '/server/common/models',
    dbYip = mongoose.createConnection(config.db),
    userRoles = require('../../client/crm-app/scripts/config/routing').userRoles;

require('../../server/common/setup/models')(modelsPath);

var CrmUser = dbYip.model('CrmUser');

var schema = {
    properties: {
        firstName: {
            description: 'First name',
            pattern: /^[a-zA-Z0-9\s\-,.']+$/,
            message: 'Enter a valid first name up to 20 characters',
            required: true,
            conform: function (value) {
                return value && value.trim() && value.trim().length <= 20;
            }
        },
        lastName: {
            description: 'Last name',
            pattern: /^[a-zA-Z0-9\s\-,.']+$/,
            message: 'Enter a valid last name up to 20 characters',
            required: true,
            conform: function (value) {
                return value && value.trim() && value.trim().length <= 20;
            }
        },
        email: {
            description: 'Email',
            pattern: config.regex.email,
            message: 'Enter a valid email address',
            required: true,
            conform: function (value) {
                return value && value.trim() && value.trim().length <= 20;
            }
        },
        roleName: {
            description: 'Role (csr, devOps or superUser)',
            pattern: /^[a-zA-Z]+$/,
            message: 'Enter a valid role (csr, devOps or superUser)',
            required: true,
            conform: function (value) {
                if (value === 'csr' || value === 'devOps' || value === 'superUser') {
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
        logger.logError('adminCLI - createCrmUser - error in reading console inputs');
        logger.logError(err);
        process.exit(1);
    }
    if (result) {
        CrmUser.findOne({name: result.email.toLowerCase()}, function (err, client) {
            if (err) {
                logger.logError('adminCLI - createCrmUser - error in checking if email already exists');
                logger.logError(err);
                process.exit(1);
            } else {
                if (client) {
                    logger.logError('adminCLI - createCrmUser - email already exists');
                    process.exit(1);
                } else {
                    var crmUser = new CrmUser(result);
                    crmUser.createdAt = (new Date()).toUTCString();
                    crmUser.status = 'registered';
                    crmUser.role = userRoles[result.roleName];
                    crmUser.verificationCode = uuid.v4();
                    crmUser.save(function (err) {
                        if (err) {
                            logger.logError('adminCLI - createCrmUser - error in creating crm user');
                            logger.logError(err);
                            process.exit(1);
                        }
                        logger.logInfo('adminCLI - createCrmUser - crm user created successfully!');
                        process.exit(0);
                    });
                }
            }
        });
    } else {
        logger.logError('adminCLI - createCrmUser - input empty');
        process.exit(1);
    }
});
