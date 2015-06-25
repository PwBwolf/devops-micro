'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    Q = require('q'),
    config = require('../../../common/setup/config'),
    logger = require('../../../common/setup/logger'),
    User = mongoose.model('User');

module.exports.getCanceledUsers = function () {
    var def = Q.defer();
    User.find({status: 'canceled'}).populate('account').exec().then(function (users) {
            if (users) {
                var userList = [];
                for (var i = 0; i < users.length; i++) {
                    if (moment.utc().startOf('day').diff(moment(users[i].cancelDate).utc().startOf('day'), 'days') <= 1) {
                        users[i]._doc = _.assign(users[i]._doc, {doctype: 'user'});
                        users[i]._doc.type = 'paid';
                        userList.push(users[i]._doc);
                    }
                }
                def.resolve(userList);
            } else {
                def.resolve([]);
            }
        }, function (err) {
            logger.logError('canceledUserProvider - getCanceledUsers - error fetching canceled accounts');
            logger.logError(err);
            def.reject(err);
        }
    );
    return def.promise;
};

module.exports.getCancelPendingUsers = function () {
    var def = Q.defer();
    User.find({cancelOn: {$exists: true}}).populate('account').exec().then(function (users) {
            if (users) {
                var userList = [];
                for (var i = 0; i < users.length; i++) {
                    if (moment.utc().startOf('day').diff(moment(users[i].cancelOn).utc().startOf('day'), 'days') <= 1) {
                        users[i]._doc = _.assign(users[i]._doc, {doctype: 'user'});
                        users[i]._doc.type = 'paid';
                        userList.push(users[i]._doc);
                    }
                }
                def.resolve(userList);
            } else {
                def.resolve([]);
            }
        }, function (err) {
            logger.logError('canceledUserProvider - getCanceledUsers - error fetching cancel pending accounts');
            logger.logError(err);
            def.reject(err);
        }
    );
    return def.promise;
};

config.factProviders.canceledUsers = module.exports.getCanceledUsers;
config.factProviders.cancelPendingUsers = module.exports.getCancelPendingUsers;
