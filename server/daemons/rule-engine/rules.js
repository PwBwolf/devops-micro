'use strict';

var mongoose = require('mongoose'),
    Rule = mongoose.model('Rule'),
    logger = require('../../common/setup/logger'),
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
                if (fact.doctype === 'user' && fact.type === 'free' && (fact.status === 'active' || fact.status === 'registered')) {
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
                if (fact.doctype === 'user' && fact.type === 'free' && (fact.status === 'active' || fact.status === 'registered')) {
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
                if (fact.doctype === 'user' && fact.type === 'free' && (fact.status === 'active' || fact.status === 'registered')) {
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
            'description': 'Deactivate user on the 8th day and send notification email',
            'priority': 1,
            'enabled': true,
            'condition': function (fact, cb) {
                var moment = require('moment');
                if (fact.doctype === 'user' && fact.type === 'free' && (fact.status === 'active' || fact.status === 'registered')) {
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
            'name': 'cancel-user',
            'description': 'Cancel users if cancellation requested on last billing day',
            'priority': 1,
            'enabled': true,
            'condition': function (fact, cb) {
                var moment = require('moment');
                if (fact.doctype === 'user' && fact.status === 'active' && fact.type === 'paid') {
                    var cancelOn = fact.cancelOn;
                    if (moment.utc().startOf('day').diff(moment(cancelOn).utc().startOf('day'), 'days') === 1) {
                        cb(true);
                        return;
                    }
                }
                cb(false);
            },
            'consequence': function (cb) {
                this.process = true;
                this.postProcessorKey = 'canceledUser';
                cb();
            }
        },
        {
            'name': 'complimentary-user-deactivation',
            'description': 'Deactivate user and send notification email',
            'priority': 1,
            'enabled': true,
            'condition': function (fact, cb) {
                var moment = require('moment');
                if (fact.doctype === 'user' && (fact.status === 'active' || fact.status === 'registered') && fact.type === 'comp') {
                    var validTill = fact.validTill;
                    if (moment.utc().startOf('day').diff(moment(validTill).utc().startOf('day'), 'days') === 1) {
                        cb(true);
                        return;
                    }
                }
                cb(false);
            },
            'consequence': function (cb) {
                this.process = true;
                this.postProcessorKey = 'complimentaryEnded';
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
            logger.logError('rules - saveRule - error in saving rule');
            logger.logError(err);
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
