'use strict';

var _ = require('lodash'),
    config = require('../../common/config/config'),
    mongoose = require('mongoose'),
    Rule = mongoose.model('Rule'),
    RuleEngine = require('node-rules'),
    rules = null;

require('./rules')().then(function () {
    Rule.find({enabled: true}, function (err, rules) {
        if (err) {
            console.log('Something went wrong while getting the rules: ' + err);
        } else {
            console.log('Setting up the rule engine...');
            for (var i = 0; i < rules.length; i++) {
                rules[i] = _.assign(rules[i], {'on': 1});
            }
            rules = new RuleEngine(rules);
        }
    });
});

module.exports.applyRules = function (docs) {
    docs.forEach(function (doc) {
        rules.execute(doc, function (result) {
            if (result && result.process) {
                delete result.result;
                delete result.process;
                config.postProcessors[result.postProcessorKey](result);
            }
        });
    });
};
