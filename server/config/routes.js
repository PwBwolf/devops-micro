'use strict';

var _ = require('lodash'),
    path = require('path'),
    AuthCtrl = require('./../controllers/auth-controller'),
    VisitorCtrl = require('./../controllers/visitor-controller'),
    config = require('./../config/config'),
    userRoles = require('../../client/scripts/config/routing').userRoles,
    accessLevels = require('../../client/scripts/config/routing').accessLevels,
    routes = [
    { path: '/partials/*', httpMethod: 'GET',
        middleware: [function (req, res) {
            var requestedView = path.join('./', req.url);
            res.render(requestedView);
        }]
    },
    { path: '/api/sign-up', httpMethod: 'POST', middleware: [AuthCtrl.signUp] },
    { path: '/api/sign-in', httpMethod: 'POST', middleware: [AuthCtrl.signIn] },
    { path: '/api/sign-out', httpMethod: 'POST', middleware: [AuthCtrl.signOut] },
    { path: '/api/save-visitor', httpMethod: 'POST', middleware: [VisitorCtrl.saveVisitor] },
    { path: '/api/email-check', httpMethod: 'GET', middleware: [AuthCtrl.doesEmailExists] },
    {
        path: '/*', httpMethod: 'GET',
        middleware: [function (req, res) {
            var role = userRoles.public, email = '';
            if (req.user) {
                role = req.user.role;
                email = req.user.email;
            }
            res.cookie('user', JSON.stringify({
                'email': email,
                'role': role
            }));
            res.sendFile(config.root + '/client/index.html');
        }]
    }
];

module.exports = function (app) {
    _.each(routes, function (route) {
        route.middleware.unshift(ensureAuthorized);
        var args = _.flatten([route.path, route.middleware]);
        switch (route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
        }
    });
};

function ensureAuthorized(req, res, next) {
    var role,
        accessLevel;

    if (!req.user) {
        role = userRoles.anon;
    } else {
        role = req.user.role;
    }
    accessLevel = _.findWhere(routes, { path: req.route.path }).accessLevel || accessLevels.public;
    if (!(accessLevel.bitMask & role.bitMask)) {
        return res.send(403);
    }
    return next();
}
