'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var CronJob = require('cron').CronJob,
    config = require('../../common/setup/config'),
    logger = require('../../common/setup/logger'),
    mongoose = require('mongoose'),
    moment = require('moment');

var modelsPath = config.root + '/server/common/models';

mongoose.connect(config.db, function (err) {
    if (err) {
        logger.logError(err);
        logger.logError('cjReportProcessorMain - db connection error');
    } else {
        require('../../common/setup/models')(modelsPath);
        var cj = require('../../common/services/cj');

        new CronJob(config.cjReportProcessorRecurrence, function () {
            logger.logInfo('cjReportProcessorMain - cj report processor starting');
            var yesterday = moment().add(-1, 'days').format('MM/DD/YYYY');
            logger.logInfo('cjReportProcessorMain - running report for ' + yesterday);
            cj.exportCjAccounts(yesterday, yesterday, function (err) {
                if (err) {
                    logger.logError(err);
                    logger.logError('cjReportProcessorMain - error exporting cj accounts');
                } else {
                    logger.logInfo('cjReportProcessorMain - completed successfully');
                }
            });
        }, function () {
            logger.logInfo('cjReportProcessorMain - cj report processor has stopped');
        }, true, 'America/Anchorage');
    }
});
