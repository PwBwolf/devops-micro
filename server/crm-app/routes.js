'use strict';

var _ = require('lodash'),
    jwt = require('jwt-simple'),
    AppCtrl = require('./controllers/app-controller'),
    UserCtrl = require('./controllers/user-controller'),
    config = require('../common/setup/config'),
    userRoles = require('../../client/web-app/scripts/config/routing').userRoles,
    accessLevels = require('../../client/web-app/scripts/config/routing').accessLevels,
    routes = [
        {path: '/crm/api/get-app-config', httpMethod: 'GET', middleware: [AppCtrl.getAppConfig]},
        {path: '/crm/api/sign-in', httpMethod: 'POST', middleware: [UserCtrl.signIn]},
        {path: '/crm/api/verify-user', httpMethod: 'POST', middleware: [UserCtrl.verifyUser]},
        {path: '/crm/api/forgot-password', httpMethod: 'POST', middleware: [UserCtrl.forgotPassword]},
        {path: '/crm/api/resend-verification', httpMethod: 'POST', middleware: [UserCtrl.resendVerification]},
        {path: '/crm/api/reset-password', httpMethod: 'POST', middleware: [UserCtrl.resetPassword]},
        {path: '/crm/api/check-reset-code', httpMethod: 'GET', middleware: [UserCtrl.checkResetCode]},
        {path: '/crm/api/sign-out', httpMethod: 'POST', middleware: [UserCtrl.signOut], accessLevel: accessLevels.user},
        {path: '/crm/api/get-user-profile', httpMethod: 'GET', middleware: [UserCtrl.getUserProfile], accessLevel: accessLevels.user},
        {path: '/crm/api/update-user-info', httpMethod: 'POST', middleware: [UserCtrl.updateUserInfo], accessLevel: accessLevels.user},
        {path: '/crm/api/update-language', httpMethod: 'POST', middleware: [UserCtrl.updateLanguage], accessLevel: accessLevels.user},
        {path: '/crm/api/change-password', httpMethod: 'POST', middleware: [UserCtrl.changePassword], accessLevel: accessLevels.user},
        {
            path: '/*', httpMethod: 'GET',
            middleware: [function (req, res) {
                res.sendFile(config.root + config.crmClientPath + '/index.html');
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
    var role, accessLevel;
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
        }
    }
    accessLevel = _.findWhere(routes, {path: req.route.path}).accessLevel || accessLevels.public;
    if (!(accessLevel.bitMask & role.bitMask)) {
        return res.status(401).send('NoAccess');
    }
    return next();
}
