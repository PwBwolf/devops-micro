'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    Q = require('q'),
    config = require('../../../common/config/config'),
    User = mongoose.model('User');

module.exports.getCanceledUsers = function () {
    var def = Q.defer();
    User.find({status: 'canceled'}).exec().then(function (users) {
            if (users) {
                var userList = [];
                for (var i = 0; i < users.length; i++) {
                    if (moment.utc().startOf('day').diff(moment(users[i].cancelDate).utc().startOf('day'), 'days') <= 1) {
                        users[i]._doc = _.assign(users[i]._doc, {doctype: 'user'});
                        userList.push(users[i]._doc);
                    }
                }
                def.resolve(userList);
            } else {
                def.resolve([]);
            }
        }, function (err) {
            console.log('Something went wrong when retrieving canceled accounts: ', err);
            def.reject(err);
        }
    );
    return def.promise;
};

config.factProviders.canceledUsers = module.exports.getCanceledUsers;
