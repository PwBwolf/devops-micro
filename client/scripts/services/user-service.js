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

            isEmailUnique: function (email, success, error) {
                $http({
                    method: 'GET',
                    url: '/api/is-email-unique',
                    params: {email: email.toLowerCase().trim()}
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
                    clearUser();
                    success();
                }).error(function () {
                    clearUser();
                    error();
                });
            },

            verifyUser: function (code, success, error) {
                $http.post('/api/verify-user', {code: code}).success(success).error(error);
            },

            forgotPassword: function (email, success, error) {
                $http.post('/api/forgot-password', {email: email.toLowerCase()}).success(success).error(error);
            },

            resetPassword: function (data, success, error) {
                $http.post('/api/reset-password', data).success(success).error(error);
            },

            changePassword: function (data, success, error) {
                $http.post('/api/change-password', data).success(success).error(error);
            },

            resendVerification: function (email, success, error) {
                $http.post('/api/resend-verification', {email: email.toLowerCase()}).success(success).error(error);
            },

            checkResetCode: function (code, success, error) {
                $http({
                    url: '/api/check-reset-code',
                    method: 'GET',
                    params: {code: code}
                }).success(success).error(error);
            },

            getAioToken: function (success, error) {
                $http({
                    url: '/api/get-aio-token',
                    method: 'GET'
                }).success(success).error(error);
            },

            upgradeSubscription: function (data, success, error) {
                $http.post('/api/upgrade-subscription', data).success(success).error(error);
            },

            reactivateSubscription: function (data, success, error) {
                $http.post('/api/reactivate-subscription', data).success(success).error(error);
            },

            changeCreditCard: function (data, success, error) {
                $http.post('/api/change-credit-card', data).success(success).error(error);
            },

            cancelSubscription: function(success, error) {
                $http.post('/api/cancel-subscription').success(success).error(error);
            },

            getPreferences: function(success, error) {
                $http.get('/api/get-preferences').success(success).error(error);
            },

            updatePreferences: function(data, success, error) {
                $http.post('/api/update-preferences', data).success(success).error(error);
            },

            getUserChannels: function(success, error) {
                $http.get('/api/get-user-channels').success(success).error(error);
            }
         };
    }]);
}(angular.module('app')));
