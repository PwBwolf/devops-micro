'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Q = require('q'),
    config = require('../../../common/setup/config'),
    logger = require('../../../common/setup/logger'),
    Account = mongoose.model('Account');

module.exports.getComplimentaryUsers = function () {
    var def = Q.defer();
    Account.find({type: 'comp'}).populate('primaryUser').exec().then(function (accounts) {
        if (accounts) {
            var userList = [];
            for (var i = 0; i < accounts.length; i++) {
                if (accounts[i].primaryUser && (accounts[i].primaryUser.status === 'active' || accounts[i].primaryUser.status === 'registered')) {
                    accounts[i].primaryUser._doc = _.assign(accounts[i].primaryUser._doc, {doctype: 'user'});
                    accounts[i].primaryUser._doc.type = 'comp';
                    userList.push(accounts[i].primaryUser._doc);
                }
            }
            def.resolve(userList);
        } else {
            def.resolve([]);
        }
    }, function (err) {
        logger.logError('complimentaryUserProvider - getComplimentaryUsers - error fetching complimentary accounts');
        logger.logError(err);
        def.reject(err);
    });
    return def.promise;
};

config.factProviders.complimentaryUsers = module.exports.getComplimentaryUsers;
