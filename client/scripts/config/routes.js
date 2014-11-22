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
                controller: 'homeCtrl',
                access: access.anon
            })
            .when('/sign-up',
            {
                templateUrl: 'views/sign-up.html',
                controller: 'homeCtrl',
                access: access.anon
            })
            .when('/forgot-password',
            {
                templateUrl: 'views/forgot-password.html',
                controller: 'homeCtrl',
                access: access.anon
            })
            .when('/reset-password',
            {
                templateUrl: 'views/reset-password.html',
                controller: 'homeCtrl',
                access: access.anon
            })
            .when('/user-home',
            {
                templateUrl: 'views/user-home.html',
                controller: 'homeCtrl',
                access: access.user
            })
            .when('/settings',
            {
                templateUrl: 'views/settings.html',
                controller: 'homeCtrl',
                access: access.user
            })
            .when('/change-credit-card',
            {
                templateUrl: 'views/change-credit-card.html',
                controller: 'homeCtrl',
                access: access.anon
            })
            .when('/not-found',
            {
                templateUrl: 'views/not-found.html',
                controller: 'homeCtrl',
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
                        var authSvc = $injector.get('authSvc');
                        authSvc.clearUser();
                        $location.path('/sign-in');
                        $location.url($location.path());
                        return $q.reject(response);
                    }
                    else {
                        return $q.reject(response);
                    }
                }
            };
        }]);
    }]);

    app.run(['$rootScope', '$location', '$http', 'authSvc', function ($rootScope, $location, $http, authSvc) {
        $rootScope.$on('$routeChangeStart', function (event, next) {
            if (next.access && !authSvc.authorize(next.access)) {
                if (authSvc.isLoggedIn()) {
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
