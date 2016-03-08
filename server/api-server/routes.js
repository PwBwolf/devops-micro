'use strict';

var _ = require('lodash'),
    MerchantCtrl = require('./controllers/merchant-controller'),
    NotificationCtrl = require('./controllers/notification-controller'),
    CrmCtrl = require('./controllers/crm-controller'),
    routes = [
        {path: '/merchant/api/verify-credentials', httpMethod: 'GET', middleware: [MerchantCtrl.verifyCredentials]},
        {path: '/merchant/api/does-username-exist', httpMethod: 'GET', middleware: [MerchantCtrl.doesUsernameExist]},
        /*{path: '/merchant/api/make-refund', httpMethod: 'POST', middleware: [MerchantCtrl.makeRefund]},*/
        {path: '/merchant/api/make-payment', httpMethod: 'POST', middleware: [MerchantCtrl.makePayment]},
        {path: '/notification/api/verify-credentials', httpMethod: 'GET', middleware: [NotificationCtrl.verifyCredentials]},
        {path: '/notification/api/execute-dunning', httpMethod: 'POST', middleware: [NotificationCtrl.executeDunning]},
        {path: '/notification/api/payment-received', httpMethod: 'POST', middleware: [NotificationCtrl.paymentReceived]},
        {path: '/crm/api/verify-credentials', httpMethod: 'GET', middleware: [CrmCtrl.verifyCredentials]}
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
