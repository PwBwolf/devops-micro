'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var CronJob = require('cron').CronJob,
    config = require('../../common/config/config'),
    mongoose = require('mongoose'),
    db = mongoose.connect(config.db),
    modelsPath = config.root + '/server/common/models';

require('../../common/config/models')(modelsPath);
var RuleEngine = require('./rule-engine');
require('./fact-providers/user-provider');
require('./post-processors/free-user-processor');
var factProviders = config.factProviders;

console.log('Starting e-mailer daemon...');
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
    true
);
