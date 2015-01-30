'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Q = require('q'),
    config = require('../../../common/config/config'),
    Account = mongoose.model('Account');

function populateAccount(account) {
    var def = Q.defer();
    account.populate('primaryUser', function (err, populatedAccount) {
        if (!err) {
            populatedAccount.primaryUser._doc = _.assign(populatedAccount.primaryUser._doc, {doctype: 'user'});
            def.resolve(populatedAccount);
        } else {
            def.reject(err);
        }
    });
    return def.promise;
}

module.exports.getFreeUsers = function () {
    var def = Q.defer();
    Account.find({type: 'free'}).exec().then(function (accounts) {
        if (accounts) {
            var accountPromises = [];
            var userList = [];
            for (var i = 0; i < accounts.length; i++) {
                var accountPromise = populateAccount(accounts[i]);
                accountPromises.push(accountPromise);
                accountPromise.then(function (account) {
                    userList.push(account.primaryUser._doc);
                }, function (err) {
                    console.log('Something went wrong when retrieving user info for account: ', err);
                });
            }
            Q.all(accountPromises).then(function () {
                def.resolve(userList);
            });
        } else {
            def.resolve([]);
        }
    }, function (err) {
        console.log('Something went wrong when retrieving free accounts: ', err);
        def.reject(err);
    });
    return def.promise;
};

config.factProviders.freeUsers = module.exports.getFreeUsers;
