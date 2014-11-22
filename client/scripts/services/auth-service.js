(function (app) {
    'use strict';

    app.factory('authSvc', ['$http', '_', function ($http, _) {
        var accessLevels = routing.accessLevels,
            userRoles = routing.userRoles,
            currentUser = noUser();

        function noUser() {
            return { id: '', email: '', role: userRoles.anon, firstName: '', lastName: ''};
        }

        function changeUser(user) {
            _.extend(currentUser, user);
        }

        function getUserRole(roleName) {
            var userRole;
            for(userRole in userRoles) {
                return userRoles[userRole];
            }
            return null;
        }

        return {
            accessLevels: accessLevels,
            userRoles: userRoles,
            user: currentUser,

            authorize: function (accessLevel, role) {
                if (role === undefined) {
                    role = currentUser.role;
                }
                return accessLevel.bitMask & role.bitMask;
            },

            isLoggedIn: function (user) {
                if (user === undefined) {
                    user = currentUser;
                }
                return user.role.title !== userRoles.anon.title;
            },

            isEmailUnique: function (email, success, error) {
                $http({
                    method: 'GET',
                    url: '/api/is-email-unique',
                    params: { email: email }
                }).success(success).error(error);
            },

            register: function (user, success, error) {
                $http.post('/api/register', user).success(function (res) {
                    changeUser(res);
                    success();
                }).error(error);
            },

            login: function (user, success, error) {
                $http.post('/api/login', user).success(function (user) {
                    changeUser(user);
                    success(user);
                }).error(error);
            },

            logout: function (success, error) {
                $http.post('/api/logout').success(function () {
                    changeUser({ email: '', role: userRoles.public });
                    success();
                }).error(error);
            }
        };
    }]);
}(angular.module('app')));
