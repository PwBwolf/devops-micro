'use strict';

var _ = require('lodash'),
    config = require('../../common/config/config'),
    logger = require('../../common/config/logger'),
    mongoose = require('mongoose'),
    Rule = mongoose.model('Rule'),
    RuleEngine = require('node-rules'),
    appRules = null;

require('./rules')().then(function () {
    Rule.find({enabled: true}, function (err, rules) {
        if (err) {
            logger.logError('Something went wrong while getting the rules: ' + err);
        } else {
            logger.logInfo('Setting up the rule engine...');
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
