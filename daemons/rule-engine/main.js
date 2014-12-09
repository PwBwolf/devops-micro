'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var CronJob = require('cron').CronJob;
var moment = require('moment');
var config = require('./config');
var email = require('./services/email');
var RuleEngine = require('./rule-engine');

// all the document types that emailer has been enabled for
var emailerEnabledFor = config.factProviders;

console.log('Starting Emailer daemon...');
new CronJob('0 0 0 * * *', function(){
        for(var docType in emailerEnabledFor) {
            emailerEnabledFor[docType]().then(function(docs) {
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
