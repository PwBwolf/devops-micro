'use strict';

var _ = require('lodash'),
    path = require('path'),
    UserController = require('./../controllers/user-controller');

var routes = [
    { path: '/partials/*', httpMethod: 'GET',
        middleware: [function (req, res) {
            var requestedView = path.join('./', req.url);
            res.render(requestedView);
        }]
    },
    { path: '/api/sign-up', httpMethod: 'POST', middleware: [UserController.signUp] },
    { path: '/api/sign-in', httpMethod: 'POST', middleware: [UserController.signIn] },
    { path: '/api/sign-out', httpMethod: 'POST', middleware: [UserController.signOut] },
    { path: '/api/save-visitor', httpMethod: 'POST', middleware: [UserController.saveVisitor] },
    { path: '/api/email-check', httpMethod: 'GET', middleware: [UserController.doesEmailExists] },
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
            res.render('index', {data: {title: config.app.name, env: process.env.NODE_ENV }});
        }]
    }
];

module.exports = function (app) {
    _.each(routes, function (route) {
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
