(function (app) {
    'use strict';

    app.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
        var access = routing.accessLevels;

        $routeProvider.when('/',
            {
                templateUrl: 'home',
                controller: 'HomeCtrl',
                access: access.user
            })
            .when('/sign-in',
            {
                templateUrl: 'sign-in',
                controller: 'SignInCtrl',
                access: access.anon
            })
            .when('/sign-up',
            {
                templateUrl: 'sign-up',
                controller: 'SignUpCtrl',
                access: access.anon
            })
            .when('/user',
            {
                templateUrl: 'user',
                controller: 'UserCtrl',
                access: access.user
            })
            .when('/admin',
            {
                templateUrl: 'admin',
                controller: 'AdminCtrl',
                access: access.admin
            })
            .when('/not-found',
            {
                templateUrl: 'not-found',
                controller: 'NotFoundCtrl',
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
