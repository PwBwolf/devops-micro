(function (app) {
    'use strict';

    app.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
        var access = routing.accessLevels;

        $routeProvider.when('/',
            {
                templateUrl: 'views/home.html',
                controller: 'homeCtrl',
                access: access.public
            })
            .when('/sign-in',
            {
                templateUrl: 'views/sign-in.html',
                controller: 'signInCtrl',
                access: access.anon
            })
            .when('/sign-up',
            {
                templateUrl: 'views/sign-up.html',
                controller: 'signUpCtrl',
                access: access.anon
            })
            .when('/sign-up-success',
            {
                templateUrl: 'views/sign-up-success.html',
                controller: 'commonCtrl',
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
            .when('/my-account',
            {
                templateUrl: 'views/my-account.html',
                controller: 'myAccountCtrl',
                access: access.user
            })
            .when('/settings',
            {
                templateUrl: 'views/settings.html',
                controller: 'settingsCtrl',
                access: access.user
            })
            .when('/change-credit-card',
            {
                templateUrl: 'views/change-credit-card.html',
                controller: 'changeCreditCardCtrl',
                access: access.user
            })
            .when('/change-password',
            {
                templateUrl: 'views/change-password.html',
                controller: 'changePasswordCtrl',
                access: access.user
            })
            .when('/refer-friend',
            {
                templateUrl: 'views/refer-friend.html',
                controller: 'referFriendCtrl',
                access: access.public
            })
            .when('/change-password-success',
            {
                templateUrl: 'views/change-password-success.html',
                controller: 'commonCtrl',
                access: access.user
            })
            .when('/about-us',
            {
                templateUrl: 'views/about-us.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .when('/leadership',
            {
                templateUrl: 'views/leadership.html',
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
                access: access.anon
            })
            .when('/privacy-policy',
            {
                templateUrl: 'views/privacy-policy.html',
                controller: 'commonCtrl',
                access: access.public
            })
            .when('/terms-of-use',
            {
                templateUrl: 'views/terms-of-use.html',
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

    app.run(['$rootScope', '$location', '$http', 'userSvc', function ($rootScope, $location, $http, userSvc) {
        $rootScope.$on('$routeChangeStart', function (event, next) {
            if (next.access && !userSvc.authorize(next.access)) {
                if (userSvc.isSignedIn()) {
                    $location.path('/');
                    $location.url($location.path());
                } else {
                    $location.path('/sign-in');
                    $location.url($location.path());
                }
            }
        });
    }]);
}(angular.module('app')));
