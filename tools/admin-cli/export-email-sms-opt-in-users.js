'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    validation = require('../../server/common/services/validation'),
    billing = require('../../server/common/services/billing'),
    async = require('async'),
    fs = require('fs-extended'),
    MongoClient = require('mongodb').MongoClient,
    logFile = fs.createWriteStream(__dirname + '/export-email-sms-opt-in-users.log', {flags: 'w'});

MongoClient.connect(config.db, function (err, db) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - exportEmailSmsOptInUsers - db connection error');
    } else {
        var users = db.collection('Users');
        users.find({'preferences.emailSmsSubscription': true}).toArray(function (err, users) {
            if (err) {
                logger.logError('adminCLI - exportEmailSmsOptInUsers - error fetching users');
                logger.logError(err);
                process.exit(1);
            } else if (!users || users.length === 0) {
                logger.logError('adminCLI - exportEmailSmsOptInUsers - no users found!');
                process.exit(0);
            } else {
                var csv = '';
                var count = 0;
                for (var i = 0; i < users.length; i++) {
                    count++;
                    logger.logInfo('processing user ' + count);
                    csv += users[i].email + ',' + users[i].firstName + ',' + users[i].lastName + '\n';
                }
                logFile.write(csv);
                logger.logInfo(csv);
                logger.logInfo('done');
                process.exit(0);
            }
        });
    }
});
