'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    date = require('../../server/common/services/date'),
    mongoose = require('../../server/node_modules/mongoose'),
    moment = require('moment'),
    prompt = require('prompt'),
    uuid = require('node-uuid');


var command = process.argv[2],
    code = process.argv[3];

if (!command || (command !== 'new' && command !== 'disable')) {
    logger.logError('adminCLI - complimentaryCode - incorrect command!\n\rusage:\n\r\tnode complimentary-code new\n\r\t\twill create a new complimentary code.\n\r\tnode complimentary-code disable <code>\n\r\t\twill disable an existing complimentary code.');
    process.exit(1);
}

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/setup/models')(modelsPath);
var ComplimentaryCode = mongoose.model('ComplimentaryCode');

if (command === 'new') {
    var schema = {
        properties: {
            requestedBy: {
                description: 'Requested By',
                pattern: /^[a-zA-Z0-9\s\-,.']+$/,
                message: 'Enter a valid name',
                required: true,
                conform: function (value) {
                    return value && value.trim();
                }
            },
            department: {
                description: 'Department',
                pattern: /^[a-zA-Z0-9\s\-,.']+$/,
                message: 'Enter a valid department name',
                required: true,
                conform: function (value) {
                    return value && value.trim();
                }
            },
            reason: {
                description: 'Reason',
                pattern: /^[a-zA-Z0-9\s\-,.']+$/,
                message: 'Enter a valid reason',
                required: true,
                conform: function (value) {
                    return value && value.trim();
                }

            },
            startDate: {
                description: 'Start Date [yyyy-mm-dd]',
                message: 'Enter a valid date (past dates not allowed)',
                default: date.utcDateString(new Date()),
                required: true,
                format: 'date',
                conform: function (value) {
                    var d1 = new Date(Date.parse(value));
                    var d2 = new Date(Date.parse(date.utcDateString(new Date())));
                    var d3 = new Date(Date.parse('2099-12-31'));
                    return moment(value, 'YYYY-MM-DD').isValid() && (d1 >= d2 && d1 <= d3);
                }
            },
            endDate: {
                description: 'End Date [yyyy-mm-dd]',
                message: 'Enter a valid date (not lesser than start date)',
                default: date.utcDateString(new Date(Date.parse('2099-12-31'))),
                required: true,
                format: 'date',
                before: function (value) {
                    return value + ' 23:59:59Z';
                },
                conform: function (value) {
                    var d1 = new Date(Date.parse(value));
                    var d2 = new Date(Date.parse(prompt.history('startDate').value));
                    var d3 = new Date(Date.parse('2099-12-31'));
                    return moment(value, 'YYYY-MM-DD').isValid() && (d1 >= d2 && d1 <= d3);
                }
            },
            duration: {
                description: 'Duration in days',
                message: 'Enter a valid number greater than zero',
                default: 36500,
                required: true,
                pattern: /^\d+$/,
                divisibleBy: 1,
                conform: function (value) {
                    return (value > 0 && value <= 36500);
                }
            },
            maximumAccounts: {
                description: 'Maximum accounts allowed',
                message: 'Enter a valid number greater than zero',
                default: 1000000,
                required: true,
                pattern: /^\d+$/,
                divisibleBy: 1,
                conform: function (value) {
                    return (value > 0 && value <= 1000000);
                }
            }
        }
    };

    prompt.colors = false;
    prompt.start();

    prompt.get(schema, function (err, result) {
        if (err) {
            logger.logError('adminCLI - complimentaryCode - error in reading console inputs');
            logger.logError(err);
            process.exit(1);
        }
        if (result) {
            var cc = new ComplimentaryCode(result);
            cc.createdAt = (new Date()).toUTCString();
            cc.code = uuid.v4();
            cc.accountCount = 0;
            cc.save(function (err1) {
                if (err1) {
                    logger.logError('adminCLI - complimentaryCode - error in creating complimentary code');
                    logger.logError(err1);
                    process.exit(1);
                }
                logger.logInfo('adminCLI - complimentaryCode - complimentary code created successfully!');
                logger.logInfo('adminCLI - complimentaryCode - here is the url: ' + config.complimentarySignUpUrl + cc.code);
                process.exit(0);
            });
        }
    });
}

if (command === 'disable') {
    if (!code) {
        logger.logError('adminCLI - complimentaryCode - complimentary code missing!\n\rusage:\n\r\tnode complimentary-code disable <code>');
        process.exit(1);
    }
    ComplimentaryCode.findOne({code: code}, function (err, cc) {
        if (err) {
            logger.logError('adminCLI - complimentaryCode - error fetching complimentary code: ' + code);
            logger.logError(err);
            process.exit(1);
        }
        if (!cc) {
            logger.logError('adminCLI - complimentaryCode - complimentary code not found!');
            process.exit(1);
        }
        cc.disabled = true;
        cc.updatedAt = (new Date()).toUTCString();
        cc.save(function (err1) {
            if (err1) {
                logger.logError('adminCLI - complimentaryCode - error disabling complimentary code: ' + code);
                logger.logError(err1);
                process.exit(1);
            }
            logger.logInfo('adminCLI - complimentaryCode - complimentary code disabled: ' + code);
            process.exit(0);
        });
    });
}
