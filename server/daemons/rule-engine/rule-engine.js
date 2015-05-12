'use strict';

var _ = require('lodash'),
    config = require('../../common/setup/config'),
    logger = require('../../common/setup/logger'),
    mongoose = require('mongoose'),
    Rule = mongoose.model('Rule'),
    RuleEngine = require('node-rules'),
    appRules = null;

require('./rules')().then(function () {
    Rule.find({enabled: true}, function (err, rules) {
        if (err) {
            logger.logError('ruleEngine - error fetching the rules');
            logger.logError(err);
        } else {
            logger.logInfo('ruleEngine - setting up the rule engine');
            for (var i = 0; i < rules.length; i++) {
                rules[i] = _.assign(rules[i], {'on': 1});
            }
            appRules = new RuleEngine(rules);
        }
    });
});

module.exports.applyRules = function (docs) {
    docs.forEach(function (doc) {
        appRules.execute(doc, function (result) {
            if (result && result.process) {
                delete result.result;
                delete result.process;
                config.postProcessors[result.postProcessorKey](result);
            }
        });
    });
};
