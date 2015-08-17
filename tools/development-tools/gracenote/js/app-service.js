(function (myApp) {
    'use strict';

    myApp.factory('appSvc', ['$http', function ($http) {

        return {
            getAppConfig: function () {
                return $http.get('metadata/api/get-app-config');
            },
        };
    }]);
}(angular.module('myApp')));