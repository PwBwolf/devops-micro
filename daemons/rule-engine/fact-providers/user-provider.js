var _ = require('lodash');
var mongoose = require('mongoose');
var Q = require('q');
var config = require('../config');

// models
User = mongoose.model('User');

module.exports.getFreeUsers = function() {
    var def = Q.defer();
    User.find().exec().then(function(users) {
        if(users) {
            for(var i = 0; i < users.length; i++) {
                users[i] = _.assign({type: 'user'}, users[i]._doc);
            }
            def.resolve(users);
        } else {
            def.resolve([]);
        }
    }, function(err) {
        def.reject(err);
    });
    return def.promise;
}

config.factProviders['free-users'] = module.exports.getFreeUsers;
