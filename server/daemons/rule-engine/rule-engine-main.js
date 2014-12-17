'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var CronJob = require('cron').CronJob;
var config = require('../../common/config/config');
var mongoose = require('mongoose');
var db = mongoose.connect(config.db);
var modelsPath = config.root + '/server/common/models';

/* Load all the models */
require('../../common/config/models')(modelsPath);

/* Load the rule engine */
var RuleEngine = require('./rule-engine');

/* Load all available providers */
require('./fact-providers/user-provider');

/* Load all available post processors */
require('./post-processors/free-user-processor');

// all the fact providers that have been configured to provide facts
var factProviders = config.factProviders;

console.log('Starting Emailer daemon...');
new CronJob('0 0 0 * * *', function(){
        for(var docType in factProviders) {
            factProviders[docType]().then(function(docs) {
                if(docs && docs.length > 0) {
                    RuleEngine.applyRules(docs);
                }
            });
        }
    }, function () {
        // This function is executed when the job stops
    },
    true /* Start the job right now */
);
