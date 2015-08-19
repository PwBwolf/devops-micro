(function (app) {
    'use strict';

    app.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
        var access = routing.accessLevels;

        $routeProvider.when('/',
            {
                templateUrl: 'views/home.html',
                controller: 'homeCtrl',
                access: access.anon
            })
            .when('/sign-in',
            {
                templateUrl: 'views/sign-in.html',
                controller: 'signInCtrl',
                access: access.anon
            })
            .when('/sign-up/paid',
            {
                templateUrl: 'views/sign-up.html',
                controller: 'signUpCtrl',
                access: access.anon
            })
            .when('/sign-up/free',
            {
                templateUrl: 'views/free-sign-up.html',
                controller: 'freeSignUpCtrl',
                access: access.anon
            })
            .when('/sign-up/complimentary/:compCode',
            {
                templateUrl: 'views/complimentary-sign-up.html',
                controller: 'complimentarySignUpCtrl',
                access: access.anon
            })
            .when('/sign-up/idt',
            {
                templateUrl: 'views/free-sign-up.html',
                controller: 'freeSignUpCtrl',
                access: access.anon
            })
            .when('/free-sign-up-success',
            {
                templateUrl: 'views/free-sign-up-success.html',
                controller: 'commonCtrl',
                access: access.anon
            })
            .when('/sign-up-success',
            {
                templateUrl: 'views/sign-up-success.html',
                controller: 'commonCtrl',
                access: access.anon
            })
            .when('/sign-up-success-login',
            {
                templateUrl: 'views/sign-up-success-login.html',
                controller: 'commonCtrl',
                access: access.anon
            })
            .when('/sign-up-success-payment-failure',
            {
                templateUrl: 'views/sign-up-success-payment-failure.html',
                controller: 'commonCtrl',
                access: access.anon
            })
            .when('/sign-up-success-payment-failure-login',
            {
                templateUrl: 'views/sign-up-success-payment-failure-login.html',
                controller: 'commonCtrl',
                access: access.anon
            })
            .when('/invite/:referralCode',
            {
                templateUrl: 'views/redirect.html',
                controller: 'inviteCtrl',
                access: access.anon
            })
            .when('/verify-user',
            {
                templateUrl: 'views/verify-user.html',
                controller: 'verifyUserCtrl',
                access: access.anon
            })
            .when('/forgot-password',
            {
                templateUrl: 'views/forgot-password.html',
                controller: 'forgotPasswordCtrl',
                access: access.anon
            })
            .when('/forgot-password-success',
            {
                templateUrl: 'views/forgot-password-success.html',
                controller: 'commonCtrl',
                access: access.anon
            })
            .when('/reset-password',
            {
                templateUrl: 'views/reset-password.html',
                controller: 'resetPasswordCtrl',
                access: access.anon
            })
            .when('/reset-password-success',
            {
                templateUrl: 'views/reset-password-success.html',
                controller: 'commonCtrl',
                access: access.anon
            })
            .when('/resend-verification',
            {
                templateUrl: 'views/resend-verification.html',
                controller: 'resendVerificationCtrl',
                access: access.anon
            })
            .when('/resend-verification-success',
            {
                templateUrl: 'views/resend-verification-success.html',
                controller: 'commonCtrl',
                access: access.anon
            })
            .when('/user-home',
            {
                templateUrl: 'views/user-home.html',
                controller: 'userHomeCtrl',
                access: access.user
            })
            .when('/refer-a-friend',
            {
                templateUrl: 'views/refer-a-friend.html',
                controller: 'referAFriendCtrl',
                access: access.public
            })
            .when('/refer-a-friend-success',
            {
                templateUrl: 'views/refer-a-friend-success.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .when('/contact-us',
            {
                templateUrl: 'views/contact-us.html',
                controller: 'contactUsCtrl',
                access: access.public
            })
            .when('/contact-us-success',
            {
                templateUrl: 'views/contact-us-success.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .when('/not-found',
            {
                templateUrl: 'views/not-found.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .otherwise(
            {
                redirectTo: '/not-found'
            });

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(['$q', '$location', '$injector', function ($q, $location, $injector) {
            return {
                'responseError': function (response) {
                    if (response.config.url.toLowerCase().indexOf('/api') < 0 && (response.status === 401 || response.status === 403)) {
                        var userSvc = $injector.get('userSvc');
                        userSvc.clearUser();
                        $location.path('/sign-in');
                        $location.url($location.path());
                        return $q.reject(response);
                    } else {
                        return $q.reject(response);
                    }
                }
            };
        }]);
    }]);

    app.run(['_', '$rootScope', '$route', '$location', '$http', 'userSvc', 'tokenSvc', function (_, $rootScope, $route, $location, $http, userSvc, tokenSvc) {

        $rootScope.$on('$routeChangeStart', function (event, next) {
            if (!$rootScope.profileCallCompleted) {
                var routeList = ['/verify-user', '/reset-password', '/invite'];
                if (_.contains(routeList, $location.path())) {
                    tokenSvc.clearToken();
                    $rootScope.profileCallCompleted = true;
                } else {
                    userSvc.getUserProfile(function () {
                        $rootScope.profileCallCompleted = true;
                        authRedirect();
                    }, function () {
                        $rootScope.profileCallCompleted = true;
                        authRedirect();
                    });
                }
            } else {
                authRedirect();
            }

            function authRedirect() {
                if (next.access && !userSvc.authorize(next.access)) {
                    if (userSvc.isSignedIn()) {
                        $location.path('/user-home');
                        $location.url($location.path());
                    } else {
                        $rootScope.redirectTo = $location.url();
                        $location.path('/sign-in');
                        $location.url($location.path());
                    }
                }
            }
        });
    }]);
}(angular.module('app')));
