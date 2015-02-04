'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var CronJob = require('cron').CronJob,
    config = require('../../common/config/config'),
    mongoose = require('mongoose'),
    db = mongoose.connect(config.db),
    modelsPath = config.root + '/server/common/models';

require('../../common/config/models')(modelsPath);
var ruleEngine = require('./rule-engine');
require('./fact-providers/free-user-provider');
require('./post-processors/free-user-processor');
var factProviders = config.factProviders;

console.log('Starting rule engine daemon...');
new CronJob('* * * * * *', function () {
        console.log('Running rules...');
        for (var docType in factProviders) {
            factProviders[docType]().then(function (docs) {
                if (docs && docs.length > 0) {
                    console.log('Processing ' + docs.length + ' items');
                    ruleEngine.applyRules(docs);
                }
            });
        }
    }, function () {
        console.log('Rule engine daemon has stopped');
    },
    true
);
