'use strict';

var mongoose = require('mongoose'),
    jwt = require('jwt-simple'),
    uuid = require('node-uuid'),
    logger = require('../config/logger'),
    moment = require('moment'),
    config = require('../config/config'),
    userRoles = require('../../client/scripts/config/routing').userRoles,
    User = mongoose.model('User'),
    Visitor = mongoose.model('Visitor');

exports.signUp = function (req, res) {
    User.findOne({ email: req.body.email }).exec().then(function (user) {
        if(!user) {
            var userObj = new User(req.body);
            userObj.role = userRoles.user;
            userObj.createdAt = (new Date()).toUTCString();
            userObj.verificationCode = uuid.v4();
        } else {
            return res.send(500);
        }
    }, function(error){
        logger.error(error);
        return res.send(500);
    });
};

exports.signIn = function (req, res) {
    if (req.body.email === 'admin@yiptv.com' && req.body.password === 'admin') {
        var token = jwt.encode({
            email: req.body.email,
            role: userRoles.user,
            expiry: moment().add(7, 'days').valueOf()
        }, config.secretToken);
        return res.json({user: req.email, token: token});
    }
    return res.json(401, 'SignInFailed');
    /*passport.authenticate('local', function (err, user) {
     if (err) {
     return res.send(500, err.message);
     }
     if (!user) {
     return res.send(401, 'Login failed');
     }
     req.logIn(user, function (err) {
     if (err) {
     return res.send(500, err.message);
     }
     if (req.body.rememberMe) {
     req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
     }
     return res.json(200, { 'role': user.role, 'email': user.email });
     });
     })(req, res);*/
};

exports.signOut = function (req, res) {
    req.logout();
    return res.send(200);
};

exports.getUserProfile = function (req, res) {
    return res.send({email: req.email, role: req.role.title, firstName: 'YipTV', lastName: 'Admin'});
};

exports.isEmailUnique = function (req, res) {
    User.findOne({ email: req.query.email }).exec().then(function (user) {
        if(!user) {
            Visitor.findOne({email: req.query.email}).exec().then(function(visitor) {
               if(!visitor) {
                   var visitorObj = new Visitor({email: req.query.email, firstName: req.query.firstName, lastName: req.query.lastName});
                   visitorObj.save();
               } else {
                   if(req.query.firstName) {
                       visitor.firstName = req.query.firstName;
                   }
                   if(req.query.lastName) {
                       visitor.lastName = req.query.lastName;
                   }
                   if(req.query.firstName || req.query.lastName) {
                       visitor.save();
                   }
               }
            });
            return res.send(true);
        } else {
            return res.send(false);
        }
    }, function(error){
        logger.error(error);
        return res.send(500);
    });
};
