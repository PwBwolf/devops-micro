'use strict';

var _ = require('lodash'),
    jwt = require('jwt-simple'),
    AppCtrl = require('./controllers/app-controller'),
    UserCtrl = require('./controllers/user-controller'),
    AdminCtrl = require('./controllers/admin-controller'),
    config = require('../common/config/config'),
    userRoles = require('../../client/scripts/config/routing').userRoles,
    accessLevels = require('../../client/scripts/config/routing').accessLevels,
    routes = [
        {path: '/api/get-app-config', httpMethod: 'GET', middleware: [AppCtrl.getAppConfig]},
        {path: '/api/get-countries', httpMethod: 'GET', middleware: [AppCtrl.getCountries]},
        {path: '/api/get-states', httpMethod: 'GET', middleware: [AppCtrl.getStates]},
        {path: '/api/save-visitor', httpMethod: 'POST', middleware: [AppCtrl.saveVisitor]},
        {path: '/api/save-contact-us', httpMethod: 'POST', middleware: [AppCtrl.saveContactUs]},
        {path: '/api/send-raf-emails', httpMethod: 'POST', middleware: [AppCtrl.sendRafEmails]},
        {path: '/api/sign-up', httpMethod: 'POST', middleware: [UserCtrl.signUp]},
        {path: '/api/sign-in', httpMethod: 'POST', middleware: [UserCtrl.signIn]},
        {path: '/api/is-email-unique', httpMethod: 'GET', middleware: [UserCtrl.isEmailUnique]},
        {path: '/api/verify-user', httpMethod: 'POST', middleware: [UserCtrl.verifyUser]},
        {path: '/api/forgot-password', httpMethod: 'POST', middleware: [UserCtrl.forgotPassword]},
        {path: '/api/resend-verification', httpMethod: 'POST', middleware: [UserCtrl.resendVerification]},
        {path: '/api/reset-password', httpMethod: 'POST', middleware: [UserCtrl.resetPassword]},
        {path: '/api/check-reset-code', httpMethod: 'GET', middleware: [UserCtrl.checkResetCode]},
        {path: '/api/get-aio-token', httpMethod: 'GET', middleware: [UserCtrl.getAioToken]},
        {path: '/api/sign-out', httpMethod: 'POST', middleware: [UserCtrl.signOut], accessLevel: accessLevels.user},
        {path: '/api/get-user-profile', httpMethod: 'GET', middleware: [UserCtrl.getUserProfile], accessLevel: accessLevels.user},
        {path: '/api/change-password', httpMethod: 'POST', middleware: [UserCtrl.changePassword], accessLevel: accessLevels.user},
        {path: '/api/change-credit-card', httpMethod: 'POST', middleware: [UserCtrl.changeCreditCard], accessLevel: accessLevels.user},
        {path: '/api/upgrade-subscription', httpMethod: 'POST', middleware: [UserCtrl.upgradeSubscription], accessLevel: accessLevels.user},
        {path: '/api/reactivate-subscription', httpMethod: 'POST', middleware: [UserCtrl.reactivateSubscription], accessLevel: accessLevels.user},
        {path: '/api/cancel-subscription', httpMethod: 'POST', middleware: [UserCtrl.cancelSubscription], accessLevel: accessLevels.user},
        {path: '/api/admin/get-all-users', httpMethod: 'GET', middleware: [AdminCtrl.getAllUsers], accessLevel: accessLevels.admin},
        {path: '/api/admin/get-user-details', httpMethod: 'GET', middleware: [AdminCtrl.getUserDetails], accessLevel: accessLevels.admin},
        {path: '/api/admin/change-password', httpMethod: 'POST', middleware: [AdminCtrl.changePassword], accessLevel: accessLevels.admin},
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
        }
    }
    accessLevel = _.findWhere(routes, {path: req.route.path}).accessLevel || accessLevels.public;
    if (!(accessLevel.bitMask & role.bitMask)) {
        return res.status(401).send('NoAccess');
    }
    return next();
}
