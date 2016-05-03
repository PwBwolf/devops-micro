'use strict';

var _ = require('lodash'),
    jwt = require('jwt-simple'),
    AppCtrl = require('./controllers/app-controller'),
    UserCtrl = require('./controllers/user-controller'),
    MediaCtrl = require('./controllers/media-controller'),
    config = require('../common/setup/config'),
    validation = require('../common/services/validation'),
    userRoles = require('../../client/web-app/scripts/config/routing').userRoles,
    accessLevels = require('../../client/web-app/scripts/config/routing').accessLevels,
    routes = [
        {path: '/api/get-app-config', httpMethod: 'GET', middleware: [AppCtrl.getAppConfig]},
        {path: '/api/get-countries', httpMethod: 'GET', middleware: [AppCtrl.getCountries]},
        {path: '/api/get-states', httpMethod: 'GET', middleware: [AppCtrl.getStates]},
        {path: '/api/contact-us', httpMethod: 'POST', middleware: [AppCtrl.saveContactUs]},
        {path: '/api/send-raf-emails', httpMethod: 'POST', middleware: [AppCtrl.sendRafEmails]},
        {path: '/api/check-complimentary-code', httpMethod: 'GET', middleware: [AppCtrl.checkComplimentaryCode]},
        {path: '/api/verify-email', httpMethod: 'GET', middleware: [AppCtrl.verifyEmail]},
        {path: '/api/verify-mobile-number', httpMethod: 'GET', middleware: [AppCtrl.verifyMobileNumber]},
        {path: '/api/sign-up', httpMethod: 'POST', middleware: [UserCtrl.signUp]},
        {path: '/api/sign-in', httpMethod: 'POST', middleware: [UserCtrl.signIn]},
        {path: '/api/is-sign-up-allowed', httpMethod: 'GET', middleware: [UserCtrl.isSignUpAllowed]},
        {path: '/api/get-customer-number-and-type', httpMethod: 'GET', middleware: [UserCtrl.getCustomerNumberAndType]},
        {path: '/api/forgot-password', httpMethod: 'POST', middleware: [UserCtrl.forgotPassword]},
        {path: '/api/resend-verification', httpMethod: 'POST', middleware: [UserCtrl.resendVerification]},
        {path: '/api/reset-password', httpMethod: 'POST', middleware: [UserCtrl.resetPassword]},
        {path: '/api/is-email-verified', httpMethod: 'GET', middleware: [UserCtrl.isEmailVerified]},
        {path: '/api/verify-pin', httpMethod: 'POST', middleware: [UserCtrl.verifyPin]},
        {
            path: '/api/get-email-sms-subscription-status',
            httpMethod: 'GET',
            middleware: [UserCtrl.getEmailSmsSubscriptionStatus]
        },
        {
            path: '/api/set-email-sms-subscription-status',
            httpMethod: 'POST',
            middleware: [UserCtrl.setEmailSmsSubscriptionStatus]
        },
        {path: '/api/sign-out', httpMethod: 'POST', middleware: [UserCtrl.signOut], accessLevel: accessLevels.user},
        {
            path: '/api/get-user-profile',
            httpMethod: 'GET',
            middleware: [UserCtrl.getUserProfile],
            accessLevel: accessLevels.user
        },
        {
            path: '/api/update-user-info',
            httpMethod: 'POST',
            middleware: [UserCtrl.updateUserInfo],
            accessLevel: accessLevels.user
        },
        {
            path: '/api/get-preferences',
            httpMethod: 'GET',
            middleware: [UserCtrl.getPreferences],
            accessLevel: accessLevels.user
        },
        {
            path: '/api/update-preferences',
            httpMethod: 'POST',
            middleware: [UserCtrl.updatePreferences],
            accessLevel: accessLevels.user
        },
        {
            path: '/api/update-language',
            httpMethod: 'POST',
            middleware: [UserCtrl.updateLanguage],
            accessLevel: accessLevels.user
        },
        {
            path: '/api/change-password',
            httpMethod: 'POST',
            middleware: [UserCtrl.changePassword],
            accessLevel: accessLevels.user
        },
        {
            path: '/api/change-credit-card',
            httpMethod: 'POST',
            middleware: [UserCtrl.changeCreditCard],
            accessLevel: accessLevels.user
        },
        {
            path: '/api/upgrade-subscription',
            httpMethod: 'POST',
            middleware: [UserCtrl.upgradeSubscription],
            accessLevel: accessLevels.user
        },
        {
            path: '/api/cancel-subscription',
            httpMethod: 'POST',
            middleware: [UserCtrl.cancelSubscription],
            accessLevel: accessLevels.user
        },
        {
            path: '/api/get-channel-url',
            httpMethod: 'GET',
            middleware: [MediaCtrl.getChannelUrl],
            accessLevel: accessLevels.user
        },
        {
            path: '/api/get-channel-guide-all',
            httpMethod: 'GET',
            middleware: [MediaCtrl.getEpg],
            accessLevel: accessLevels.user
        },
        {
            path: '/api/get-epg',
            httpMethod: 'GET',
            middleware: [MediaCtrl.getEpg],
            accessLevel: accessLevels.user
        },
        {
            path: '/api/get-user-channels',
            httpMethod: 'GET',
            middleware: [MediaCtrl.getUserChannels],
            accessLevel: accessLevels.user
        },
        {
            path: '/api/get-channel-categories',
            httpMethod: 'GET',
            middleware: [MediaCtrl.getChannelCategories],
            accessLevel: accessLevels.user
        },
        {
            path: '/api/get-favorite-channels',
            httpMethod: 'GET',
            middleware: [UserCtrl.getFavoriteChannels],
            accessLevel: accessLevels.user
        },
        {
            path: '/api/add-favorite-channel',
            httpMethod: 'POST',
            middleware: [UserCtrl.addFavoriteChannel],
            accessLevel: accessLevels.user
        },
        {
            path: '/api/remove-favorite-channel',
            httpMethod: 'POST',
            middleware: [UserCtrl.removeFavoriteChannel],
            accessLevel: accessLevels.user
        },
        {
            path: '/*', httpMethod: 'GET',
            middleware: [function (req, res) {
                res.sendFile(config.root + config.webAppClientPath + '/index.html');
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
        req.email = validation.getUsername(decodedToken.email);
        req.role = role = decodedToken.role;
    }
    accessLevel = _.findWhere(routes, {path: req.route.path}).accessLevel || accessLevels.public;
    if (!(accessLevel.bitMask & role.bitMask)) {
        return res.status(401).send('NoAccess');
    }
    return next();
}
