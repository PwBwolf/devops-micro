(function (app) {
    'use strict';

    app.factory('appSvc', ['$http', function ($http) {

        return {
            getAppConfig: function () {
                return $http.get('/api/get-app-config');
            },

            getCountries: function () {
                return $http.get('/api/get-countries');
            },

            saveContactUs: function (data, success, error) {
                $http.post('/api/save-contact-us', data).success(success).error(error);
            },

            saveVisitor: function (visitor, success, error) {
                $http.post('/api/save-visitor', visitor).success(success).error(error);
            },

            sendRafEmails: function (data, success, error) {
                $http.post('/api/send-raf-emails', data).success(success).error(error);
            }
        };
    }]);
}(angular.module('app')));
