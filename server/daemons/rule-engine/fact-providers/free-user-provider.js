'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    Q = require('q'),
    config = require('../../../common/setup/config'),
    logger = require('../../../common/setup/logger'),
    Account = mongoose.model('Account');

module.exports.getFreeUsers = function () {
    var def = Q.defer();
    Account.find({type: 'free'}).populate('primaryUser').exec().then(function (accounts) {
        if (accounts) {
            var userList = [];
            for (var i = 0; i < accounts.length; i++) {
                if (_.contains(['active', 'trial-ended', 'registered'], accounts[i].primaryUser.status) &&
                    moment.utc().startOf('day').diff(moment(accounts[i].startDate).utc().startOf('day'), 'days') <= 10) {
                    accounts[i].primaryUser._doc = _.assign(accounts[i].primaryUser._doc, {doctype: 'user'});
                    accounts[i].primaryUser._doc.type = 'free';
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
