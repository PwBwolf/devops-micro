'use strict';

var mongoose = require('mongoose'),
    jwt = require('jwt-simple'),
    moment = require('moment'),
    config = require('../config/config'),
    userRoles = require('../../client/scripts/config/routing').userRoles,
    User = mongoose.model('User');

exports.signUp = function (req, res) {
    return res.send(200);
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
    console.log(req.role);
    return res.send({email: req.email, role: req.role.title, firstName: 'YipTV', lastName: 'Admin'});
};

exports.isEmailUnique = function (req, res) {
    return res.send(200);
};
