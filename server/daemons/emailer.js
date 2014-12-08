var CronJob = require('cron').CronJob;
var logger = require('../config/logger');
var moment = require('moment');
var config = require('../config/config');
var email = require('../utils/email');

// all the document types that emailer has been enabled for
var emailerEnabledFor = config.emailerEnabledFor;

new CronJob('* * * * * *', function(){
        console.log('Emailer daemon has started!');

        for(docType in emailerEnabledFor) {
            var docs = emailerEnabledFor[docType]().then(function(docs) {
                var created = docs[0].createdAt;
                // pass each document through the rule engine
                console.log();
            });

        }
    }, function () {
        // This function is executed when the job stops
    },
    true /* Start the job right now */
);
