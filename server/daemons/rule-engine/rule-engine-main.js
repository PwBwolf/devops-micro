'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var CronJob = require('cron').CronJob,
    config = require('../../common/setup/config'),
    logger = require('../../common/setup/logger'),
    mongoose = require('mongoose');

mongoose.connect(config.db, function(err) {
    if (err) {
        logger.logError(err);
        logger.logError('ruleEngineMain - db connection error');
    } else {
        var modelsPath = config.root + '/server/common/models';
        require('../../common/setup/models')(modelsPath);
        var ruleEngine = require('./rule-engine');
        require('./fact-providers/free-user-provider');
        require('./fact-providers/cancel-user-provider');
        require('./fact-providers/complimentary-user-provider');
        require('./post-processors/free-user-processor');
        require('./post-processors/cancel-user-processor');
        require('./post-processors/complimentary-user-processor');
        var factProviders = config.factProviders;

        logger.logInfo('ruleEngineMain - starting rule engine daemon');
        new CronJob(config.ruleEngineRecurrence, function () {
                logger.logInfo('ruleEngineMain - running rules');
                for (var docType in factProviders) {
                    factProviders[docType]().then(iterate);
                }
            }, function () {
                logger.logInfo('ruleEngineMain - rule engine daemon has stopped');
            },
            true,
            'America/Anchorage'
        );
    }

    function iterate(docs) {
        if (docs && docs.length > 0) {
            logger.logInfo('ruleEngineMain - processing ' + docs.length + ' items');
            ruleEngine.applyRules(docs);
        }
    }
});
