var fs = require('fs'),
    moment = require('moment-timezone'),
    config = require('../setup/config'),
    async = require('async'),
    logger = require('../setup/logger'),
    email = require('./email'),
    ftp = require('./ftp'),
    mongoose = require('mongoose');

var modelsPath = config.root + '/server/common/models',
    db = mongoose.connect(config.db);

require('../setup/models')(modelsPath);
var Account = mongoose.model('Account');

exports.exportCjAccounts = function (startDate, endDate, cb) {
    var query = {merchant: 'CJ'};
    var utcStartDate, utcEndDate, cjData, financeData, cjFile, financeFile;
    async.waterfall([
        // do validations
        function (callback) {
            if (!startDate && !endDate) {
                logger.logError('cj - cj - tool invoked with incorrect number of parameters');
                printUsage();
                callback('ERROR_INCORRECT_PARAMETERS');
            }
            if (!moment(startDate, 'MM/DD/YYYY', true).isValid()) {
                logger.logError('cj - exportCjAccounts - enter a valid start date in MM/DD/YYYY format');
                printUsage();
                callback('ERROR_INVALID_START_DATE');
            } else if (!moment(endDate, 'MM/DD/YYYY', true).isValid()) {
                logger.logError('cj - exportCjAccounts - enter a valid end date in MM/DD/YYYY format');
                printUsage();
                callback('ERROR_INVALID_END_DATE');
            } else if (moment(startDate, 'MM/DD/YYYY', true).isAfter(moment(endDate, 'MM/DD/YYYY', true))) {
                logger.logError('cj - exportCjAccounts - end date should be greater than start date');
                printUsage();
                callback('ERROR_END_DATE_LESSER_THAN_START_DATE');
            } else {
                utcStartDate = moment.tz(startDate, 'MM/DD/YYYY', 'America/Los_Angeles').toDate().toUTCString();
                query.createdAt = {$gte: utcStartDate};
                utcEndDate = moment.tz(endDate, 'MM/DD/YYYY', 'America/Los_Angeles').add(1, 'days').toDate().toUTCString();
                query.createdAt.$lt = utcEndDate;
                callback();
            }
        },
        // collect data
        function (callback) {
            Account.find(query, {}, {$sort: {createdAt: 1}}).populate('primaryUser').exec(function (err, accounts) {
                if (err) {
                    logger.logError('cj - exportCjAccounts - error fetching partner accounts');
                    callback(err);
                } else if (!accounts || accounts.length === 0) {
                    logger.logError('cj - exportCjAccounts - no accounts found!');
                    callback(err);
                } else {
                    cjData = '&CID=4630657' + '\n' + '&SUBID=180563' + '\n';
                    financeData = 'OID,Username,Status,Type,Event Date,FreeSide Customer Number' + '\n';
                    for (var i = 0; i < accounts.length; i++) {
                        if (accounts[i].primaryUser && accounts[i].primaryUser.status === 'active' && !accounts[i].primaryUser.upgradeDate) {
                            cjData += getOid(accounts[i]) + ',' + getOriginalActionId(accounts[i]) + ',' + getNewActionId(accounts[i]) + ',' + getEventDate(accounts[i]) + '\n';
                            financeData += getOid(accounts[i]) + ',' + accounts[i].primaryUser.email + ',' + accounts[i].primaryUser.status + ',' + accounts[i].type + ',' + getEventDate(accounts[i]) + ',' + accounts[i].freeSideCustomerNumber + '\n';
                        }
                    }
                    callback();
                }
            });
        },
        // write cj batch file
        function (callback) {
            cjFile = 'cj-batch-report-' + getDateTime(new Date(startDate), new Date(endDate)) + '.csv';
            fs.writeFile('../../reports/' + cjFile, cjData, function (err) {
                if (err) {
                    logger.logError('cj - exportCjAccounts - error writing cj report');
                }
                callback(err);
            });
        },
        // write finance report
        function (callback) {
            financeFile = 'cj-finance-report-' + getDateTime(new Date(startDate), new Date(endDate)) + '.csv';
            fs.writeFile('../../reports/' + financeFile, financeData, function (err) {
                if (err) {
                    logger.logError('cj - exportCjAccounts - error writing finance report');
                }
                callback(err);
            });
        },
        // send finance report via email to accounting@yiptv.com
        /*function (callback) {
            var mailOptions = {
                from: config.email.fromName + ' <' + config.email.fromEmail + '>',
                to: config.cjReports.financeEmailAddress,
                subject: 'CJ Daily Report',
                html: 'The CJ report for the period ' + startDate + ' to ' + endDate + ' is attached',
                attachments: [{filename: financeFile, path: '../../reports/' + financeFile}]
            };
            email.sendEmail(mailOptions, function (err) {
                if (err) {
                    logger.logError('cj - exportCjAccounts - error sending finance file to ' + mailOptions.to);
                }
                callback(err);
            });
        },*/
        // upload cj batch file to cj ftp server
        function (callback) {
            var ftpOptions = {
                host: config.cjReports.ftpHost,
                port: config.cjReports.ftpPort,
                user: config.cjReports.ftpUsername,
                password: config.cjReports.ftpPassword
            };
            var localPath = '../../reports/' + cjFile;
            var remotePath = config.cjReports.ftpPath + cjFile;
            ftp.uploadFile(ftpOptions, localPath, remotePath, function (err) {
                if (err) {
                    logger.logError('cj - exportCjAccounts - error uploading to cj batch file to ftp server');
                }
                callback(err);
            });
        }
    ], function (err) {
        if (err) {
            logger.logError(err);
        }
        cb(err);
    });
};

function printUsage() {
    console.log('Usage: node export-cj-batch-file <start-date> <end-date>');
    console.log('Example usage: node export-cj-batch-file 01/01/2016 01/31/2016');
}

function getDateTime(startDate, endDate) {
    return startDate.getFullYear() + pad(startDate.getMonth() + 1) + pad(startDate.getDate()) + '-' + endDate.getFullYear() + pad(endDate.getMonth() + 1) + pad(endDate.getDate());
}

function pad(number) {
    var num = String(number);
    if (num.length === 1) {
        num = '0' + num;
    }
    return num;
}

function getOid(account) {
    if (account.type === 'free') {
        return account.primaryUser._id + '_free_' + account.primaryUser.createdAt.getTime() + '_0';
    } else if (account.type === 'paid') {
        var upgradeDate = account.primaryUser.upgradeDate ? account.primaryUser.upgradeDate.getTime() : '0';
        return account.primaryUser._id + '_paid_' + account.primaryUser.createdAt.getTime() + '_' + upgradeDate;
    } else {
        return '0_0_0_0';
    }
}

function getOriginalActionId(account) {
    if (account.type === 'free') {
        return '383212';
    } else if (account.type === 'paid' && account.primaryUser.upgradeDate) {
        return '385174';
    } else {
        return '384431';
    }
}

function getNewActionId(account) {
    if (account.type === 'free') {
        return '385174';
    } else if (account.type === 'paid' && account.primaryUser.upgradeDate) {
        return '383213';
    } else {
        return '385175';
    }
}

function getEventDate(account) {
    var eventDate;
    if (account.type === 'paid' && account.primaryUser.upgradeDate) {
        eventDate = account.primaryUser.upgradeDate;
    } else {
        eventDate = account.primaryUser.createdAt;
    }
    return moment(eventDate).tz('America/Los_Angeles').format('MM/DD/YYYY hh:mm A');
}
