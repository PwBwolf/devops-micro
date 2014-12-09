var Q = require('q');
var _ = require('lodash');
var config = require('./config');
var mongoose = require('mongoose');
var Rule = mongoose.model('Rule');
var RuleEngine = require('node-rules');
var RuleEnforcer = null;

require('./rules')().then(function() {
    Rule.find({enabled: true}, function(err, rules) {
        if(err) {
            console.log('Did not find any rules!!');
        } else {
            console.log('about to setup the enforcer');
            for(var i = 0; i < rules.length; i++) {
                rules[i] = _.assign(rules[i], {"on": 1});
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
}
