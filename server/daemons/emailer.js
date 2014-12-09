var CronJob = require('cron').CronJob;
var logger = require('../config/logger');
var moment = require('moment');
var config = require('../config/config');
var email = require('../utils/email');
var RuleEngine = require('../controllers/rule-engine-controller');

// all the document types that emailer has been enabled for
var emailerEnabledFor = config.emailerEnabledFor;

new CronJob('* * * * * *', function(){
        console.log('Emailer daemon has started!');
        for(docType in emailerEnabledFor) {
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
