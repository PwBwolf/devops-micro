(function (app) {
    'use strict';

    app.factory('adminSvc', ['$http', function ($http) {

        return {
            getAllUsers: function () {
                return $http.get('/api/admin/get-all-users');
            }
        };
    }]);
}(angular.module('app')));
