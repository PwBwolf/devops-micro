'use strict';

var _ = require('lodash'),
    jwt = require('jwt-simple'),
    AppCtrl = require('../controllers/app-controller'),
    UserCtrl = require('../controllers/user-controller'),
    config = require('../config/config'),
    userRoles = require('../../client/scripts/config/routing').userRoles,
    accessLevels = require('../../client/scripts/config/routing').accessLevels,
    routes = [
        {path: '/api/get-app-config', httpMethod: 'GET', middleware: [AppCtrl.getAppConfig]},
        {path: '/api/sign-up', httpMethod: 'POST', middleware: [UserCtrl.signUp]},
        {path: '/api/sign-in', httpMethod: 'POST', middleware: [UserCtrl.signIn]},
        {path: '/api/sign-out', httpMethod: 'POST', middleware: [UserCtrl.signOut]},
        {path: '/api/is-email-unique', httpMethod: 'GET', middleware: [UserCtrl.isEmailUnique]},
        {path: '/api/verify-user', httpMethod: 'GET', middleware: [UserCtrl.verifyUser]},
        {
            path: '/api/get-user-profile',
            httpMethod: 'GET',
            middleware: [UserCtrl.getUserProfile],
            accessLevel: accessLevels.user
        },
        {
            path: '/*', httpMethod: 'GET',
            middleware: [function (req, res) {
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

    var token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    if (!token) {
        role = userRoles.anon;
    } else {
        var decodedToken = jwt.decode(token, config.secretToken);
        if (decodedToken.expiry <= Date.now()) {
            res.send(401, 'TokenExpired');
        } else {
            req.email = decodedToken.email;
            req.role = role = decodedToken.role;
            console.log(role);
            console.log(req.role);
        }
    }
    accessLevel = _.findWhere(routes, {path: req.route.path}).accessLevel || accessLevels.public;
    if (!(accessLevel.bitMask & role.bitMask)) {
        return res.status(401).send('NoAccess');
    }
    return next();
}
