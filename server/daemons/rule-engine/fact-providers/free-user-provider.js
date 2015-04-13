'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    Q = require('q'),
    config = require('../../../common/config/config'),
    logger = require('../../../common/config/logger'),
    Account = mongoose.model('Account');

module.exports.getFreeUsers = function () {
    var def = Q.defer();
    Account.find({type: 'free'}).populate('primaryUser').exec().then(function (accounts) {
        if (accounts) {
            var userList = [];
            for (var i = 0; i < accounts.length; i++) {
                if ((accounts[i].primaryUser.status === 'active' || accounts[i].primaryUser.status === 'trial-ended') &&
                    moment.utc().startOf('day').diff(moment(accounts[i].primaryUser.createdAt).utc().startOf('day'), 'days') <= 32) {
                    accounts[i].primaryUser._doc = _.assign(accounts[i].primaryUser._doc, {doctype: 'user'});
                    userList.push(accounts[i].primaryUser._doc);
                }
            }
            def.resolve(userList);
        } else {
            def.resolve([]);
        }
    }, function (err) {
        logger.logError('freeUserProvider - getFreeUsers - error fetching free accounts');
        logger.logError(err);
        def.reject(err);
    });
    return def.promise;
};

config.factProviders.freeUsers = module.exports.getFreeUsers;
