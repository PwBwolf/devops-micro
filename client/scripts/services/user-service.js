(function (app) {
    'use strict';

    app.factory('userSvc', ['tokenSvc', '$http', '_', function (tokenSvc, $http, _) {
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
            for (userRole in userRoles) {
                if (userRole === roleName) {
                    return userRoles[userRole];
                }
            }
            console.log('Access Control Error: Could not find role "' + roleName + '"');
            return null;
        }

        function getUserProfile(success, error) {
            var user;
            $http({
                url: '/api/get-user-profile',
                method: 'GET'
            }).success(function (response) {
                user = response;
                user.role = getUserRole(response.role);
                changeUser(user);
                success(user);
            }).error(error);
        }

        return {
            accessLevels: accessLevels,
            userRoles: userRoles,
            user: currentUser,

            getUserProfile: getUserProfile,

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

            isEmailUnique: function (email, firstName, lastName, success, error) {
                $http({
                    method: 'GET',
                    url: '/api/is-email-unique',
                    params: { email: email.toLowerCase(), firstName: firstName, lastName: lastName }
                }).success(success).error(error);
            },

            signUp: function (user, success, error) {
                $http.post('/api/sign-up', user).success(success).error(error);
            },

            signIn: function (user, success, error) {
                $http.post('/api/sign-in', user).success(function (response) {
                    if (response.token) {
                        tokenSvc.setToken(user.rememberMe, response.token);
                        getUserProfile(success, error);
                    } else {
                        error();
                    }
                }).error(error);
            },

            signOut: function (success, error) {
                $http.post('/api/sign-out', null).success(function () {
                    changeUser({ email: '', role: userRoles.public });
                    success();
                }).error(error);
            },

            clearUser: function () {
                changeUser(noUser());
                tokenSvc.clearToken();
            },

            verifyUser: function (code, success, error) {
                $http.post('/api/verify-user', {code: code}).success(success).error(error);
            },

            forgotPassword: function(email, success, error) {
                $http.post('/api/forgot-password', {email: email.toLowerCase()}).success(success).error(error);
            },

            resetPassword: function(data, success, error) {
                $http.post('/api/reset-password', data).success(success).error(error);
            },

            resendVerification: function(email, success, error) {
                $http.post('/api/resend-verification', {email: email.toLowerCase()}).success(success).error(error);
            }
        };
    }]);
}(angular.module('app')));
