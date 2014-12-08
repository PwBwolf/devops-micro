var mongoose = require('mongoose');
var moment = require('moment');
var Rule = mongoose.model('Rule');
var logger = require('../config/logger');

function buildRules() {
    var ruleData = [
        {
            "name": "free-user-14-reminder",
            "description": "Send a reminder email to a free user after 14 days",
            "priority": 1,
            "on":1,
            "condition":
                function(fact) {
                    if(fact.type === 'user') {
                        var created = fact.createdAt;
                        if(moment().diff(created, 'days') === 14) {
                            return true;
                        }
                    }
                    return false;
                },
            "consequence":
                function() {
                    console.log("There was a match! Sending an email now...");
                }
        },
        {
            "name": "free-user-28-reminder",
            "description": "Send a reminder email to a free user after 28 days",
            "priority": 1,
            "on":1,
            "condition":
                function(fact) {
                    if(fact.type === 'user') {
                        var created = fact.createdAt;
                        if(moment().diff(created, 'days') === 28) {
                            return true;
                        }
                    }
                    return false;
                },
            "consequence":
                function() {
                    console.log("There was a match! Sending an email now...");
                }
        },
        {
            "name": "free-user-29-reminder",
            "description": "Send a reminder email to a free user after 29 days",
            "priority": 1,
            "on":1,
            "condition":
                function(fact) {
                    if(fact.type === 'user') {
                        var created = fact.createdAt;
                        if(moment().diff(created, 'days') === 29) {
                            return true;
                        }
                    }
                    return false;
                },
            "consequence":
                function() {
                    console.log("There was a match! Sending an email now...");
                }
        },
        {
            "name": "free-user-30-reminder",
            "description": "Send a reminder email to a free user after 30 days",
            "priority": 1,
            "on":1,
            "condition":
                function(fact) {
                    if(fact.type === 'user') {
                        var created = fact.createdAt;
                        if(moment().diff(created, 'days') === 7) {
                            return true;
                        }
                    }
                    return false;
                },
            "consequence":
                function() {
                    console.log("There was a match! Sending an email now...");
                }
        },
        {
            "name": "free-user-31-deactivation",
            "description": "Process user de-activation on the 31st day and send notification email",
            "priority": 1,
            "on":1,
            "condition":
                function(fact) {
                    if(fact.type === 'user') {
                        var created = fact.createdAt;
                        if(moment().diff(created, 'days') === 31) {
                            return true;
                        }
                    }
                    return false;
                },
            "consequence":
                function() {
                    console.log("There was a match! Sending an email now...");
                }
        }
    ]

    for(var i = 0; i < ruleData.length; i++) {
        var rule = new Rule(ruleData[i]);
        rule.save(function(err, rule) {
            if(err) {
                logger.logError(err);
            }
        });
    }
}

module.exports = function() {
    buildRules();
}
