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

            getStates: function () {
                return $http.get('/api/get-states');
            },

            saveContactUs: function (data, success, error) {
                $http.post('/api/save-contact-us', data).success(success).error(error);
            },

            saveVisitor: function (visitor, success, error) {
                $http.post('/api/save-visitor', visitor).success(success).error(error);
            },

            sendRafEmails: function (data, success, error) {
                $http.post('/api/send-raf-emails', data).success(success).error(error);
            },

            getWebSliders: function () {
                return $http.get('/api/get-web-sliders');
            },

            checkComplimentaryCode: function (code) {
                return $http({
                    url: '/api/check-complimentary-code',
                    method: 'GET',
                    params: {code: code}
                });
            }
        };
    }]);
}(angular.module('app')));
