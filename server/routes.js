'use strict';

var _ = require('lodash');

var UserController = require('./controllers/user-controller');

var routes = [
    { path: '/sign-up', httpMethod: 'POST', middleware: [UserController.signUp] },
    { path: '/sign-in', httpMethod: 'POST', middleware: [UserController.signIn] },
    { path: '/sign-out', httpMethod: 'POST', middleware: [UserController.signOut] },
    { path: '/save-visitor', httpMethod: 'POST', middleware: [UserController.saveVisitor] },
    { path: '/email-check', httpMethod: 'GET', middleware: [UserController.doesEmailExists] },
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
