'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../../server/common/setup/config');
var mongoose = require('../../server/node_modules/mongoose');
var async = require('../../server/node_modules/async');
var logger = require('../../server/common/setup/logger');
var fs = require('../../server/node_modules/fs-extended');
var xlsx = require('../../server/node_modules/xlsx');

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../../server/common/setup/models')(modelsPath);
var Users = mongoose.model('User');

var fileName;
if (process.argv[2]) {
    fileName = process.argv[2];
} else {
    fileName = "missing-freeside-users-with-password_customernum.xlsx";
}

xlsxParser();

function xlsxParser() {
    var workbook = xlsx.readFile(fileName);
    var sheetName = workbook.SheetNames[0];
    var sheet = workbook.Sheets[sheetName];
    var roa = xlsx.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    var counter = 0;
    async.eachSeries(
        roa,
        function (customer, cb) {
            logger.logInfo('adminCLI - addFreesideAccountNumber - user info:' + customer.Email);
            Users.findOne({email: customer.Email.toLowerCase()}).populate('account').exec(function (err, user) {
                if (err) {
                    logger.logError('adminCLI - addFreesideAccountNumber - error fetching user for current email address: ' + customer.Email.toLowerCase());
                    logger.logError(err);
                    cb(err);
                } else if (!user) {
                    logger.logError('adminCLI - addFreesideAccountNumber - current email address not found: ' + customer.Email.toLowerCase());
                    cb(null);
                } else {
                    if (user.status === 'failed') {
                        logger.logInfo('adminCLI - addFreesideAccountNumber - current email address is that of a failed user: ' + customer.Email.toLowerCase());
                        user.status = 'registered';
                    }

                    user.account.freeSideCustomerNumber = customer['Customer number'];
                    user.save(function (err) {
                        if (err) {
                            logger.logError('adminCLI - addFreesideAccountNumber - error update user status for current email address: ' + customer.Email.toLowerCase());
                            logger.logError(err);
                            cb(err);
                        } else {
                            logger.logInfo('adminCLI - addFreesideAccountNumber - update user status succeed for current email address: ' + customer.Email.toLowerCase());
                            user.account.save(function (err) {
                                if (err) {
                                    logger.logError('adminCLI - addFreesideAccountNumber - error update account freeside customer number for current email address: ' + customer.Email.toLowerCase());
                                    logger.logError(err);
                                } else {
                                    logger.logInfo('adminCLI - addFreesideAccountNumberr - update account freeside customer number succeed for current email address: ' + customer.Email.toLowerCase());
                                    counter++;
                                }
                                cb(err);
                            });
                        }
                    });
                }
            });
        },
        function (err) {
            if (err) {
                logger.logError('adminCLI - addFreesideAccountNumber - failed to update db');
                logger.logError(err);
                process.exit(1);
            } else {
                logger.logInfo('adminCLI - addFreesideAccountNumber - successfully update db with total clients: ' + counter);
                process.exit(0);
            }

        }
    );
}
