(function (app) {
    'use strict';

    app.factory('appSvc', ['$http', function ($http) {

        return {
            getAppConfig: function () {
                return $http.get('/api/get-app-config');
            },

            saveContactUs: function(contactUsData, success, error) {
                $http.post('/api/save-contact-us', contactUsData).success(success).error(error);
            }
        };
    }]);
}(angular.module('app')));
