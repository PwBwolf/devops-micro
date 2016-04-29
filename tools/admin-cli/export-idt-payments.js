'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config'),
    logger = require('../../server/common/setup/logger'),
    validation = require('../../server/common/services/validation'),
    billing = require('../../server/common/services/billing'),
    async = require('async'),
    moment = require('moment'),
    MongoClient = require('mongodb').MongoClient;

MongoClient.connect(config.db, function (err, db) {
    if (err) {
        logger.logError(err);
        logger.logError('adminCLI - exportIdtPayments - db connection error');
    } else {
        var payments = db.collection('Payments');
        payments.find({}).toArray(function (err, payments) {
            if (err) {
                logger.logError('adminCLI - exportIdtPayments - error fetching payments');
                logger.logError(err);
                process.exit(1);
            } else if (!payments || payments.length === 0) {
                logger.logError('adminCLI - exportIdtPayments - no payments found!');
                process.exit(0);
            } else {
                console.log('Username,Submit Time,Process Time,Currency,Amount,Reference Id,POP Id,Status,Failure Reason');
                for(var i = 0; i < payments.length; i++) {
                    var payment = payments[i];
                    console.log(payment.username + ',' + formatDate(payment.submitTime) + ',' + formatDate(payment.processTime) + ','
                        + payment.currency + ',' + payment.amount + ',' + payment.merchantReferenceId + ','
                        + payment.merchantPopId + ',' + payment.status + ',' + payment.reason);
                }
                process.exit(0);
            }
        });
    }
});

function formatDate(date) {
    if (date) {
        return moment.utc(date).format('MM/DD/YYYY hh:mm:ss A');
    } else {
        return '';
    }
}
