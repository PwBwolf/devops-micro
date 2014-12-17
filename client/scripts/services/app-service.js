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
                data.details = data.details.replace(/(?:\r\n|\r|\n)/g, '<br/>').replace(/\s/g, '&nbsp;');
                $http.post('/api/save-contact-us', data).success(success).error(error);
            }
        };
    }]);
}(angular.module('app')));
