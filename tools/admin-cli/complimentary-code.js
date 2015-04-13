'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/config/config'),
    date = require('../../server/common/services/date'),
    mongoose = require('../../server/node_modules/mongoose'),
    prompt = require('prompt'),
    uuid = require('node-uuid');


var command = process.argv[2],
    code = process.argv[3];

if (!command || (command !== 'new' && command !== 'disable')) {
    console.log('Incorrect command!\n\rUsage:\n\r\tnode complimentary-code new\n\r\t\twill create a new complimentary code.\n\r\tnode complimentary-code disable <code>\n\r\t\twill disable an existing complimentary code.');
    process.exit(1);
}

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/config/models')(modelsPath);
var ComplimentaryCode = mongoose.model('ComplimentaryCode');

if (command === 'new') {
    var schema = {
        properties: {
            requestedBy: {
                description: 'Requested By',
                pattern: /^[a-zA-Z\s\.]+$/,
                message: 'Requested by name must contain only letters, spaces or dots',
                required: true
            },
            department: {
                description: 'Department',
                pattern: /^[a-zA-Z\s\-\.]+$/,
                message: 'Department name must contain only letters, spaces, dashes or dots',
                required: true
            },
            reason: {
                description: 'Reason',
                pattern: /^[a-zA-Z\s\-\.]+$/,
                message: 'Reason must contain only letters, spaces, dashes or dots',
                required: true
            },
            startDate: {
                description: 'Start Date [yyyy-mm-dd]',
                message: 'Enter a valid date (past dates not allowed)',
                default: date.utcDate(new Date()),
                required: true,
                format: 'date',
                conform: function(value) {
                    var d1 = new Date(Date.parse(value));
                    var d2 = new Date(Date.parse(date.utcDate(new Date())));
                    return (d1 >= d2);
                }
            },
            endDate: {
                description: 'End Date [yyyy-mm-dd]',
                message: 'Enter a valid date (not lesser than start date)',
                default: date.utcDate(new Date(Date.parse('2099-12-31'))),
                required: true,
                format: 'date',
                conform: function(value) {
                    var d1 = new Date(Date.parse(value));
                    var d2 = new Date(Date.parse(prompt.history('startDate').value));
                    return (d1 >= d2);
                }
            },
            duration: {
                description: 'Duration in days',
                message: 'Enter a valid number',
                default: 36500,
                required: true,
                type: 'number',
                divisibleBy: 1,
                conform: function(value) {
                    return (value > 0);
                }
            },
            maximumAccounts: {
                description: 'Maximum accounts allowed',
                message: 'Enter a valid number',
                default: 1000000,
                required: true,
                type: 'number',
                divisibleBy: 1,
                conform: function(value) {
                    return (value > 0);
                }
            }
        }
    };

    prompt.colors = false;
    prompt.start();

    prompt.get(schema, function (err, result) {
        if(err) {
            console.log(err);
            process.exit(1);
        }
        if(result) {
            var cc = new ComplimentaryCode(result);
            cc.createdAt = (new Date()).toUTCString();
            cc.code = uuid.v4();
            cc.accountCount = 0;
            cc.save(function(err1) {
                if(err1) {
                    console.log(err1);
                    process.exit(1);
                }
                console.log('Complimentary code created successfully!');
                console.log('Here is the URL: ' + config.complimentarySignUpUrl + cc.code);
                process.exit(0);
            });
        }
    });
}

if (command === 'disable') {
    if (!code) {
        console.log('Complimentary code missing!\n\rUsage:\n\r\tnode complimentary-code disable <code>');
        process.exit(1);
    }
    ComplimentaryCode.findOne({code: code}, function (err, cc) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        if (!cc) {
            console.log('Complimentary code not found!');
            process.exit(1);
        }
        cc.active = false;
        cc.updatedAt = (new Date()).toUTCString();
        cc.save(function (err1) {
            if (err1) {
                console.log(err1);
                process.exit(1);
            }
            console.log('Complimentary code disabled');
        });
    });
}
