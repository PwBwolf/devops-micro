'use strict';

var _ = require('lodash'),
    config = require('../../common/config/config'),
    mongoose = require('mongoose'),
    Rule = mongoose.model('Rule'),
    RuleEngine = require('node-rules'),
    RuleEnforcer = null;

require('./rules')().then(function() {
    Rule.find({enabled: true}, function(err, rules) {
        if(err) {
            console.log('Did not find any rules!!');
        } else {
            console.log('about to setup the enforcer');
            for(var i = 0; i < rules.length; i++) {
                rules[i] = _.assign(rules[i], {'on': 1});
            }
            RuleEnforcer = new RuleEngine(rules);
        }
    });
});

module.exports.applyRules = function(docs) {
    docs.forEach(function(doc) {
        RuleEnforcer.execute(doc, function(result) {
            if(result && result.process) {
                delete result.result;
                delete result.process;
                config.postProcessors[result.postProcessorKey](result);
            }
        });
    });
};
