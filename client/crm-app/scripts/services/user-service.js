(function (app) {
    'use strict';

    app.factory('userSvc', ['tokenSvc', '_', '$http', '$rootScope', function (tokenSvc, _, $http, $rootScope) {
        var accessLevels = routing.accessLevels,
            userRoles = routing.userRoles,
            currentUser = noUser();

        function noUser() {
            return {id: '', email: '', role: userRoles.anon, firstName: '', lastName: ''};
        }

        function changeUser(user) {
            _.extend(currentUser, user);
            $rootScope.$broadcast('UserChanged');
        }

        function getUserRole(roleName) {
            var userRole;
            for (userRole in userRoles) {
                if (userRole === roleName) {
                    return userRoles[userRole];
                }
            }
            return null;
        }

        function getUserProfile(success, error) {
            var user;
            $http({
                url: '/crm/api/get-user-profile',
                method: 'GET'
            }).success(function (response) {
                user = response;
                user.role = getUserRole(response.role);
                changeUser(user);
                success(user);
            }).error(error);
        }

        function clearUser () {
            changeUser(noUser());
            tokenSvc.clearToken();
        }

        return {
            accessLevels: accessLevels,
            userRoles: userRoles,
            user: currentUser,
            getUserProfile: getUserProfile,
            clearUser: clearUser,

            authorize: function (accessLevel, role) {
                if (role === undefined) {
                    role = currentUser.role;
                }
                return accessLevel.bitMask & role.bitMask;
            },

            isSignedIn: function (user) {
                if (user === undefined) {
                    user = currentUser;
                }
                return user.role.title !== userRoles.anon.title;
            },

            signIn: function (user, success, error) {
                $http.post('/crm/api/sign-in', user).success(function (response) {
                    if (response.token) {
                        tokenSvc.setToken(user.rememberMe, response.token);
                        getUserProfile(success, error);
                    } else {
                        error();
                    }
                }).error(error);
            },

            signOut: function (success, error) {
                $http.post('/crm/api/sign-out', null).success(function () {
                    clearUser();
                    success();
                }).error(function () {
                    clearUser();
                    error();
                });
            },

            changePassword: function (data, success, error) {
                $http.post('/crm/api/change-password', data).success(success).error(error);
            },

            updateLanguage: function(data, success, error) {
                $http.post('/crm/api/update-language', data).success(success).error(error);
            }
         };
    }]);
}(angular.module('app')));
