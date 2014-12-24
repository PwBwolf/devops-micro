var mongoose = require('mongoose');
var moment = require('moment');
var Rule = mongoose.model('Rule');
var Q = require('q');

function buildRules() {
    var def = Q.defer();
    var ruleData = [
        {
            "name": "free-user-14-reminder",
            "description": "Send a reminder email to a free user after 14 days",
            "priority": 1,
            "enabled":true,
            "on": 1,
            "condition":
                function(fact, cb) {
                    var moment = require('moment');
                    if(fact.doctype === 'user') {
                        var created = fact.createdAt;
                        if(moment().diff(created, 'days') === 14) {
                            cb(true);
                            return;
                        }
                    }
                    cb(false);
                },
            "consequence":
                function(cb) {
                    this.process = true;
                    this.postProcessorKey = "freeUser14";
                    cb();
                }
        },
        {
            "name": "free-user-21-reminder",
            "description": "Send a reminder email to a free user after 21 days",
            "priority": 1,
            "enabled":true,
            "condition":
                function(fact, cb) {
                    var moment = require('moment');
                    if(fact.doctype === 'user') {
                        var created = fact.createdAt;
                        if(moment().diff(created, 'days') === 21) {
                            cb(true);
                            return;
                        }
                    }
                    cb(false);
                },
            "consequence":
                function(cb) {
                    this.process = true;
                    this.postProcessorKey = "freeUser21";
                    cb();
                }
        },
        {
            "name": "free-user-28-reminder",
            "description": "Send a reminder email to a free user after 28 days",
            "priority": 1,
            "enabled":true,
            "condition":
                function(fact, cb) {
                    var moment = require('moment');
                    if(fact.doctype === 'user') {
                        var created = fact.createdAt;
                        if(moment().diff(created, 'days') === 28) {
                            cb(true);
                            return;
                        }
                    }
                    cb(false);
                },
            "consequence":
                function(cb) {
                    this.process = true;
                    this.postProcessorKey = "freeUser28";
                    cb();
                }
        },
        {
            "name": "free-user-30-reminder",
            "description": "Send a reminder email to a free user after 30 days",
            "priority": 1,
            "enabled":true,
            "condition":
                function(fact, cb) {
                    var moment = require('moment');
                    if(fact.doctype === 'user') {
                        var created = fact.createdAt;
                        if(moment().diff(created, 'days') === 30) {
                            cb(true);
                            return;
                        }
                    }
                    cb(false);
                },
            "consequence":
                function(cb) {
                    this.process = true;
                    this.postProcessorKey = "freeUser30";
                    cb();
                }
        },
        {
            "name": "free-user-31-deactivation",
            "description": "Process user de-activation on the 31st day and send notification email",
            "priority": 1,
            "enabled":true,
            "condition":
                function(fact, cb) {
                    var moment = require('moment');
                    if(fact.doctype === 'user') {
                        var created = fact.createdAt;
                        if(moment().diff(created, 'days') === 31) {
                            cb(true);
                            return;
                        }
                    }
                    cb(false);
                },
            "consequence":
                function(cb) {
                    this.process = true;
                    this.postProcessorKey = "freeUser31";
                    cb();
                }
        }
    ]

    Rule.collection.remove(function(err, result) {
        var rulePromises = [];
        for(var i = 0; i < ruleData.length; i++) {
            rulePromises.push(saveRule(ruleData[i]));
        }

        Q.all(rulePromises).then(function() {
            def.resolve();
        });
    });

    return def.promise;
}

function saveRule(ruleData) {
    var def = Q.defer();
    var rule = new Rule(ruleData);
    rule.save(function(err, rule) {
        if(err) {
            console.log(err);
            def.reject(err);
        } else {
            def.resolve();
        }
    });
    return def.promise;
}

module.exports = function() {
    return buildRules();
}
