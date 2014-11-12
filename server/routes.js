'use strict';

var _ = require('lodash');

/* Controllers */
var UserController = require('./controllers/user-controller');

var routes = [
    {   path: '/signup', httpMethod: 'POST', middleware: [UserController.signup]},
    {   path: '/login', httpMethod: 'POST', middleware: [UserController.login]},
    {   path: '/logout', httpMethod: 'POST', middleware: [UserController.logout]}
];


// Note about OPTIONS: Nodejs automatically responds to OPTIONS requests with the list of handlers
// defined above. eg. If only GET and POST handlers for the /flight proxy are defined above, then
// curl -X OPTIONS http://localhost:3000/flight
// will return GET,POST~
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
