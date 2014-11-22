(function (app) {
    'use strict';

    app.factory('appSvc', ['$http', function ($http) {

        return {
            getAppConfig: function () {
                return $http.get('/api/get-app-config');
            }
        };

    }]);
}(angular.module('app')));
