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
            .when('/user-home',
            {
                templateUrl: 'views/user-home.html',
                controller: 'userHomeCtrl',
                access: access.user
            })
            .when('/change-password',
            {
                templateUrl: 'views/change-password.html',
                controller: 'changePasswordCtrl',
                access: access.user
            })
            .when('/change-password-success',
            {
                templateUrl: 'views/change-password-success.html',
                controller: 'commonCtrl',
                access: access.user
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
                        $location.path('/');
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
                var routeList = ['/verify-user', '/reset-password'];
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
                        $location.path('/');
                        $location.url($location.path());
                    }
                }
            }
        });
    }]);
}(angular.module('app')));
