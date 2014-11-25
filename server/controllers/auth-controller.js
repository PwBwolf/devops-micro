'use strict';

var passport = require('passport'),
    mongoose = require('mongoose'),
    userRoles = require('../../client/scripts/config/routing').userRoles,
    User = mongoose.model('User');

exports.signUp = function(req, res) {
    return res.send(200);
};

exports.signIn = function(req, res) {
    passport.authenticate('local', function (err, user) {
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
    })(req, res);
};

exports.signOut = function(req, res) {
    req.logout();
    return res.send(200);
};

exports.saveVisitor = function(req, res) {
    return res.send(200);
};

exports.doesEmailExists = function(req, res) {
    return res.send(200);
};
