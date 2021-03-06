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
                $http.post('/api/contact-us', data).success(success).error(error);
            },

            sendRafEmails: function (data, success, error) {
                $http.post('/api/send-raf-emails', data).success(success).error(error);
            },

            checkComplimentaryCode: function (code) {
                return $http({
                    url: '/api/check-complimentary-code',
                    method: 'GET',
                    params: {code: code}
                });
            },

            verifyMobileNumber: function (mobileNumber, success, error) {
                return $http({
                    url: '/api/verify-mobile-number',
                    method: 'GET',
                    params: {mobileNumber: mobileNumber}
                }).success(success).error(error);;
            }
        };
    }]);
}(angular.module('app')));
