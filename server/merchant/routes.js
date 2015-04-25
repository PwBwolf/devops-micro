'use strict';

var _ = require('lodash'),
    MerchantCtrl = require('./controllers/merchant-controller'),
    routes = [
        {path: '/merchant/api/does-username-exist', httpMethod: 'GET', middleware: [MerchantCtrl.doesUsernameExist]},
        {path: '/merchant/api/add-user', httpMethod: 'POST', middleware: [MerchantCtrl.addUser]},
        {path: '/merchant/api/make-payment', httpMethod: 'POST', middleware: [MerchantCtrl.makePayment]}
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
