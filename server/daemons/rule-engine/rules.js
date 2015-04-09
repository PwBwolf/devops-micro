'use strict';

var mongoose = require('mongoose'),
    Rule = mongoose.model('Rule'),
    Q = require('q');

function buildRules() {
    var def = Q.defer();
    var ruleData = [
        {
            'name': 'free-user-4-reminder',
            'description': 'Send a reminder email to a free user after 4 days',
            'priority': 1,
            'enabled': true,
            'on': 1,
            'condition': function (fact, cb) {
                var moment = require('moment');
                if (fact.doctype === 'user') {
                    var created = fact.createdAt;
                    if (moment.utc().startOf('day').diff(moment(created).utc().startOf('day'), 'days') === 4) {
                        cb(true);
                        return;
                    }
                }
                cb(false);
            },
            'consequence': function (cb) {
                this.process = true;
                this.postProcessorKey = 'freeUser4';
                cb();
            }
        },
        {
            'name': 'free-user-6-reminder',
            'description': 'Send a reminder email to a free user after 6 days',
            'priority': 1,
            'enabled': true,
            'condition': function (fact, cb) {
                var moment = require('moment');
                if (fact.doctype === 'user') {
                    var created = fact.createdAt;
                    if (moment.utc().startOf('day').diff(moment(created).utc().startOf('day'), 'days') === 6) {
                        cb(true);
                        return;
                    }
                }
                cb(false);
            },
            'consequence': function (cb) {
                this.process = true;
                this.postProcessorKey = 'freeUser6';
                cb();
            }
        },
        {
            'name': 'free-user-7-reminder',
            'description': 'Send a reminder email to a free user after 7 days',
            'priority': 1,
            'enabled': true,
            'condition': function (fact, cb) {
                var moment = require('moment');
                if (fact.doctype === 'user') {
                    var created = fact.createdAt;
                    if (moment.utc().startOf('day').diff(moment(created).utc().startOf('day'), 'days') === 7) {
                        cb(true);
                        return;
                    }
                }
                cb(false);
            },
            'consequence': function (cb) {
                this.process = true;
                this.postProcessorKey = 'freeUser7';
                cb();
            }
        },
        {
            'name': 'free-user-8-deactivation',
            'description': 'Process user de-activation on the 8th day and send notification email',
            'priority': 1,
            'enabled': true,
            'condition': function (fact, cb) {
                var moment = require('moment');
                if (fact.doctype === 'user') {
                    var created = fact.createdAt;
                    if (moment.utc().startOf('day').diff(moment(created).utc().startOf('day'), 'days') === 8) {
                        cb(true);
                        return;
                    }
                }
                cb(false);
            },
            'consequence': function (cb) {
                this.process = true;
                this.postProcessorKey = 'freeUser8';
                cb();
            }
        },
        {
            'name': 'free-user-9-reacquire',
            'description': 'Try and reacquire the user on the 9th day',
            'priority': 1,
            'enabled': true,
            'condition': function (fact, cb) {
                var moment = require('moment');
                if (fact.doctype === 'user') {
                    var created = fact.createdAt;
                    if (moment.utc().startOf('day').diff(moment(created).utc().startOf('day'), 'days') === 9) {
                        cb(true);
                        return;
                    }
                }
                cb(false);
            },
            'consequence': function (cb) {
                this.process = true;
                this.postProcessorKey = 'freeUser9';
                cb();
            }
        },
        {
            'name': 'canceled-user-next-day',
            'description': 'Send reacquire email next day of cancellation',
            'priority': 1,
            'enabled': true,
            'condition': function (fact, cb) {
                var moment = require('moment');
                if (fact.doctype === 'user' && fact.status === 'canceled') {
                    var canceled = fact.cancelDate;
                    if (moment.utc().startOf('day').diff(moment(canceled).utc().startOf('day'), 'days') === 1) {
                        cb(true);
                        return;
                    }
                }
                cb(false);
            },
            'consequence': function (cb) {
                this.process = true;
                this.postProcessorKey = 'canceledNextDay';
                cb();
            }
        }
    ];

    Rule.collection.remove(function () {
        var rulePromises = [];
        for (var i = 0; i < ruleData.length; i++) {
            rulePromises.push(saveRule(ruleData[i]));
        }

        Q.all(rulePromises).then(function () {
            def.resolve();
        });
    });
    return def.promise;
}

function saveRule(ruleData) {
    var def = Q.defer();
    var rule = new Rule(ruleData);
    rule.save(function (err) {
        if (err) {
            console.log(err);
            def.reject(err);
        } else {
            def.resolve();
        }
    });
    return def.promise;
}

module.exports = function () {
    return buildRules();
};
