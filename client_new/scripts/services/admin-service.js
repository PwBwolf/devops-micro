(function (app) {
    'use strict';

    app.factory('adminSvc', ['$http', function ($http) {

        return {
            getAllUsers: function () {
                return $http.get('/api/admin/get-all-users');
            },

            getUserDetails: function (email) {
                return $http({
                    method: 'GET',
                    url: '/api/admin/get-user-details',
                    params: {email: email.toLowerCase().trim()}
                });
            },

            changePassword: function (data) {
                return $http.post('/api/admin/change-password', data);
            }
        };
    }]);
}(angular.module('app')));
