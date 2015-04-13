'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var CronJob = require('cron').CronJob,
    config = require('../../common/config/config'),
    logger = require('../../common/config/logger'),
    mongoose = require('mongoose'),
    db = mongoose.connect(config.db),
    modelsPath = config.root + '/server/common/models';

require('../../common/config/models')(modelsPath);
var ruleEngine = require('./rule-engine');
require('./fact-providers/free-user-provider');
require('./fact-providers/canceled-user-provider');
require('./fact-providers/complimentary-user-provider');
require('./post-processors/free-user-processor');
require('./post-processors/canceled-user-processor');
require('./post-processors/complimentary-user-processor');
var factProviders = config.factProviders;

logger.logInfo('Starting rule engine daemon...');
new CronJob(config.ruleEngineRecurrence, function () {
        logger.logInfo('Running rules...');
        for (var docType in factProviders) {
            factProviders[docType]().then(iterate);
        }
    }, function () {
        logger.logInfo('Rule engine daemon has stopped');
    },
    true,
    'America/Anchorage'
);

function iterate(docs) {
    if (docs && docs.length > 0) {
        logger.logInfo('Processing ' + docs.length + ' items');
        ruleEngine.applyRules(docs);
    }
}
