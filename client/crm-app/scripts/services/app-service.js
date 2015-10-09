(function (app) {
    'use strict';

    app.factory('appSvc', ['$http', function ($http) {

        return {
            getAppConfig: function () {
                return $http.get('/crm/api/get-app-config');
            },

            getCountries: function () {
                return $http.get('/crm/api/get-countries');
            },

            getStates: function () {
                return $http.get('/crm/api/get-states');
            }
        };
    }]);
}(angular.module('app')));
